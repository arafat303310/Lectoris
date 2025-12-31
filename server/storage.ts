import {
  type User,
  type UpsertUser,
  type University,
  type InsertUniversity,
  type Scholarship,
  type InsertScholarship,
  type Service,
  type InsertService,
  type ServiceRequest,
  type InsertServiceRequest,
  type SavedUniversity,
  type SavedScholarship,
  type SubscriptionPlan,
  type InsertSubscriptionPlan,
  type UserSubscription,
  type InsertUserSubscription,
  type Order,
  type InsertOrder,
  type Payment,
  type InsertPayment,
  type Discount,
  type InsertDiscount,
} from "@shared/schema";
import { nanoid } from "nanoid";
import { ugandaUniversitiesData, ugandaScholarshipsData, servicesData, subscriptionPlansData } from "./seed-data";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, user: Partial<UpsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUniversities(search?: string, type?: string, location?: string): Promise<University[]>;
  getUniversity(id: string): Promise<University | undefined>;
  createUniversity(university: InsertUniversity): Promise<University>;
  updateUniversity(id: string, university: Partial<InsertUniversity>): Promise<University>;
  deleteUniversity(id: string): Promise<void>;
  getScholarships(search?: string, type?: string, level?: string): Promise<Scholarship[]>;
  getScholarship(id: string): Promise<Scholarship | undefined>;
  createScholarship(scholarship: InsertScholarship): Promise<Scholarship>;
  updateScholarship(id: string, scholarship: Partial<InsertScholarship>): Promise<Scholarship>;
  deleteScholarship(id: string): Promise<void>;
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  getServiceRequests(userId?: string): Promise<ServiceRequest[]>;
  getServiceRequest(id: string): Promise<ServiceRequest | undefined>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: string, request: Partial<InsertServiceRequest>): Promise<ServiceRequest>;
  saveUniversity(userId: string, universityId: string): Promise<SavedUniversity>;
  unsaveUniversity(userId: string, universityId: string): Promise<void>;
  getUserSavedUniversities(userId: string): Promise<University[]>;
  saveScholarship(userId: string, scholarshipId: string): Promise<SavedScholarship>;
  unsaveScholarship(userId: string, scholarshipId: string): Promise<void>;
  getUserSavedScholarships(userId: string): Promise<Scholarship[]>;
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined>;
  getSubscriptionPlanByTier(tierKey: string): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: string, plan: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan>;
  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  createUserSubscription(sub: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(id: string, sub: Partial<InsertUserSubscription>): Promise<UserSubscription>;
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order>;
  getPayments(userId?: string): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment>;
  getDiscounts(): Promise<Discount[]>;
  getDiscountByCode(code: string): Promise<Discount | undefined>;
  createDiscount(discount: InsertDiscount): Promise<Discount>;
  updateDiscount(id: string, discount: Partial<InsertDiscount>): Promise<Discount>;
}

