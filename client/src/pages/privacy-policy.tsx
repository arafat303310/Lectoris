import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEO from "@/components/seo";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy | Lectoris"
        description="Learn how Lectoris collects, uses, and protects your personal information."
        canonical="/privacy-policy"
      />
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            <strong>Last updated:</strong> January 28, 2026
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-foreground/90">
              Lectoris ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
            <p className="text-foreground/90">When you create an account, we collect:</p>
            <ul className="list-disc pl-6 text-foreground/90 space-y-2">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Password (encrypted)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground">Usage Information</h3>
            <p className="text-foreground/90">We automatically collect:</p>
            <ul className="list-disc pl-6 text-foreground/90 space-y-2">
              <li>Universities and scholarships you view or save</li>
              <li>Services you request</li>
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p className="text-foreground/90">We use your information to:</p>
            <ul className="list-disc pl-6 text-foreground/90 space-y-2">
              <li>Create and manage your account</li>
              <li>Provide personalized university and scholarship recommendations</li>
              <li>Process service requests and payments</li>
              <li>Send important updates about your applications</li>
              <li>Improve our services and user experience</li>
              <li>Communicate promotional offers (with your consent)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Information Sharing</h2>
            <p className="text-foreground/90">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-foreground/90 space-y-2">
              <li>Service providers who assist in our operations (payment processors, email services)</li>
              <li>Universities when you submit applications through our platform</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
            <p className="text-foreground/90">
              We implement appropriate security measures including encryption, secure servers, and regular security audits to protect your personal information from unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
            <p className="text-foreground/90">You have the right to:</p>
            <ul className="list-disc pl-6 text-foreground/90 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Data Retention</h2>
            <p className="text-foreground/90">
              We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Children's Privacy</h2>
            <p className="text-foreground/90">
              Our services are intended for users aged 16 and above. We do not knowingly collect personal information from children under 16. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">9. Changes to This Policy</h2>
            <p className="text-foreground/90">
              We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">10. Contact Us</h2>
            <p className="text-foreground/90">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <ul className="list-none text-foreground/90 space-y-2">
              <li><strong>Email:</strong> privacy@lectoris.app</li>
              <li><strong>Phone:</strong> +256 708 922 009</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
