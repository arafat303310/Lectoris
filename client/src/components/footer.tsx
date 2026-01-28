import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";
import applyHubLogo from "@assets/Gemini_Generated_Image_ia7s87ia7s87ia7s~2_1764741648513.png";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border relative overflow-hidden" data-testid="footer">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-6 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
            <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300 inline-block">
              <img 
                src={applyHubLogo} 
                alt="ApplyHub Uganda" 
                className="h-12 sm:h-14 w-auto"
                data-testid="footer-logo"
              />
            </Link>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Your trusted partner for higher education in Uganda. Connecting students with universities since 2024.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125" data-testid="facebook-link">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125" data-testid="twitter-link">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125" data-testid="instagram-link">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125" data-testid="linkedin-link">
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
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-privacy-link">Privacy Policy</Link></li>
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
                <span>+256 708 922 009</span>
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
            © 2026 Lectoris. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
