import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertUniversitySchema, insertScholarshipSchema, insertServiceSchema, insertServiceRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // University routes
  app.get("/api/universities", async (req, res) => {
    try {
      const { search, type, location } = req.query;
      const universities = await storage.getUniversities(
        search as string,
        type as string,
        location as string
      );
      res.json(universities);
    } catch (error) {
      console.error("Error fetching universities:", error);
      res.status(500).json({ message: "Failed to fetch universities" });
    }
  });

  app.get("/api/universities/:id", async (req, res) => {
    try {
      const university = await storage.getUniversity(req.params.id);
      if (!university) {
        return res.status(404).json({ message: "University not found" });
      }
      res.json(university);
    } catch (error) {
      console.error("Error fetching university:", error);
      res.status(500).json({ message: "Failed to fetch university" });
    }
  });

  app.post("/api/universities", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertUniversitySchema.parse(req.body);
      const university = await storage.createUniversity(validatedData);
      res.status(201).json(university);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating university:", error);
      res.status(500).json({ message: "Failed to create university" });
    }
  });

  app.put("/api/universities/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertUniversitySchema.partial().parse(req.body);
      const university = await storage.updateUniversity(req.params.id, validatedData);
      res.json(university);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating university:", error);
      res.status(500).json({ message: "Failed to update university" });
    }
  });

  app.delete("/api/universities/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteUniversity(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting university:", error);
      res.status(500).json({ message: "Failed to delete university" });
    }
  });

  // Scholarship routes
  app.get("/api/scholarships", async (req, res) => {
    try {
      const { search, type, level } = req.query;
      const scholarships = await storage.getScholarships(
        search as string,
        type as string,
        level as string
      );
      res.json(scholarships);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      res.status(500).json({ message: "Failed to fetch scholarships" });
    }
  });

  app.get("/api/scholarships/:id", async (req, res) => {
    try {
      const scholarship = await storage.getScholarship(req.params.id);
      if (!scholarship) {
        return res.status(404).json({ message: "Scholarship not found" });
      }
      res.json(scholarship);
    } catch (error) {
      console.error("Error fetching scholarship:", error);
      res.status(500).json({ message: "Failed to fetch scholarship" });
    }
  });

  app.post("/api/scholarships", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertScholarshipSchema.parse(req.body);
      const scholarship = await storage.createScholarship(validatedData);
      res.status(201).json(scholarship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating scholarship:", error);
      res.status(500).json({ message: "Failed to create scholarship" });
    }
  });

  // Service routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/services", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  // Service request routes
  app.get("/api/service-requests", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      const userId = user?.isAdmin ? undefined : req.user.claims.sub;
      const requests = await storage.getServiceRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Failed to fetch service requests" });
    }
  });

  app.post("/api/service-requests", isAuthenticated, async (req: any, res) => {
    try {
      const requestData = {
        ...req.body,
        userId: req.user.claims.sub,
      };
      const validatedData = insertServiceRequestSchema.parse(requestData);
      const request = await storage.createServiceRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating service request:", error);
      res.status(500).json({ message: "Failed to create service request" });
    }
  });

  app.put("/api/service-requests/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertServiceRequestSchema.partial().parse(req.body);
      const request = await storage.updateServiceRequest(req.params.id, validatedData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating service request:", error);
      res.status(500).json({ message: "Failed to update service request" });
    }
  });

  // Saved items routes
  app.post("/api/saved-universities", isAuthenticated, async (req: any, res) => {
    try {
      const { universityId } = req.body;
      const saved = await storage.saveUniversity(req.user.claims.sub, universityId);
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error saving university:", error);
      res.status(500).json({ message: "Failed to save university" });
    }
  });

  app.delete("/api/saved-universities/:universityId", isAuthenticated, async (req: any, res) => {
    try {
      await storage.unsaveUniversity(req.user.claims.sub, req.params.universityId);
      res.status(204).send();
    } catch (error) {
      console.error("Error unsaving university:", error);
      res.status(500).json({ message: "Failed to unsave university" });
    }
  });

  app.get("/api/saved-universities", isAuthenticated, async (req: any, res) => {
    try {
      const universities = await storage.getUserSavedUniversities(req.user.claims.sub);
      res.json(universities);
    } catch (error) {
      console.error("Error fetching saved universities:", error);
      res.status(500).json({ message: "Failed to fetch saved universities" });
    }
  });

  app.post("/api/saved-scholarships", isAuthenticated, async (req: any, res) => {
    try {
      const { scholarshipId } = req.body;
      const saved = await storage.saveScholarship(req.user.claims.sub, scholarshipId);
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error saving scholarship:", error);
      res.status(500).json({ message: "Failed to save scholarship" });
    }
  });

  app.delete("/api/saved-scholarships/:scholarshipId", isAuthenticated, async (req: any, res) => {
    try {
      await storage.unsaveScholarship(req.user.claims.sub, req.params.scholarshipId);
      res.status(204).send();
    } catch (error) {
      console.error("Error unsaving scholarship:", error);
      res.status(500).json({ message: "Failed to unsave scholarship" });
    }
  });

  app.get("/api/saved-scholarships", isAuthenticated, async (req: any, res) => {
    try {
      const scholarships = await storage.getUserSavedScholarships(req.user.claims.sub);
      res.json(scholarships);
    } catch (error) {
      console.error("Error fetching saved scholarships:", error);
      res.status(500).json({ message: "Failed to fetch saved scholarships" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
