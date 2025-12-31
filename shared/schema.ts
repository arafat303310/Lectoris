import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with password authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  username: varchar("username").unique(),
  password: varchar("password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  isAdmin: boolean("is_admin").default(false),
  subscriptionTier: varchar("subscription_tier").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Universities table
export const universities = pgTable("universities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "public" or "private"
  status: varchar("status", { length: 50 }).notNull(), // "chartered" or "provisional"
  description: text("description"),
  tuitionMin: decimal("tuition_min"),
  tuitionMax: decimal("tuition_max"),
  applicationDeadline: timestamp("application_deadline"),
  websiteUrl: text("website_url"),
  applicationPortalUrl: text("application_portal_url"), // Direct link to application portal
  logoUrl: text("logo_url"),
  established: integer("established"),
  ranking: integer("ranking"), // National ranking in Uganda
  specialties: text("specialties").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scholarships table
export const scholarships = pgTable("scholarships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  provider: text("provider").notNull(),
  amount: decimal("amount"),
  currency: varchar("currency", { length: 10 }).default("UGX"),
  eligibility: text("eligibility").notNull(),
  level: varchar("level", { length: 50 }).notNull(), // "undergraduate", "postgraduate", "both"
  type: varchar("type", { length: 50 }).notNull(), // "government", "international", "private"
  deadline: timestamp("deadline").notNull(),
  applicationUrl: text("application_url"),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscription plans table
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tierKey: varchar("tier_key", { length: 50 }).notNull().unique(), // "free", "student_pro", "premium"
  description: text("description"),
  monthlyPrice: decimal("monthly_price").notNull(),
  annualPrice: decimal("annual_price"),
  currency: varchar("currency", { length: 10 }).default("UGX"),
  features: jsonb("features").$type<string[]>().default([]),
  serviceDiscount: integer("service_discount").default(0), // percentage discount on services
  aiChatLimit: integer("ai_chat_limit").default(5), // monthly AI chat limit
  documentReviews: integer("document_reviews").default(0), // monthly human document reviews
  adsEnabled: boolean("ads_enabled").default(true),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services catalog table (pay-per-service)
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // "application", "document", "consultation"
  basePrice: decimal("base_price").notNull(),
  currency: varchar("currency", { length: 10 }).default("UGX"),
  deliveryDays: integer("delivery_days").notNull().default(7),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User subscriptions table
export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: varchar("plan_id").notNull().references(() => subscriptionPlans.id),
  status: varchar("status", { length: 50 }).default("active"), // "active", "cancelled", "expired", "past_due"
  billingCycle: varchar("billing_cycle", { length: 20 }).default("monthly"), // "monthly", "annual"
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  nextBillingDate: timestamp("next_billing_date"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  externalSubscriptionId: varchar("external_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table (for service purchases)
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  serviceId: varchar("service_id").references(() => services.id),
  subscriptionPlanId: varchar("subscription_plan_id").references(() => subscriptionPlans.id),
  orderType: varchar("order_type", { length: 50 }).notNull(), // "service", "subscription"
  status: varchar("status", { length: 50 }).default("pending"), // "pending", "paid", "processing", "completed", "cancelled", "refunded"
  basePrice: decimal("base_price").notNull(),
  discountAmount: decimal("discount_amount").default("0"),
  finalPrice: decimal("final_price").notNull(),
  currency: varchar("currency", { length: 10 }).default("UGX"),
  discountCode: varchar("discount_code"),
  notes: text("notes"),
  adminNotes: text("admin_notes"),
  assignedAdminId: varchar("assigned_admin_id").references(() => users.id),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id),
  userSubscriptionId: varchar("user_subscription_id").references(() => userSubscriptions.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("UGX"),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // "mtn_momo", "airtel_money", "card", "bank"
  provider: varchar("provider", { length: 50 }), // "mtn", "airtel", "stripe", "flutterwave"
  status: varchar("status", { length: 50 }).default("pending"), // "pending", "processing", "completed", "failed", "refunded"
  externalTransactionId: varchar("external_transaction_id"),
  phoneNumber: varchar("phone_number"),
  metadata: jsonb("metadata"),
  failureReason: text("failure_reason"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Discount codes table
export const discounts = pgTable("discounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: varchar("discount_type", { length: 20 }).notNull(), // "percentage", "fixed"
  discountValue: decimal("discount_value").notNull(),
  currency: varchar("currency", { length: 10 }).default("UGX"),
  appliesTo: varchar("applies_to", { length: 50 }).default("all"), // "all", "services", "subscriptions"
  eligibleTiers: text("eligible_tiers").array(), // which subscription tiers can use
  minOrderAmount: decimal("min_order_amount"),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pricing config table (for admin-editable settings)
export const pricingConfig = pgTable("pricing_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  configKey: varchar("config_key", { length: 100 }).notNull().unique(),
  configValue: text("config_value").notNull(),
  description: text("description"),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service requests table
export const serviceRequests = pgTable("service_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  status: varchar("status", { length: 50 }).default("pending"), // "pending", "in_progress", "completed", "cancelled"
  notes: text("notes"),
  adminNotes: text("admin_notes"),
  documentsUrl: text("documents_url").array(),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"), // "pending", "paid", "failed"
  paymentMethod: varchar("payment_method", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Saved universities table
export const savedUniversities = pgTable("saved_universities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  universityId: varchar("university_id").notNull().references(() => universities.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved scholarships table
export const savedScholarships = pgTable("saved_scholarships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  scholarshipId: varchar("scholarship_id").notNull().references(() => scholarships.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  serviceRequests: many(serviceRequests),
  savedUniversities: many(savedUniversities),
  savedScholarships: many(savedScholarships),
  subscriptions: many(userSubscriptions),
  orders: many(orders),
  payments: many(payments),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  userSubscriptions: many(userSubscriptions),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [userSubscriptions.userId],
    references: [users.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [userSubscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [orders.serviceId],
    references: [services.id],
  }),
  subscriptionPlan: one(subscriptionPlans, {
    fields: [orders.subscriptionPlanId],
    references: [subscriptionPlans.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  userSubscription: one(userSubscriptions, {
    fields: [payments.userSubscriptionId],
    references: [userSubscriptions.id],
  }),
}));

export const universitiesRelations = relations(universities, ({ many }) => ({
  savedByUsers: many(savedUniversities),
}));

export const scholarshipsRelations = relations(scholarships, ({ many }) => ({
  savedByUsers: many(savedScholarships),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  requests: many(serviceRequests),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one }) => ({
  user: one(users, {
    fields: [serviceRequests.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [serviceRequests.serviceId],
    references: [services.id],
  }),
}));

export const savedUniversitiesRelations = relations(savedUniversities, ({ one }) => ({
  user: one(users, {
    fields: [savedUniversities.userId],
    references: [users.id],
  }),
  university: one(universities, {
    fields: [savedUniversities.universityId],
    references: [universities.id],
  }),
}));

export const savedScholarshipsRelations = relations(savedScholarships, ({ one }) => ({
  user: one(users, {
    fields: [savedScholarships.userId],
    references: [users.id],
  }),
  scholarship: one(scholarships, {
    fields: [savedScholarships.scholarshipId],
    references: [scholarships.id],
  }),
}));

// Insert schemas
export const insertUniversitySchema = createInsertSchema(universities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScholarshipSchema = createInsertSchema(scholarships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDiscountSchema = createInsertSchema(discounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPricingConfigSchema = createInsertSchema(pricingConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type University = typeof universities.$inferSelect;
export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type Scholarship = typeof scholarships.$inferSelect;
export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type SavedUniversity = typeof savedUniversities.$inferSelect;
export type SavedScholarship = typeof savedScholarships.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Discount = typeof discounts.$inferSelect;
export type InsertDiscount = z.infer<typeof insertDiscountSchema>;
export type PricingConfig = typeof pricingConfig.$inferSelect;
export type InsertPricingConfig = z.infer<typeof insertPricingConfigSchema>;
