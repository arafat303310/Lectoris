import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Service } from "@shared/schema";

const serviceRequestSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  notes: z.string().min(10, "Please provide details about your request"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
});

type ServiceRequestForm = z.infer<typeof serviceRequestSchema>;

interface ServiceRequestFormProps {
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceRequestForm({ services, isOpen, onClose }: ServiceRequestFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServiceRequestForm>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      serviceId: "",
      notes: "",
      paymentMethod: "",
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: ServiceRequestForm) => {
      return await apiRequest("POST", "/api/service-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Service Request Submitted",
        description: "Your service request has been submitted successfully. We'll contact you soon!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests"] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit service request",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ServiceRequestForm) => {
    setIsSubmitting(true);
    createRequestMutation.mutate(data);
  };

  const selectedService = services.find(s => s.id === form.watch("serviceId"));

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-testid="service-request-dialog">
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Request Service</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="service-select">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id} data-testid={`service-option-${service.id}`}>
                          {service.name} - {service.currency} {parseFloat(service.price).toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedService && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">{selectedService.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{selectedService.description}</p>
                <p className="text-lg font-bold text-primary">
                  {selectedService.currency} {parseFloat(selectedService.price).toLocaleString()}
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about your requirements, deadlines, and any specific instructions..."
                      className="min-h-[120px]"
                      data-testid="request-notes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="payment-method-select">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mtn_mobile_money" data-testid="payment-mtn">MTN Mobile Money</SelectItem>
                      <SelectItem value="airtel_money" data-testid="payment-airtel">Airtel Money</SelectItem>
                      <SelectItem value="visa" data-testid="payment-visa">Visa/Mastercard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose} data-testid="cancel-request-button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} data-testid="submit-request-button">
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
