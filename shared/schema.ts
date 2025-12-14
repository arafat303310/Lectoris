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
  icon: varchar("icon", { length: 50 }).notNull(), // lucide-react icon name
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services table
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  tier: varchar("tier", { length: 50 }).notNull(), // "standard" or "premium"
  isActive: boolean("is_active").default(true),
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
