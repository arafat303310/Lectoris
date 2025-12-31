import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Smartphone, CreditCard, Check, ArrowLeft, Loader2, Shield, Clock } from "lucide-react";
import type { SubscriptionPlan, Service, Order, User } from "@shared/schema";

function formatPrice(price: string | null): string {
  if (!price || price === "0") return "Free";
  const num = parseInt(price);
  return `UGX ${num.toLocaleString()}`;
}

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const orderType = searchParams.get("type") as "service" | "subscription" | null;
  const serviceId = searchParams.get("serviceId");
  const planId = searchParams.get("planId");
  
  const [paymentMethod, setPaymentMethod] = useState<"mtn_momo" | "airtel_money" | "card">("mtn_momo");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const { data: service, isLoading: serviceLoading } = useQuery<Service>({
    queryKey: ["/api/services", serviceId],
    enabled: orderType === "service" && !!serviceId,
  });

  const { data: plans } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
    enabled: orderType === "subscription",
  });

  const selectedPlan = plans?.find(p => p.id === planId);

  const { data: userSubscription } = useQuery({
    queryKey: ["/api/user/subscription"],
    enabled: !!user,
  });

  const validateDiscountMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/discounts/validate", { code, orderType });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.valid) {
        setAppliedDiscount(data.discount);
        toast({ title: "Discount applied!", description: data.discount.description });
      }
    },
    onError: (error: any) => {
      setAppliedDiscount(null);
      toast({ title: "Invalid code", description: error.message, variant: "destructive" });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const orderData: any = {
        orderType,
        discountCode: appliedDiscount?.code,
      };
      
      if (orderType === "service") {
        orderData.serviceId = serviceId;
      } else if (orderType === "subscription") {
        orderData.subscriptionPlanId = planId;
        orderData.billingCycle = billingCycle;
      }
      
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: async (order: Order) => {
      const res = await apiRequest("POST", "/api/payments/initiate", {
        orderId: order.id,
        paymentMethod,
        phoneNumber: paymentMethod !== "card" ? phoneNumber : undefined,
      });
      const data = await res.json();
      
      toast({ 
        title: "Payment Initiated", 
        description: data.message || "Processing your payment...",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      
      setTimeout(() => {
        setLocation("/dashboard");
      }, 3000);
    },
    onError: (error: any) => {
      toast({ 
        title: "Payment Failed", 
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const calculatePrice = () => {
    let basePrice = "0";
    let discount = 0;
    
    if (orderType === "service" && service) {
      basePrice = service.basePrice;
      if (userSubscription?.plan?.serviceDiscount) {
        discount += parseFloat(basePrice) * userSubscription.plan.serviceDiscount / 100;
      }
    } else if (orderType === "subscription" && selectedPlan) {
      basePrice = billingCycle === "annual" && selectedPlan.annualPrice 
        ? selectedPlan.annualPrice 
        : selectedPlan.monthlyPrice;
    }
    
    if (appliedDiscount) {
      if (appliedDiscount.discountType === "percentage") {
        discount += parseFloat(basePrice) * parseFloat(appliedDiscount.discountValue) / 100;
      } else {
        discount += parseFloat(appliedDiscount.discountValue);
      }
    }
    
    const final = Math.max(0, parseFloat(basePrice) - discount);
    return { basePrice, discount, final };
  };

  const prices = calculatePrice();

  if (!orderType || (!serviceId && !planId)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Checkout</h1>
          <p className="text-muted-foreground mb-6">Please select a service or plan to purchase.</p>
          <Link href="/pricing">
            <Button>View Pricing</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to complete your purchase.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="checkout-page">
      <SEO 
        title="Checkout | ApplyHub"
        description="Complete your purchase securely with MTN MoMo, Airtel Money, or card."
        canonical="/checkout"
      />
      <Navbar />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Link href="/pricing" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pricing
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose how you'd like to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}
                  className="space-y-4"
                >
                  <div className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer ${paymentMethod === "mtn_momo" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value="mtn_momo" id="mtn_momo" />
                    <Label htmlFor="mtn_momo" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <p className="font-medium">MTN Mobile Money</p>
                        <p className="text-xs text-muted-foreground">Pay with your MTN MoMo account</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer ${paymentMethod === "airtel_money" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value="airtel_money" id="airtel_money" />
                    <Label htmlFor="airtel_money" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Airtel Money</p>
                        <p className="text-xs text-muted-foreground">Pay with your Airtel Money account</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard accepted</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {(paymentMethod === "mtn_momo" || paymentMethod === "airtel_money") && (
                  <div className="mt-6">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g., 0771234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-2"
                      data-testid="phone-input"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You'll receive a payment prompt on this number
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discount Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    disabled={!!appliedDiscount}
                    data-testid="discount-input"
                  />
                  <Button
                    variant="outline"
                    onClick={() => validateDiscountMutation.mutate(discountCode)}
                    disabled={!discountCode || !!appliedDiscount || validateDiscountMutation.isPending}
                    data-testid="apply-discount"
                  >
                    {validateDiscountMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : appliedDiscount ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
                {appliedDiscount && (
                  <Badge variant="secondary" className="mt-2">
                    {appliedDiscount.code}: {appliedDiscount.discountType === "percentage" 
                      ? `${appliedDiscount.discountValue}% off` 
                      : `${formatPrice(appliedDiscount.discountValue)} off`}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderType === "service" && service && (
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Clock className="h-3 w-3" />
                      <span>Delivery: {service.deliveryDays} days</span>
                    </div>
                  </div>
                )}

                {orderType === "subscription" && selectedPlan && (
                  <div>
                    <h3 className="font-medium">{selectedPlan.name} Plan</h3>
                    <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                    
                    {selectedPlan.annualPrice && (
                      <div className="mt-4">
                        <Label className="text-sm">Billing Cycle</Label>
                        <RadioGroup
                          value={billingCycle}
                          onValueChange={(v) => setBillingCycle(v as "monthly" | "annual")}
                          className="mt-2 space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <Label htmlFor="monthly" className="text-sm cursor-pointer">
                              Monthly - {formatPrice(selectedPlan.monthlyPrice)}/month
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="annual" id="annual" />
                            <Label htmlFor="annual" className="text-sm cursor-pointer">
                              Annual - {formatPrice(selectedPlan.annualPrice)}/year
                              <Badge variant="secondary" className="ml-2 text-xs">Save 17%</Badge>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(prices.basePrice)}</span>
                  </div>
                  {prices.discount > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>Discount</span>
                      <span>-{formatPrice(String(Math.round(prices.discount)))}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(String(Math.round(prices.final)))}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => createOrderMutation.mutate()}
                  disabled={createOrderMutation.isPending || (paymentMethod !== "card" && !phoneNumber)}
                  data-testid="pay-button"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>Pay {formatPrice(String(Math.round(prices.final)))}</>
                  )}
                </Button>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment processed by trusted providers</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
