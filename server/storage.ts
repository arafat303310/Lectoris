import {
  users,
  universities,
  scholarships,
  services,
  serviceRequests,
  savedUniversities,
  savedScholarships,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, ilike, or } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // University operations
  getUniversities(search?: string, type?: string, location?: string): Promise<University[]>;
  getUniversity(id: string): Promise<University | undefined>;
  createUniversity(university: InsertUniversity): Promise<University>;
  updateUniversity(id: string, university: Partial<InsertUniversity>): Promise<University>;
  deleteUniversity(id: string): Promise<void>;

  // Scholarship operations
  getScholarships(search?: string, type?: string, level?: string): Promise<Scholarship[]>;
  getScholarship(id: string): Promise<Scholarship | undefined>;
  createScholarship(scholarship: InsertScholarship): Promise<Scholarship>;
  updateScholarship(id: string, scholarship: Partial<InsertScholarship>): Promise<Scholarship>;
  deleteScholarship(id: string): Promise<void>;

  // Service operations
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;

  // Service request operations
  getServiceRequests(userId?: string): Promise<ServiceRequest[]>;
  getServiceRequest(id: string): Promise<ServiceRequest | undefined>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: string, request: Partial<InsertServiceRequest>): Promise<ServiceRequest>;

  // Saved items operations
  saveUniversity(userId: string, universityId: string): Promise<SavedUniversity>;
  unsaveUniversity(userId: string, universityId: string): Promise<void>;
  getUserSavedUniversities(userId: string): Promise<University[]>;
  saveScholarship(userId: string, scholarshipId: string): Promise<SavedScholarship>;
  unsaveScholarship(userId: string, scholarshipId: string): Promise<void>;
  getUserSavedScholarships(userId: string): Promise<Scholarship[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // University operations
  async getUniversities(search?: string, type?: string, location?: string): Promise<University[]> {
    let query = db.select().from(universities);
    
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(universities.name, `%${search}%`),
          ilike(universities.description, `%${search}%`)
        )
      );
    }
    if (type) {
      conditions.push(eq(universities.type, type));
    }
    if (location) {
      conditions.push(ilike(universities.location, `%${location}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(universities.name);
  }

  async getUniversity(id: string): Promise<University | undefined> {
    const [university] = await db.select().from(universities).where(eq(universities.id, id));
    return university;
  }

  async createUniversity(university: InsertUniversity): Promise<University> {
    const [created] = await db.insert(universities).values(university).returning();
    return created;
  }

  async updateUniversity(id: string, university: Partial<InsertUniversity>): Promise<University> {
    const [updated] = await db
      .update(universities)
      .set({ ...university, updatedAt: new Date() })
      .where(eq(universities.id, id))
      .returning();
    return updated;
  }

  async deleteUniversity(id: string): Promise<void> {
    await db.delete(universities).where(eq(universities.id, id));
  }

  // Scholarship operations
  async getScholarships(search?: string, type?: string, level?: string): Promise<Scholarship[]> {
    let query = db.select().from(scholarships).where(eq(scholarships.isActive, true));
    
    const conditions = [eq(scholarships.isActive, true)];
    if (search) {
      conditions.push(
        or(
          ilike(scholarships.title, `%${search}%`),
          ilike(scholarships.description, `%${search}%`),
          ilike(scholarships.provider, `%${search}%`)
        )
      );
    }
    if (type) {
      conditions.push(eq(scholarships.type, type));
    }
    if (level) {
      conditions.push(or(
        eq(scholarships.level, level),
        eq(scholarships.level, "both")
      ));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(scholarships.deadline);
  }

  async getScholarship(id: string): Promise<Scholarship | undefined> {
    const [scholarship] = await db.select().from(scholarships).where(eq(scholarships.id, id));
    return scholarship;
  }

  async createScholarship(scholarship: InsertScholarship): Promise<Scholarship> {
    const [created] = await db.insert(scholarships).values(scholarship).returning();
    return created;
  }

  async updateScholarship(id: string, scholarship: Partial<InsertScholarship>): Promise<Scholarship> {
    const [updated] = await db
      .update(scholarships)
      .set({ ...scholarship, updatedAt: new Date() })
      .where(eq(scholarships.id, id))
      .returning();
    return updated;
  }

  async deleteScholarship(id: string): Promise<void> {
    await db.delete(scholarships).where(eq(scholarships.id, id));
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [updated] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  // Service request operations
  async getServiceRequests(userId?: string): Promise<ServiceRequest[]> {
    let query = db.select().from(serviceRequests);
    
    if (userId) {
      query = query.where(eq(serviceRequests.userId, userId));
    }

    return await query.orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequest(id: string): Promise<ServiceRequest | undefined> {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
    return request;
  }

  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const [created] = await db.insert(serviceRequests).values(request).returning();
    return created;
  }

  async updateServiceRequest(id: string, request: Partial<InsertServiceRequest>): Promise<ServiceRequest> {
    const [updated] = await db
      .update(serviceRequests)
      .set({ ...request, updatedAt: new Date() })
      .where(eq(serviceRequests.id, id))
      .returning();
    return updated;
  }

  // Saved items operations
  async saveUniversity(userId: string, universityId: string): Promise<SavedUniversity> {
    const [saved] = await db
      .insert(savedUniversities)
      .values({ userId, universityId })
      .onConflictDoNothing()
      .returning();
    return saved;
  }

  async unsaveUniversity(userId: string, universityId: string): Promise<void> {
    await db
      .delete(savedUniversities)
      .where(and(
        eq(savedUniversities.userId, userId),
        eq(savedUniversities.universityId, universityId)
      ));
  }

  async getUserSavedUniversities(userId: string): Promise<University[]> {
    const result = await db
      .select({ university: universities })
      .from(savedUniversities)
      .innerJoin(universities, eq(savedUniversities.universityId, universities.id))
      .where(eq(savedUniversities.userId, userId));
    
    return result.map(r => r.university);
  }

  async saveScholarship(userId: string, scholarshipId: string): Promise<SavedScholarship> {
    const [saved] = await db
      .insert(savedScholarships)
      .values({ userId, scholarshipId })
      .onConflictDoNothing()
      .returning();
    return saved;
  }

  async unsaveScholarship(userId: string, scholarshipId: string): Promise<void> {
    await db
      .delete(savedScholarships)
      .where(and(
        eq(savedScholarships.userId, userId),
        eq(savedScholarships.scholarshipId, scholarshipId)
      ));
  }

  async getUserSavedScholarships(userId: string): Promise<Scholarship[]> {
    const result = await db
      .select({ scholarship: scholarships })
      .from(savedScholarships)
      .innerJoin(scholarships, eq(savedScholarships.scholarshipId, scholarships.id))
      .where(eq(savedScholarships.userId, userId));
    
    return result.map(r => r.scholarship);
  }
}

export const storage = new DatabaseStorage();
