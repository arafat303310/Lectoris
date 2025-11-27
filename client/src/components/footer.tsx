import { Link } from "wouter";
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border" data-testid="footer">
      <div className="container mx-auto px-4 lg:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">ApplyHub</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Your trusted partner for higher education in Uganda. Connecting students with universities since 2024.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="facebook-link">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="twitter-link">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="instagram-link">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="linkedin-link">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/universities" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-universities-link">Universities</Link></li>
              <li><Link href="/scholarships" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-scholarships-link">Scholarships</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-services-link">Services</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-pricing-link">Pricing</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-about-link">About Us</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-help-link">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-contact-link">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-faq-link">FAQs</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-privacy-link">Privacy</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Contact</h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span>Kampala, Uganda</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span>+256 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span>info@applyhub.ug</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span>Mon-Fri: 8AM-6PM</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2024 ApplyHub Uganda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
