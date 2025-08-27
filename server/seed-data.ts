import { db } from "./db";
import { universities, scholarships, services } from "@shared/schema";

export const ugandaUniversitiesData = [
  {
    name: "Makerere University",
    location: "Kampala",
    type: "public" as const,
    status: "chartered" as const,
    description: "Established in 1922, Uganda's oldest and largest university offering comprehensive programs across all disciplines. Known for excellence in research and academic programs.",
    tuitionMin: "1500000",
    tuitionMax: "4000000",
    websiteUrl: "https://www.mak.ac.ug",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Makerere_University_Logo.svg/512px-Makerere_University_Logo.svg.png",
    established: 1922,
    specialties: ["Medicine", "Engineering", "Business", "Law", "Agriculture", "Humanities"]
  },
  {
    name: "Mbarara University of Science and Technology",
    location: "Mbarara",
    type: "public" as const,
    status: "chartered" as const,
    description: "Leading institution for science, technology, and health sciences with strong research programs and modern facilities.",
    tuitionMin: "2000000",
    tuitionMax: "5000000",
    websiteUrl: "https://www.must.ac.ug",
    logoUrl: "https://must.ac.ug/wp-content/uploads/2020/09/must-logo-1.png",
    established: 1989,
    specialties: ["Medicine", "Science & Technology", "Health Sciences", "Computing", "Development Studies"]
  },
  {
    name: "Gulu University",
    location: "Gulu",
    type: "public" as const,
    status: "chartered" as const,
    description: "Northern Uganda's flagship university focusing on regional development, agriculture, and community engagement.",
    tuitionMin: "1800000",
    tuitionMax: "4500000",
    websiteUrl: "https://www.gu.ac.ug",
    logoUrl: "https://gu.ac.ug/sites/default/files/logo_3.png",
    established: 2002,
    specialties: ["Agriculture", "Education", "Medicine", "Business", "Engineering"]
  },
  {
    name: "Kyambogo University",
    location: "Kampala",
    type: "public" as const,
    status: "chartered" as const,
    description: "Education and technology focused university providing quality training for teachers and technical professionals.",
    tuitionMin: "1400000",
    tuitionMax: "3800000",
    logoUrl: "https://kyu.ac.ug/sites/default/files/logo_1.png",
    established: 2003,
    specialties: ["Education", "Engineering", "Special Needs Education", "Vocational Studies"]
  },
  {
    name: "Busitema University",
    location: "Busitema",
    type: "public" as const,
    status: "chartered" as const,
    description: "Engineering and agriculture focused institution with emphasis on practical skills and innovation.",
    tuitionMin: "1600000",
    tuitionMax: "4200000",
    logoUrl: "https://busitema.ac.ug/wp-content/uploads/2021/08/busitema-logo.png",
    established: 2007,
    specialties: ["Engineering", "Agriculture", "Applied Sciences", "Health Sciences"]
  },
  {
    name: "Uganda Christian University",
    location: "Mukono",
    type: "private" as const,
    status: "chartered" as const,
    description: "First private chartered university (2004) offering quality education with Christian values and holistic development.",
    tuitionMin: "3000000",
    tuitionMax: "6000000",
    websiteUrl: "https://www.ucu.ac.ug",
    logoUrl: "https://www.ucu.ac.ug/wp-content/uploads/2019/11/UCU-Logo.png",
    established: 1997,
    specialties: ["Theology", "Business", "Law", "Journalism", "Education", "Social Sciences"]
  },
  {
    name: "Kampala International University",
    location: "Kampala",
    type: "private" as const,
    status: "chartered" as const,
    description: "Comprehensive private university with diverse programs and international partnerships for global education opportunities.",
    tuitionMin: "2500000",
    tuitionMax: "7000000",
    websiteUrl: "https://www.kiu.ac.ug",
    logoUrl: "https://kiu.ac.ug/wp-content/uploads/2021/03/KIU-Logo-1.png",
    established: 2001,
    specialties: ["Medicine", "Engineering", "Business", "Law", "Pharmacy", "Nursing"]
  },
  {
    name: "Islamic University in Uganda",
    location: "Mbale",
    type: "private" as const,
    status: "chartered" as const,
    description: "Islamic institution offering diverse programs with emphasis on Islamic values, ethics, and comprehensive education.",
    tuitionMin: "2000000",
    tuitionMax: "5500000",
    websiteUrl: "https://www.iuiu.ac.ug",
    logoUrl: "https://iuiu.ac.ug/wp-content/uploads/2021/04/IUIU-Logo.png",
    established: 1988,
    specialties: ["Islamic Studies", "Education", "Management", "Science & Technology"]
  },
  {
    name: "Uganda Martyrs University",
    location: "Nkozi",
    type: "private" as const,
    status: "chartered" as const,
    description: "Catholic university known for excellence in liberal arts, business, and social sciences education.",
    tuitionMin: "2800000",
    tuitionMax: "5800000",
    websiteUrl: "https://www.umu.ac.ug",
    logoUrl: "https://www.umu.ac.ug/wp-content/uploads/2020/01/UMU-logo.png",
    established: 1993,
    specialties: ["Business", "Social Sciences", "Education", "Ethics & Development Studies"]
  },
  {
    name: "Ndejje University",
    location: "Luwero",
    type: "private" as const,
    status: "chartered" as const,
    description: "One of Uganda's oldest private universities established in 1992, offering diverse academic programs.",
    tuitionMin: "2200000",
    tuitionMax: "5200000",
    logoUrl: "https://ndejjeuniversity.ac.ug/wp-content/uploads/2021/03/Ndejje-Logo.png",
    established: 1992,
    specialties: ["Business", "Education", "Social Sciences", "Information Technology"]
  },
  {
    name: "Nkumba University",
    location: "Entebbe",
    type: "private" as const,
    status: "chartered" as const,
    description: "Business-focused private university located near Lake Victoria with modern facilities.",
    tuitionMin: "2400000",
    tuitionMax: "5600000",
    logoUrl: "https://nkumbauniversity.ac.ug/wp-content/uploads/2021/02/Nkumba-Logo.png",
    established: 1994,
    specialties: ["Business", "Computing", "Social Sciences", "Mass Communication"]
  },
  {
    name: "Bugema University",
    location: "Kampala",
    type: "private" as const,
    status: "chartered" as const,
    description: "Seventh-day Adventist university offering holistic education with emphasis on Christian values.",
    tuitionMin: "2300000",
    tuitionMax: "5400000",
    logoUrl: "https://bugema.ac.ug/wp-content/uploads/2021/04/Bugema-Logo.png",
    established: 1994,
    specialties: ["Theology", "Business", "Education", "Health Sciences"]
  },
  {
    name: "Mountains of the Moon University",
    location: "Fort Portal",
    type: "private" as const,
    status: "chartered" as const,
    description: "Regional university serving western Uganda with focus on community development.",
    tuitionMin: "2100000",
    tuitionMax: "4800000",
    logoUrl: "https://mmu.ac.ug/wp-content/uploads/2021/04/MMU-Logo.png",
    established: 2005,
    specialties: ["Health Sciences", "Business", "Education", "Development Studies"]
  },
  {
    name: "Bishop Stuart University",
    location: "Mbarara",
    type: "private" as const,
    status: "chartered" as const,
    description: "Anglican university in southwestern Uganda focusing on holistic education.",
    tuitionMin: "2200000",
    tuitionMax: "5000000",
    logoUrl: "https://bsu.ac.ug/wp-content/uploads/2021/04/BSU-Logo.png",
    established: 2003,
    specialties: ["Theology", "Education", "Development Studies", "Business"]
  },
  {
    name: "International University of East Africa",
    location: "Kampala",
    type: "private" as const,
    status: "chartered" as const,
    description: "Technology and business focused university with modern programs and facilities.",
    tuitionMin: "2600000",
    tuitionMax: "6200000",
    logoUrl: "https://iuea.ac.ug/wp-content/uploads/2021/05/IUEA-Logo.png",
    established: 2010,
    specialties: ["Information Technology", "Business", "Engineering", "Health Sciences"]
  },
  {
    name: "Cavendish University Uganda",
    location: "Kampala",
    type: "private" as const,
    status: "chartered" as const,
    description: "International university offering globally recognized programs with modern facilities.",
    tuitionMin: "3200000",
    tuitionMax: "7200000",
    logoUrl: "https://cavendish.ac.ug/wp-content/uploads/2021/03/Cavendish-Logo.png",
    established: 2008,
    specialties: ["Business", "Law", "Psychology", "Information Technology"]
  },
  {
    name: "Victoria University",
    location: "Kampala",
    type: "private" as const,
    status: "chartered" as const,
    description: "Recently chartered university offering contemporary programs in business and technology.",
    tuitionMin: "2800000",
    tuitionMax: "6500000",
    logoUrl: "https://vu.ac.ug/wp-content/uploads/2021/03/Victoria-Logo.png",
    established: 2011,
    specialties: ["Business", "Information Technology", "Social Sciences"]
  },
  {
    name: "Muni University",
    location: "Arua",
    type: "public" as const,
    status: "chartered" as const,
    description: "Serving the West Nile region with focus on regional development and community engagement.",
    tuitionMin: "1700000",
    tuitionMax: "4300000",
    logoUrl: "https://muni.ac.ug/wp-content/uploads/2021/06/muni-university-logo.png",
    established: 2013,
    specialties: ["Medicine", "Applied Sciences", "Education", "Agriculture"]
  },
  {
    name: "Lira University",
    location: "Lira",
    type: "public" as const,
    status: "chartered" as const,
    description: "Northern Uganda university focusing on agriculture, education, and regional development.",
    tuitionMin: "1600000",
    tuitionMax: "4100000",
    logoUrl: "https://lirauni.ac.ug/wp-content/uploads/2021/05/lira-university-logo.png",
    established: 2015,
    specialties: ["Agriculture", "Education", "Applied Sciences"]
  },
  {
    name: "Kabale University",
    location: "Kabale",
    type: "public" as const,
    status: "chartered" as const,
    description: "Southwestern regional university with emphasis on agriculture and development studies.",
    tuitionMin: "1500000",
    tuitionMax: "4000000",
    logoUrl: "https://kab.ac.ug/wp-content/uploads/2021/06/kabale-university-logo.png",
    established: 2015,
    specialties: ["Agriculture", "Education", "Development Studies", "Business"]
  }
];

