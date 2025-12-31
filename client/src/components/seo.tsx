import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: "website" | "article";
  image?: string;
  keywords?: string;
  structuredData?: object;
}

export default function SEO({ 
  title, 
  description, 
  canonical, 
  type = "website",
  image = "/og-image.png",
  keywords,
  structuredData
}: SEOProps) {
  const siteName = "ApplyHub";
  const siteUrl = "https://applyhub.app";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={`${siteUrl}${image}`} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
      
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "ApplyHub",
  "url": "https://applyhub.app",
  "logo": "https://applyhub.app/applyhub-logo.png",
  "description": "Uganda's leading platform for university applications and scholarship discovery",
  "areaServed": {
    "@type": "Country",
    "name": "Uganda"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+256-708-922-009",
    "contactType": "customer service"
  }
};

export function generateUniversitySchema(university: {
  name: string;
  description: string;
  location: string;
  websiteUrl?: string;
  logoUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "name": university.name,
    "description": university.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": university.location,
      "addressCountry": "Uganda"
    },
    ...(university.websiteUrl && { "url": university.websiteUrl }),
    ...(university.logoUrl && { "logo": `https://applyhub.app${university.logoUrl}` })
  };
}

export function generateScholarshipSchema(scholarship: {
  title: string;
  description: string;
  provider: string;
  amount?: string;
  currency?: string;
  deadline: Date | string;
  eligibility: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": scholarship.title,
    "description": scholarship.description,
    "provider": {
      "@type": "Organization",
      "name": scholarship.provider
    },
    ...(scholarship.amount && {
      "offers": {
        "@type": "Offer",
        "price": scholarship.amount,
        "priceCurrency": scholarship.currency || "UGX"
      }
    }),
    "applicationDeadline": new Date(scholarship.deadline).toISOString().split('T')[0],
    "educationalCredentialAwarded": "Scholarship"
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  datePublished: string;
  author?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "datePublished": article.datePublished,
    "author": {
      "@type": "Organization",
      "name": article.author || "ApplyHub"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ApplyHub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://applyhub.app/logo.png"
      }
    },
    ...(article.image && { "image": article.image })
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://applyhub.app${item.url}`
    }))
  };
}