export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private universities: Map<string, University> = new Map();
  private scholarships: Map<string, Scholarship> = new Map();
  private services: Map<string, Service> = new Map();
  private serviceRequests: Map<string, ServiceRequest> = new Map();
  private savedUniversities: Map<string, SavedUniversity> = new Map();
  private savedScholarships: Map<string, SavedScholarship> = new Map();
  private subscriptionPlans: Map<string, SubscriptionPlan> = new Map();
  private userSubscriptions: Map<string, UserSubscription> = new Map();
  private orders: Map<string, Order> = new Map();
  private payments: Map<string, Payment> = new Map();
  private discounts: Map<string, Discount> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    ugandaUniversitiesData.forEach((uni) => {
      const id = nanoid();
      const university: University = {
        id,
        name: uni.name,
        location: uni.location,
        type: uni.type,
        status: uni.status,
        description: uni.description,
        tuitionMin: uni.tuitionMin,
        tuitionMax: uni.tuitionMax,
        applicationDeadline: null,
        websiteUrl: uni.websiteUrl,
        applicationPortalUrl: uni.applicationPortalUrl || null,
        logoUrl: uni.logoUrl || null,
        established: uni.established,
        ranking: uni.ranking,
        specialties: uni.specialties,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.universities.set(id, university);
    });

    ugandaScholarshipsData.forEach((sch) => {
      const id = nanoid();
      const scholarship: Scholarship = {
        id,
        title: sch.title,
        description: sch.description,
        provider: sch.provider,
        amount: sch.amount,
        currency: sch.currency,
        eligibility: sch.eligibility,
        level: sch.level,
        type: sch.type,
        deadline: sch.deadline,
        applicationUrl: sch.applicationUrl || null,
        logoUrl: sch.logoUrl || null,
        isActive: sch.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.scholarships.set(id, scholarship);
    });

    servicesData.forEach((svc) => {
      const id = nanoid();
      const service: Service = {
        id,
        name: svc.name,
        description: svc.description,
        category: svc.category,
        basePrice: svc.basePrice,
        currency: "UGX",
        deliveryDays: svc.deliveryDays,
        isActive: svc.isActive,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.services.set(id, service);
    });

    subscriptionPlansData.forEach((plan) => {
      const id = nanoid();
      const subscriptionPlan: SubscriptionPlan = {
        id,
        name: plan.name,
        tierKey: plan.tierKey,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        currency: "UGX",
        features: plan.features,
        serviceDiscount: plan.serviceDiscount,
        aiChatLimit: plan.aiChatLimit,
        documentReviews: plan.documentReviews,
        adsEnabled: plan.adsEnabled,
        isActive: true,
        sortOrder: plan.sortOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.subscriptionPlans.set(id, subscriptionPlan);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.get(userData.id!);
    const user: User = {
      id: userData.id!,
      email: userData.email ?? null,
      username: userData.username ?? null,
      password: userData.password ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      phone: userData.phone ?? null,
      isAdmin: existing?.isAdmin ?? false,
      subscriptionTier: userData.subscriptionTier ?? "free",
      createdAt: existing?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id!, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || nanoid();
    const user: User = {
      id,
      email: userData.email ?? null,
      username: userData.username ?? null,
      password: userData.password ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      phone: userData.phone ?? null,
      isAdmin: userData.isAdmin ?? false,
      subscriptionTier: userData.subscriptionTier ?? "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) throw new Error("User not found");
    const user: User = {
      ...existing,
      ...userData,
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUniversities(search?: string, type?: string, location?: string): Promise<University[]> {
    let results = Array.from(this.universities.values());

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (uni) =>
          uni.name.toLowerCase().includes(searchLower) ||
          (uni.description && uni.description.toLowerCase().includes(searchLower))
      );
    }

    if (type) {
      results = results.filter((uni) => uni.type === type);
    }

    if (location) {
      const locationLower = location.toLowerCase();
      results = results.filter((uni) => uni.location.toLowerCase().includes(locationLower));
    }

    return results.sort((a, b) => {
      const rankA = a.ranking ?? 999;
      const rankB = b.ranking ?? 999;
      return rankA - rankB;
    });
  }

  async getUniversity(id: string): Promise<University | undefined> {
    return this.universities.get(id);
  }

  async createUniversity(university: InsertUniversity): Promise<University> {
    const id = nanoid();
    const newUniversity: University = {
      id,
      name: university.name,
      location: university.location,
      type: university.type,
      status: university.status,
      description: university.description ?? null,
      tuitionMin: university.tuitionMin ?? null,
      tuitionMax: university.tuitionMax ?? null,
      applicationDeadline: university.applicationDeadline ?? null,
      websiteUrl: university.websiteUrl ?? null,
      applicationPortalUrl: university.applicationPortalUrl ?? null,
      logoUrl: university.logoUrl ?? null,
      established: university.established ?? null,
      ranking: university.ranking ?? null,
      specialties: university.specialties ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.universities.set(id, newUniversity);
    return newUniversity;
  }

  async updateUniversity(id: string, university: Partial<InsertUniversity>): Promise<University> {
    const existing = this.universities.get(id);
    if (!existing) throw new Error("University not found");
    const updated: University = {
      ...existing,
      ...university,
      updatedAt: new Date(),
    };
    this.universities.set(id, updated);
    return updated;
  }

  async deleteUniversity(id: string): Promise<void> {
    this.universities.delete(id);
  }

  async getScholarships(search?: string, type?: string, level?: string): Promise<Scholarship[]> {
    let results = Array.from(this.scholarships.values()).filter((s) => s.isActive);

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (sch) =>
          sch.title.toLowerCase().includes(searchLower) ||
          (sch.description && sch.description.toLowerCase().includes(searchLower)) ||
          sch.provider.toLowerCase().includes(searchLower)
      );
    }

    if (type) {
      results = results.filter((sch) => sch.type === type);
    }

    if (level) {
      results = results.filter((sch) => sch.level === level || sch.level === "both");
    }

    return results.sort((a, b) => {
      if (!a.deadline || !b.deadline) return 0;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }

  async getScholarship(id: string): Promise<Scholarship | undefined> {
    return this.scholarships.get(id);
  }

  async createScholarship(scholarship: InsertScholarship): Promise<Scholarship> {
    const id = nanoid();
    const newScholarship: Scholarship = {
      id,
      title: scholarship.title,
      description: scholarship.description,
      provider: scholarship.provider,
      amount: scholarship.amount ?? null,
      currency: scholarship.currency ?? "UGX",
      eligibility: scholarship.eligibility,
      level: scholarship.level,
      type: scholarship.type,
      deadline: scholarship.deadline,
      applicationUrl: scholarship.applicationUrl ?? null,
      logoUrl: scholarship.logoUrl ?? null,
      isActive: scholarship.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scholarships.set(id, newScholarship);
    return newScholarship;
  }

  async updateScholarship(id: string, scholarship: Partial<InsertScholarship>): Promise<Scholarship> {
    const existing = this.scholarships.get(id);
    if (!existing) throw new Error("Scholarship not found");
    const updated: Scholarship = {
      ...existing,
      ...scholarship,
      updatedAt: new Date(),
    };
    this.scholarships.set(id, updated);
    return updated;
  }

  async deleteScholarship(id: string): Promise<void> {
    this.scholarships.delete(id);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter((s) => s.isActive);
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(service: InsertService): Promise<Service> {
    const id = nanoid();
    const newService: Service = {
      id,
      name: service.name,
      description: service.description,
      category: service.category,
      basePrice: service.basePrice,
      currency: service.currency ?? "UGX",
      deliveryDays: service.deliveryDays ?? 7,
      isActive: service.isActive ?? true,
      sortOrder: service.sortOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.services.set(id, newService);
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const existing = this.services.get(id);
    if (!existing) throw new Error("Service not found");
    const updated: Service = {
      ...existing,
      ...service,
      updatedAt: new Date(),
    };
    this.services.set(id, updated);
    return updated;
  }

  async getServiceRequests(userId?: string): Promise<ServiceRequest[]> {
    let results = Array.from(this.serviceRequests.values());
    if (userId) {
      results = results.filter((r) => r.userId === userId);
    }
    return results.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getServiceRequest(id: string): Promise<ServiceRequest | undefined> {
    return this.serviceRequests.get(id);
  }

  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const id = nanoid();
    const newRequest: ServiceRequest = {
      id,
      userId: request.userId,
      serviceId: request.serviceId,
      status: "pending",
      notes: request.notes ?? null,
      adminNotes: null,
      documentsUrl: null,
      paymentStatus: "pending",
      paymentMethod: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.serviceRequests.set(id, newRequest);
    return newRequest;
  }

  async updateServiceRequest(id: string, request: Partial<InsertServiceRequest>): Promise<ServiceRequest> {
    const existing = this.serviceRequests.get(id);
    if (!existing) throw new Error("Service request not found");
    const updated: ServiceRequest = {
      ...existing,
      ...request,
      updatedAt: new Date(),
    };
    this.serviceRequests.set(id, updated);
    return updated;
  }

  async saveUniversity(userId: string, universityId: string): Promise<SavedUniversity> {
    const key = `${userId}-${universityId}`;
    const saved: SavedUniversity = {
      id: nanoid(),
      userId,
      universityId,
      createdAt: new Date(),
    };
    this.savedUniversities.set(key, saved);
    return saved;
  }

  async unsaveUniversity(userId: string, universityId: string): Promise<void> {
    const key = `${userId}-${universityId}`;
    this.savedUniversities.delete(key);
  }

  async getUserSavedUniversities(userId: string): Promise<University[]> {
    const saved = Array.from(this.savedUniversities.values()).filter((s) => s.userId === userId);
    return saved
      .map((s) => this.universities.get(s.universityId))
      .filter((u): u is University => u !== undefined);
  }

  async saveScholarship(userId: string, scholarshipId: string): Promise<SavedScholarship> {
    const key = `${userId}-${scholarshipId}`;
    const saved: SavedScholarship = {
      id: nanoid(),
      userId,
      scholarshipId,
      createdAt: new Date(),
    };
    this.savedScholarships.set(key, saved);
    return saved;
  }

  async unsaveScholarship(userId: string, scholarshipId: string): Promise<void> {
    const key = `${userId}-${scholarshipId}`;
    this.savedScholarships.delete(key);
  }

  async getUserSavedScholarships(userId: string): Promise<Scholarship[]> {
    const saved = Array.from(this.savedScholarships.values()).filter((s) => s.userId === userId);
    return saved
      .map((s) => this.scholarships.get(s.scholarshipId))
      .filter((s): s is Scholarship => s !== undefined);
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values())
      .filter((p) => p.isActive)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }

  async getSubscriptionPlanByTier(tierKey: string): Promise<SubscriptionPlan | undefined> {
    return Array.from(this.subscriptionPlans.values()).find((p) => p.tierKey === tierKey);
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = nanoid();
    const newPlan: SubscriptionPlan = {
      id,
      name: plan.name,
      tierKey: plan.tierKey,
      description: plan.description ?? null,
      monthlyPrice: plan.monthlyPrice,
      annualPrice: plan.annualPrice ?? null,
      currency: plan.currency ?? "UGX",
      features: (plan.features as string[]) ?? [],
      serviceDiscount: plan.serviceDiscount ?? 0,
      aiChatLimit: plan.aiChatLimit ?? 5,
      documentReviews: plan.documentReviews ?? 0,
      adsEnabled: plan.adsEnabled ?? true,
      isActive: plan.isActive ?? true,
      sortOrder: plan.sortOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.subscriptionPlans.set(id, newPlan);
    return newPlan;
  }

  async updateSubscriptionPlan(id: string, plan: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan> {
    const existing = this.subscriptionPlans.get(id);
    if (!existing) throw new Error("Subscription plan not found");
    const updated: SubscriptionPlan = { 
      ...existing, 
      ...plan,
      features: plan.features ? (plan.features as string[]) : existing.features,
      updatedAt: new Date() 
    };
    this.subscriptionPlans.set(id, updated);
    return updated;
  }

  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    return Array.from(this.userSubscriptions.values()).find(
      (s) => s.userId === userId && s.status === "active"
    );
  }

  async createUserSubscription(sub: InsertUserSubscription): Promise<UserSubscription> {
    const id = nanoid();
    const newSub: UserSubscription = {
      id,
      userId: sub.userId,
      planId: sub.planId,
      status: sub.status ?? "active",
      billingCycle: sub.billingCycle ?? "monthly",
      startDate: sub.startDate ?? new Date(),
      endDate: sub.endDate ?? null,
      nextBillingDate: sub.nextBillingDate ?? null,
      paymentMethod: sub.paymentMethod ?? null,
      externalSubscriptionId: sub.externalSubscriptionId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userSubscriptions.set(id, newSub);
    return newSub;
  }

  async updateUserSubscription(id: string, sub: Partial<InsertUserSubscription>): Promise<UserSubscription> {
    const existing = this.userSubscriptions.get(id);
    if (!existing) throw new Error("User subscription not found");
    const updated: UserSubscription = { ...existing, ...sub, updatedAt: new Date() };
    this.userSubscriptions.set(id, updated);
    return updated;
  }

  async getOrders(userId?: string): Promise<Order[]> {
    let results = Array.from(this.orders.values());
    if (userId) {
      results = results.filter((o) => o.userId === userId);
    }
    return results.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = nanoid();
    const newOrder: Order = {
      id,
      userId: order.userId,
      serviceId: order.serviceId ?? null,
      subscriptionPlanId: order.subscriptionPlanId ?? null,
      orderType: order.orderType,
      status: order.status ?? "pending",
      basePrice: order.basePrice,
      discountAmount: order.discountAmount ?? "0",
      finalPrice: order.finalPrice,
      currency: order.currency ?? "UGX",
      discountCode: order.discountCode ?? null,
      notes: order.notes ?? null,
      adminNotes: order.adminNotes ?? null,
      assignedAdminId: order.assignedAdminId ?? null,
      dueDate: order.dueDate ?? null,
      completedAt: order.completedAt ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order> {
    const existing = this.orders.get(id);
    if (!existing) throw new Error("Order not found");
    const updated: Order = { ...existing, ...order, updatedAt: new Date() };
    this.orders.set(id, updated);
    return updated;
  }

  async getPayments(userId?: string): Promise<Payment[]> {
    let results = Array.from(this.payments.values());
    if (userId) {
      results = results.filter((p) => p.userId === userId);
    }
    return results.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = nanoid();
    const newPayment: Payment = {
      id,
      orderId: payment.orderId ?? null,
      userSubscriptionId: payment.userSubscriptionId ?? null,
      userId: payment.userId,
      amount: payment.amount,
      currency: payment.currency ?? "UGX",
      paymentMethod: payment.paymentMethod,
      provider: payment.provider ?? null,
      status: payment.status ?? "pending",
      externalTransactionId: payment.externalTransactionId ?? null,
      phoneNumber: payment.phoneNumber ?? null,
      metadata: payment.metadata ?? null,
      failureReason: payment.failureReason ?? null,
      paidAt: payment.paidAt ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment> {
    const existing = this.payments.get(id);
    if (!existing) throw new Error("Payment not found");
    const updated: Payment = { ...existing, ...payment, updatedAt: new Date() };
    this.payments.set(id, updated);
    return updated;
  }

  async getDiscounts(): Promise<Discount[]> {
    return Array.from(this.discounts.values()).filter((d) => d.isActive);
  }

  async getDiscountByCode(code: string): Promise<Discount | undefined> {
    return Array.from(this.discounts.values()).find(
      (d) => d.code.toLowerCase() === code.toLowerCase() && d.isActive
    );
  }

  async createDiscount(discount: InsertDiscount): Promise<Discount> {
    const id = nanoid();
    const newDiscount: Discount = {
      id,
      code: discount.code,
      description: discount.description ?? null,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      currency: discount.currency ?? "UGX",
      appliesTo: discount.appliesTo ?? "all",
      eligibleTiers: discount.eligibleTiers ?? null,
      minOrderAmount: discount.minOrderAmount ?? null,
      maxUses: discount.maxUses ?? null,
      usedCount: discount.usedCount ?? 0,
      validFrom: discount.validFrom ?? new Date(),
      validUntil: discount.validUntil ?? null,
      isActive: discount.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.discounts.set(id, newDiscount);
    return newDiscount;
  }

  async updateDiscount(id: string, discount: Partial<InsertDiscount>): Promise<Discount> {
    const existing = this.discounts.get(id);
    if (!existing) throw new Error("Discount not found");
    const updated: Discount = { ...existing, ...discount, updatedAt: new Date() };
    this.discounts.set(id, updated);
    return updated;
  }
}

export const storage = new MemoryStorage();