export const ugandaScholarshipsData = [
  {
    title: "Uganda Government Scholarship Scheme",
    description: "Full tuition coverage for exceptional students pursuing undergraduate degrees in public universities across Uganda. Merit-based selection with focus on academic excellence.",
    provider: "Government of Uganda",
    amount: "5000000",
    currency: "UGX",
    eligibility: "Ugandan citizens with excellent academic performance, financial need demonstration, and commitment to national development.",
    level: "undergraduate" as const,
    type: "government" as const,
    deadline: new Date("2025-03-30"),
    applicationUrl: "https://www.education.go.ug/scholarships",
    isActive: true
  },
  {
    title: "Mastercard Foundation Scholars Program",
    description: "Comprehensive scholarship covering tuition, accommodation, and mentorship for undergraduate studies at partner universities. Includes leadership development and community service components.",
    provider: "Mastercard Foundation",
    amount: "15000000",
    currency: "UGX",
    eligibility: "Academically talented students from disadvantaged backgrounds with leadership potential and commitment to giving back to their communities.",
    level: "undergraduate" as const,
    type: "international" as const,
    deadline: new Date("2025-02-15"),
    applicationUrl: "https://mastercardfdn.org/scholars/",
    isActive: true
  },
  {
    title: "Commonwealth Scholarship for Ugandans",
    description: "Fully funded masters and PhD opportunities in UK universities for students from Commonwealth countries including Uganda. Covers all expenses plus living allowance.",
    provider: "Commonwealth Scholarship Commission",
    amount: "25000000",
    currency: "UGX",
    eligibility: "First-class or upper second-class honors degree, proven academic merit, development impact potential, and English proficiency.",
    level: "postgraduate" as const,
    type: "international" as const,
    deadline: new Date("2024-12-20"),
    applicationUrl: "https://cscuk.fcdo.gov.uk/",
    isActive: true
  },
  {
    title: "DAAD Scholarships for Development",
    description: "German Academic Exchange Service scholarships for postgraduate studies in Germany with focus on development-related fields relevant to Uganda.",
    provider: "DAAD Germany",
    amount: "18000000",
    currency: "UGX",
    eligibility: "Bachelor's degree in relevant field, two years work experience, strong academic record, and commitment to development in home country.",
    level: "postgraduate" as const,
    type: "international" as const,
    deadline: new Date("2025-01-31"),
    applicationUrl: "https://www.daad.org/en/",
    isActive: true
  },
  {
    title: "Uganda Women's Scholarship Fund",
    description: "Supporting female students in STEM fields and traditionally male-dominated disciplines. Priority given to students from rural areas.",
    provider: "Uganda Women's Education Foundation",
    amount: "3000000",
    currency: "UGX",
    eligibility: "Female students enrolled in STEM programs, demonstration of financial need, and academic merit.",
    level: "both" as const,
    type: "private" as const,
    deadline: new Date("2025-04-15"),
    isActive: true
  },
  {
    title: "USAID Higher Education Scholarship",
    description: "Merit-based scholarships for Ugandan students pursuing degrees in agriculture, health, education, and business. Includes mentorship and internship opportunities.",
    provider: "USAID Uganda",
    amount: "8000000",
    currency: "UGX",
    eligibility: "Strong academic performance, leadership potential, commitment to contributing to Uganda's development.",
    level: "both" as const,
    type: "international" as const,
    deadline: new Date("2025-03-15"),
    applicationUrl: "https://www.usaid.gov/uganda/education",
    isActive: true
  },
  {
    title: "Chevening Scholarships",
    description: "UK government's global scholarship programme offering fully-funded one-year master's degrees for future leaders from Uganda.",
    provider: "UK Foreign, Commonwealth & Development Office",
    amount: "30000000",
    currency: "UGX",
    eligibility: "Bachelor's degree, two years work experience, leadership potential, and strong networking skills.",
    level: "postgraduate" as const,
    type: "international" as const,
    deadline: new Date("2024-11-05"),
    applicationUrl: "https://www.chevening.org/",
    isActive: true
  },
  {
    title: "Islamic Development Bank Scholarship",
    description: "Scholarships for undergraduate and postgraduate studies for students from member countries including Uganda, with preference for science and technology fields.",
    provider: "Islamic Development Bank",
    amount: "12000000",
    currency: "UGX",
    eligibility: "Muslim students with strong academic record, financial need, and commitment to community development.",
    level: "both" as const,
    type: "international" as const,
    deadline: new Date("2025-02-28"),
    applicationUrl: "https://www.isdb.org/scholarships",
    isActive: true
  },
  {
    title: "Uganda Petroleum Institute Scholarship",
    description: "Scholarships for students pursuing petroleum and energy-related studies, supporting Uganda's growing oil and gas sector.",
    provider: "Uganda Petroleum Institute",
    amount: "4500000",
    currency: "UGX",
    eligibility: "Students in petroleum engineering, geology, and related fields with strong academic performance.",
    level: "both" as const,
    type: "government" as const,
    deadline: new Date("2025-03-20"),
    isActive: true
  },
  {
    title: "African Development Bank Scholarship",
    description: "Supporting African students in higher education with focus on fields critical to Africa's development including agriculture, health, and engineering.",
    provider: "African Development Bank",
    amount: "10000000",
    currency: "UGX",
    eligibility: "African nationals with strong academic credentials and commitment to African development.",
    level: "postgraduate" as const,
    type: "international" as const,
    deadline: new Date("2025-01-15"),
    applicationUrl: "https://www.afdb.org/en/about/careers/scholarship-program",
    isActive: true
  }
];

