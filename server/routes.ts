import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isLocalAuthenticated } from "./replitAuth";
import { insertUniversitySchema, insertScholarshipSchema, insertServiceSchema, insertServiceRequestSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";
import bcrypt from "bcryptjs";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // Handle local auth users
      if (req.user.isLocalAuth) {
        const user = await storage.getUser(req.user.userId);
        return res.json(user);
      }
      // Handle Replit OIDC users
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Password-based signup
  const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().optional(),
  });

  app.post('/api/auth/signup', async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Create user
      const user = await storage.createUser({
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone || null,
        subscriptionTier: "free",
      });

      // Log user in
      req.login({ userId: user.id, isLocalAuth: true }, (err: any) => {
        if (err) {
          console.error("Login error after signup:", err);
          return res.status(500).json({ message: "Failed to complete signup" });
        }
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Password-based login
  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Log user in
      req.login({ userId: user.id, isLocalAuth: true }, (err: any) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ message: "Failed to login" });
        }
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Local logout
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err: any) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
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

  // Search autocomplete endpoint
  app.get("/api/search/autocomplete", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string' || q.length < 2) {
        return res.json([]);
      }
      
      const universities = await storage.getUniversities(q);
      const scholarships = await storage.getScholarships(q);
      
      const suggestions = [
        ...universities.slice(0, 5).map(u => ({ type: 'university', id: u.id, name: u.name, location: u.location })),
        ...scholarships.slice(0, 3).map(s => ({ type: 'scholarship', id: s.id, name: s.title, provider: s.provider })),
      ];
      
      res.json(suggestions);
    } catch (error) {
      console.error("Error in autocomplete:", error);
      res.status(500).json({ message: "Failed to get suggestions" });
    }
  });

  // AI Chatbot endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, studentInfo } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const universities = await storage.getUniversities();
      const scholarships = await storage.getScholarships();
      
      const systemPrompt = `You are ApplyHub's friendly course guidance counselor for Ugandan students. 
You help students choose suitable courses and universities based on their academic performance, interests, and career goals.

Available Universities in Uganda:
${universities.slice(0, 15).map(u => `- ${u.name} (${u.location}): ${u.specialties?.join(', ')}`).join('\n')}

Available Scholarships:
${scholarships.slice(0, 10).map(s => `- ${s.title} by ${s.provider}: ${s.eligibility}`).join('\n')}

Guidelines:
- Be encouraging and supportive
- Consider the student's O-level and A-level performance when recommending courses
- Suggest courses that match their strengths and interests
- Recommend suitable universities based on their preferences
- Mention scholarship opportunities when relevant
- Keep responses concise but helpful
- Use simple, friendly language`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Student Info: ${JSON.stringify(studentInfo || {})}\n\nQuestion: ${message}` }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const reply = response.choices[0]?.message?.content || "I'm sorry, I couldn't process your request. Please try again.";
      res.json({ reply });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to get response from AI", reply: "I'm having trouble connecting right now. Please try again later." });
    }
  });

  // Admin routes for user management
  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/stats", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const universities = await storage.getUniversities();
      const scholarships = await storage.getScholarships();
      const services = await storage.getServices();
      const serviceRequests = await storage.getServiceRequests();
      const users = await storage.getAllUsers();
      
      res.json({
        totalUniversities: universities.length,
        totalScholarships: scholarships.length,
        totalServices: services.length,
        totalServiceRequests: serviceRequests.length,
        totalUsers: users.length,
        pendingRequests: serviceRequests.filter(r => r.status === 'pending').length,
        completedRequests: serviceRequests.filter(r => r.status === 'completed').length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // User profile update
  app.put("/api/user/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName, phone } = req.body;
      const user = await storage.updateUser(userId, { firstName, lastName, phone });
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
