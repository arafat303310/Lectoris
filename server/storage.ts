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
} from "@shared/schema";
import { nanoid } from "nanoid";
import { ugandaUniversitiesData, ugandaScholarshipsData, servicesData } from "./seed-data";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
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
}

export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private universities: Map<string, University> = new Map();
  private scholarships: Map<string, Scholarship> = new Map();
  private services: Map<string, Service> = new Map();
  private serviceRequests: Map<string, ServiceRequest> = new Map();
  private savedUniversities: Map<string, SavedUniversity> = new Map();
  private savedScholarships: Map<string, SavedScholarship> = new Map();

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
        logoUrl: null,
        established: uni.established,
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
        price: svc.price,
        currency: svc.currency,
        isActive: svc.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.services.set(id, service);
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
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      isAdmin: existing?.isAdmin ?? false,
      createdAt: existing?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id!, user);
    return user;
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

    return results.sort((a, b) => a.name.localeCompare(b.name));
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
      logoUrl: university.logoUrl ?? null,
      established: university.established ?? null,
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
      price: service.price,
      currency: service.currency ?? "UGX",
      isActive: service.isActive ?? true,
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
}

export const storage = new MemoryStorage();