export const servicesData = [
  {
    name: "Apply to Universities",
    description: "Complete application assistance from document preparation to submission for your dream university. Includes application review, essay writing support, and deadline management.",
    price: "150000",
    currency: "UGX",
    isActive: true
  },
  {
    name: "Win Scholarships",
    description: "Personalized scholarship search and application strategy to maximize your funding opportunities. Includes application writing, interview preparation, and funding strategy.",
    price: "200000",
    currency: "UGX",
    isActive: true
  },
  {
    name: "Craft Resume",
    description: "Professional resume and CV writing services tailored for academic and scholarship applications. Includes cover letter writing and LinkedIn profile optimization.",
    price: "75000",
    currency: "UGX",
    isActive: true
  },
  {
    name: "Expert Guidance",
    description: "One-on-one consultation with education experts for career planning and academic decisions. Includes personalized roadmap and ongoing support.",
    price: "50000",
    currency: "UGX",
    isActive: true
  }
];

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Seed universities
    console.log("Seeding universities...");
    for (const universityData of ugandaUniversitiesData) {
      await db.insert(universities).values(universityData).onConflictDoNothing();
    }
    console.log(`Seeded ${ugandaUniversitiesData.length} universities`);

    // Seed scholarships
    console.log("Seeding scholarships...");
    for (const scholarshipData of ugandaScholarshipsData) {
      await db.insert(scholarships).values(scholarshipData).onConflictDoNothing();
    }
    console.log(`Seeded ${ugandaScholarshipsData.length} scholarships`);

    // Seed services
    console.log("Seeding services...");
    for (const serviceData of servicesData) {
      await db.insert(services).values(serviceData).onConflictDoNothing();
    }
    console.log(`Seeded ${servicesData.length} services`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
