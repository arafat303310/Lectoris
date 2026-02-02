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
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
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
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
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
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
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
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
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

  app.put("/api/scholarships/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertScholarshipSchema.partial().parse(req.body);
      const scholarship = await storage.updateScholarship(req.params.id, validatedData);
      res.json(scholarship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating scholarship:", error);
      res.status(500).json({ message: "Failed to update scholarship" });
    }
  });

  app.delete("/api/scholarships/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteScholarship(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting scholarship:", error);
      res.status(500).json({ message: "Failed to delete scholarship" });
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
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
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

  app.put("/api/services/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteService(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
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
      if (!q || typeof q !== 'string' || q.length < 1) {
        return res.json([]);
      }
      
      const universities = await storage.getUniversities(q);
      const scholarships = await storage.getScholarships(q);
      
      const suggestions = [
        ...universities.slice(0, 5).map(u => ({ type: 'university', id: u.id, name: u.name, location: u.location })),
        ...scholarships.slice(0, 5).map(s => ({ type: 'scholarship', id: s.id, name: s.title, provider: s.provider })),
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
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
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
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims?.sub;
      const user = await storage.getUser(userId);
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

  // ============ SUBSCRIPTION & PRICING ROUTES ============

  // Get subscription plans
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });

  // Get user's active subscription
  app.get("/api/user/subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const subscription = await storage.getUserSubscription(userId);
      if (subscription) {
        const plan = await storage.getSubscriptionPlan(subscription.planId);
        res.json({ subscription, plan });
      } else {
        const freePlan = await storage.getSubscriptionPlanByTier("free");
        res.json({ subscription: null, plan: freePlan });
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // ============ ORDER ROUTES ============

  // Get user's orders
  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const user = await storage.getUser(userId);
      const orders = user?.isAdmin 
        ? await storage.getOrders() 
        : await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Create order (service or subscription purchase)
  const createOrderSchema = z.object({
    orderType: z.enum(["service", "subscription"]),
    serviceId: z.string().optional(),
    subscriptionPlanId: z.string().optional(),
    billingCycle: z.enum(["monthly", "annual"]).optional(),
    discountCode: z.string().optional(),
    notes: z.string().optional(),
  });

  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const validatedData = createOrderSchema.parse(req.body);
      
      let basePrice = "0";
      let finalPrice = "0";
      let discountAmount = "0";
      
      if (validatedData.orderType === "service" && validatedData.serviceId) {
        const service = await storage.getService(validatedData.serviceId);
        if (!service) return res.status(404).json({ message: "Service not found" });
        basePrice = service.basePrice;
        
        // Apply subscription discount if user has active subscription
        const userSub = await storage.getUserSubscription(userId);
        if (userSub) {
          const plan = await storage.getSubscriptionPlan(userSub.planId);
          if (plan?.serviceDiscount) {
            discountAmount = String(Math.round(parseFloat(basePrice) * plan.serviceDiscount / 100));
          }
        }
      } else if (validatedData.orderType === "subscription" && validatedData.subscriptionPlanId) {
        const plan = await storage.getSubscriptionPlan(validatedData.subscriptionPlanId);
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        basePrice = validatedData.billingCycle === "annual" && plan.annualPrice 
          ? plan.annualPrice 
          : plan.monthlyPrice;
      }
      
      // Apply discount code
      if (validatedData.discountCode) {
        const discount = await storage.getDiscountByCode(validatedData.discountCode);
        if (discount) {
          if (discount.discountType === "percentage") {
            discountAmount = String(Math.round(parseFloat(basePrice) * parseFloat(discount.discountValue) / 100));
          } else {
            discountAmount = discount.discountValue;
          }
        }
      }
      
      finalPrice = String(Math.max(0, parseFloat(basePrice) - parseFloat(discountAmount)));
      
      const order = await storage.createOrder({
        userId,
        orderType: validatedData.orderType,
        serviceId: validatedData.serviceId,
        subscriptionPlanId: validatedData.subscriptionPlanId,
        basePrice,
        discountAmount,
        finalPrice,
        discountCode: validatedData.discountCode,
        notes: validatedData.notes,
        status: "pending",
      });
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Update order (admin only)
  app.put("/api/orders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const order = await storage.updateOrder(req.params.id, req.body);
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // ============ PAYMENT ROUTES ============

  // Get user's payments
  app.get("/api/payments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const user = await storage.getUser(userId);
      const payments = user?.isAdmin 
        ? await storage.getPayments() 
        : await storage.getPayments(userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Initiate payment (placeholder for mobile money integration)
  const initiatePaymentSchema = z.object({
    orderId: z.string(),
    paymentMethod: z.enum(["mtn_momo", "airtel_money", "card"]),
    phoneNumber: z.string().optional(),
  });

  app.post("/api/payments/initiate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const validatedData = initiatePaymentSchema.parse(req.body);
      
      const order = await storage.getOrder(validatedData.orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (order.userId !== userId) return res.status(403).json({ message: "Access denied" });
      
      // Create payment record
      const payment = await storage.createPayment({
        orderId: order.id,
        userId,
        amount: order.finalPrice,
        paymentMethod: validatedData.paymentMethod,
        phoneNumber: validatedData.phoneNumber,
        status: "pending",
        provider: validatedData.paymentMethod === "mtn_momo" ? "mtn" 
          : validatedData.paymentMethod === "airtel_money" ? "airtel" 
          : "stripe",
      });
      
      // PLACEHOLDER: Here you would integrate with actual payment providers
      // For now, we simulate a successful payment after 2 seconds
      setTimeout(async () => {
        try {
          await storage.updatePayment(payment.id, { 
            status: "completed",
            paidAt: new Date(),
            externalTransactionId: `TXN_${Date.now()}`,
          });
          await storage.updateOrder(order.id, { status: "paid" });
          
          // If subscription order, create user subscription
          if (order.orderType === "subscription" && order.subscriptionPlanId) {
            const plan = await storage.getSubscriptionPlan(order.subscriptionPlanId);
            if (plan) {
              const nextBilling = new Date();
              nextBilling.setMonth(nextBilling.getMonth() + 1);
              
              await storage.createUserSubscription({
                userId,
                planId: plan.id,
                status: "active",
                billingCycle: "monthly",
                nextBillingDate: nextBilling,
                paymentMethod: validatedData.paymentMethod,
              });
              
              await storage.updateUser(userId, { subscriptionTier: plan.tierKey });
            }
          }
        } catch (err) {
          console.error("Error processing payment callback:", err);
        }
      }, 2000);
      
      res.status(201).json({ 
        payment,
        message: "Payment initiated. You will receive a prompt on your phone shortly.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error initiating payment:", error);
      res.status(500).json({ message: "Failed to initiate payment" });
    }
  });

  // ============ DISCOUNT ROUTES ============

  // Validate discount code
  app.post("/api/discounts/validate", async (req, res) => {
    try {
      const { code, orderType } = req.body;
      const discount = await storage.getDiscountByCode(code);
      
      if (!discount) {
        return res.status(404).json({ valid: false, message: "Invalid discount code" });
      }
      
      const now = new Date();
      if (discount.validUntil && new Date(discount.validUntil) < now) {
        return res.status(400).json({ valid: false, message: "Discount code has expired" });
      }
      
      if (discount.maxUses && discount.usedCount && discount.usedCount >= discount.maxUses) {
        return res.status(400).json({ valid: false, message: "Discount code usage limit reached" });
      }
      
      if (orderType && discount.appliesTo !== "all" && discount.appliesTo !== orderType) {
        return res.status(400).json({ valid: false, message: "Discount not applicable to this order type" });
      }
      
      res.json({ 
        valid: true, 
        discount: {
          code: discount.code,
          discountType: discount.discountType,
          discountValue: discount.discountValue,
          description: discount.description,
        }
      });
    } catch (error) {
      console.error("Error validating discount:", error);
      res.status(500).json({ message: "Failed to validate discount" });
    }
  });

  // ============ ADMIN PRICING MANAGEMENT ============

  // Admin: Get all subscription plans (including inactive)
  app.get("/api/admin/subscription-plans", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });

  // Admin: Update subscription plan
  app.put("/api/admin/subscription-plans/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const plan = await storage.updateSubscriptionPlan(req.params.id, req.body);
      res.json(plan);
    } catch (error) {
      console.error("Error updating plan:", error);
      res.status(500).json({ message: "Failed to update plan" });
    }
  });

  // Admin: Update service pricing
  app.put("/api/admin/services/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const service = await storage.updateService(req.params.id, req.body);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  // Admin: Create discount
  app.post("/api/admin/discounts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const discount = await storage.createDiscount(req.body);
      res.status(201).json(discount);
    } catch (error) {
      console.error("Error creating discount:", error);
      res.status(500).json({ message: "Failed to create discount" });
    }
  });

  // Admin: Get all discounts
  app.get("/api/admin/discounts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.isLocalAuth ? req.user.userId : req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const discounts = await storage.getDiscounts();
      res.json(discounts);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      res.status(500).json({ message: "Failed to fetch discounts" });
    }
  });

  // SEO: Robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /admin

Sitemap: https://applyhub.app/sitemap.xml
`);
  });

  // SEO: Sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const universities = await storage.getUniversities();
      const scholarships = await storage.getScholarships();
      const baseUrl = "https://applyhub.app";
      const today = new Date().toISOString().split('T')[0];

      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/universities", priority: "0.9", changefreq: "weekly" },
        { url: "/scholarships", priority: "0.9", changefreq: "weekly" },
        { url: "/services", priority: "0.8", changefreq: "monthly" },
        { url: "/pricing", priority: "0.7", changefreq: "monthly" },
        { url: "/blog", priority: "0.8", changefreq: "weekly" },
        { url: "/signup", priority: "0.6", changefreq: "monthly" },
        { url: "/login", priority: "0.5", changefreq: "monthly" },
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

      // Add static pages
      for (const page of staticPages) {
        xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      }

      // Add university pages
      for (const university of universities) {
        xml += `  <url>
    <loc>${baseUrl}/universities/${university.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }

      // Add scholarship pages
      for (const scholarship of scholarships) {
        xml += `  <url>
    <loc>${baseUrl}/scholarships/${scholarship.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }

      xml += `</urlset>`;

      res.type("application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
