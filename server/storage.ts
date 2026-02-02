import { db } from "./db";
import { eq, or, ilike, and } from "drizzle-orm";
import {
  users,
  universities,
  scholarships,
  services,
  serviceRequests,
  savedUniversities,
  savedScholarships,
  subscriptionPlans,
  userSubscriptions,
  orders,
  payments,
  discounts,
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
  deleteService(id: string): Promise<void>;
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

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!username) return undefined;
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: { ...userData, updatedAt: new Date() },
    }).returning();
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db.update(users).set({ ...userData, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUniversities(search?: string, type?: string, location?: string): Promise<University[]> {
    const conditions = [];
    if (search) {
      conditions.push(or(ilike(universities.name, `%${search}%`), ilike(universities.description, `%${search}%`)));
    }
    if (type) conditions.push(eq(universities.type, type));
    if (location) conditions.push(ilike(universities.location, `%${location}%`));

    let query = db.select().from(universities);
    if (conditions.length > 0) {
      // @ts-ignore
      query = query.where(and(...conditions));
    }
    return await query;
  }

  async getUniversity(id: string): Promise<University | undefined> {
    const [university] = await db.select().from(universities).where(eq(universities.id, id));
    return university;
  }

  async createUniversity(university: InsertUniversity): Promise<University> {
    const [newUniversity] = await db.insert(universities).values(university).returning();
    return newUniversity;
  }

  async updateUniversity(id: string, university: Partial<InsertUniversity>): Promise<University> {
    const [updated] = await db.update(universities).set({ ...university, updatedAt: new Date() }).where(eq(universities.id, id)).returning();
    return updated;
  }

  async deleteUniversity(id: string): Promise<void> {
    await db.delete(universities).where(eq(universities.id, id));
  }

  async getScholarships(search?: string, type?: string, level?: string): Promise<Scholarship[]> {
    const conditions = [eq(scholarships.isActive, true)];
    if (search) {
      conditions.push(or(
        ilike(scholarships.title, `%${search}%`),
        ilike(scholarships.description, `%${search}%`),
        ilike(scholarships.provider, `%${search}%`)
      ));
    }
    if (type) conditions.push(eq(scholarships.type, type));
    if (level) conditions.push(or(eq(scholarships.level, level), eq(scholarships.level, "both")));

    let query = db.select().from(scholarships);
    // @ts-ignore
    query = query.where(and(...conditions));
    return await query;
  }

  async getScholarship(id: string): Promise<Scholarship | undefined> {
    const [scholarship] = await db.select().from(scholarships).where(eq(scholarships.id, id));
    return scholarship;
  }

  async createScholarship(scholarship: InsertScholarship): Promise<Scholarship> {
    const [newScholarship] = await db.insert(scholarships).values(scholarship).returning();
    return newScholarship;
  }

  async updateScholarship(id: string, scholarship: Partial<InsertScholarship>): Promise<Scholarship> {
    const [updated] = await db.update(scholarships).set({ ...scholarship, updatedAt: new Date() }).where(eq(scholarships.id, id)).returning();
    return updated;
  }

  async deleteScholarship(id: string): Promise<void> {
    await db.delete(scholarships).where(eq(scholarships.id, id));
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [updated] = await db.update(services).set({ ...service, updatedAt: new Date() }).where(eq(services.id, id)).returning();
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async getServiceRequests(userId?: string): Promise<ServiceRequest[]> {
    if (userId) {
      return await db.select().from(serviceRequests).where(eq(serviceRequests.userId, userId));
    }
    return await db.select().from(serviceRequests);
  }

  async getServiceRequest(id: string): Promise<ServiceRequest | undefined> {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
    return request;
  }

  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const [newRequest] = await db.insert(serviceRequests).values(request).returning();
    return newRequest;
  }

  async updateServiceRequest(id: string, request: Partial<InsertServiceRequest>): Promise<ServiceRequest> {
    const [updated] = await db.update(serviceRequests).set({ ...request, updatedAt: new Date() }).where(eq(serviceRequests.id, id)).returning();
    return updated;
  }

  async saveUniversity(userId: string, universityId: string): Promise<SavedUniversity> {
    const [saved] = await db.insert(savedUniversities).values({ userId, universityId }).returning();
    return saved;
  }

  async unsaveUniversity(userId: string, universityId: string): Promise<void> {
    await db.delete(savedUniversities).where(and(eq(savedUniversities.userId, userId), eq(savedUniversities.universityId, universityId)));
  }

  async getUserSavedUniversities(userId: string): Promise<University[]> {
    const results = await db.select({ university: universities })
      .from(savedUniversities)
      .innerJoin(universities, eq(savedUniversities.universityId, universities.id))
      .where(eq(savedUniversities.userId, userId));
    return results.map(r => r.university);
  }

  async saveScholarship(userId: string, scholarshipId: string): Promise<SavedScholarship> {
    const [saved] = await db.insert(savedScholarships).values({ userId, scholarshipId }).returning();
    return saved;
  }

  async unsaveScholarship(userId: string, scholarshipId: string): Promise<void> {
    await db.delete(savedScholarships).where(and(eq(savedScholarships.userId, userId), eq(savedScholarships.scholarshipId, scholarshipId)));
  }

  async getUserSavedScholarships(userId: string): Promise<Scholarship[]> {
    const results = await db.select({ scholarship: scholarships })
      .from(savedScholarships)
      .innerJoin(scholarships, eq(savedScholarships.scholarshipId, scholarships.id))
      .where(eq(savedScholarships.userId, userId));
    return results.map(r => r.scholarship);
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan;
  }

  async getSubscriptionPlanByTier(tierKey: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.tierKey, tierKey));
    return plan;
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [newPlan] = await db.insert(subscriptionPlans).values(plan).returning();
    return newPlan;
  }

  async updateSubscriptionPlan(id: string, plan: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan> {
    const [updated] = await db.update(subscriptionPlans).set({ ...plan, updatedAt: new Date() }).where(eq(subscriptionPlans.id, id)).returning();
    return updated;
  }

  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    const [sub] = await db.select().from(userSubscriptions).where(and(eq(userSubscriptions.userId, userId), eq(userSubscriptions.status, "active")));
    return sub;
  }

  async createUserSubscription(sub: InsertUserSubscription): Promise<UserSubscription> {
    const [newSub] = await db.insert(userSubscriptions).values(sub).returning();
    return newSub;
  }

  async updateUserSubscription(id: string, sub: Partial<InsertUserSubscription>): Promise<UserSubscription> {
    const [updated] = await db.update(userSubscriptions).set({ ...sub, updatedAt: new Date() }).where(eq(userSubscriptions.id, id)).returning();
    return updated;
  }

  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return await db.select().from(orders).where(eq(orders.userId, userId));
    }
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order> {
    const [updated] = await db.update(orders).set({ ...order, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async getPayments(userId?: string): Promise<Payment[]> {
    if (userId) {
      return await db.select().from(payments).where(eq(payments.userId, userId));
    }
    return await db.select().from(payments);
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment> {
    const [updated] = await db.update(payments).set({ ...payment, updatedAt: new Date() }).where(eq(payments.id, id)).returning();
    return updated;
  }

  async getDiscounts(): Promise<Discount[]> {
    return await db.select().from(discounts).where(eq(discounts.isActive, true));
  }

  async getDiscountByCode(code: string): Promise<Discount | undefined> {
    const [discount] = await db.select().from(discounts).where(eq(discounts.code, code));
    return discount;
  }

  async createDiscount(discount: InsertDiscount): Promise<Discount> {
    const [newDiscount] = await db.insert(discounts).values(discount).returning();
    return newDiscount;
  }

  async updateDiscount(id: string, discount: Partial<InsertDiscount>): Promise<Discount> {
    const [updated] = await db.update(discounts).set({ ...discount, updatedAt: new Date() }).where(eq(discounts.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
