import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dog } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <Dog className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">WagAndWash</span>
          </div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: January 25, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <h2>1. Introduction</h2>
          <p>
            WagAndWash (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to
            protecting your personal data. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our Service.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>Personal Information</h3>
          <p>We may collect the following personal information:</p>
          <ul>
            <li>Name and contact information (email, phone, address)</li>
            <li>Account credentials</li>
            <li>Payment information (processed securely by our payment partners)</li>
            <li>Pet information (name, breed, health records, photos)</li>
            <li>Appointment history and preferences</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you use our Service, we automatically collect:</p>
          <ul>
            <li>Device information (type, operating system, browser)</li>
            <li>IP address and location data</li>
            <li>Usage data and analytics</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain our Service</li>
            <li>Process appointments and payments</li>
            <li>Send appointment reminders and notifications</li>
            <li>Improve our Service and develop new features</li>
            <li>Communicate with you about updates and promotions</li>
            <li>Ensure the safety and security of our platform</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li><strong>Grooming Providers:</strong> To fulfill your appointments</li>
            <li><strong>Payment Processors:</strong> To process transactions securely</li>
            <li><strong>Service Providers:</strong> Who assist in operating our platform</li>
            <li><strong>Legal Authorities:</strong> When required by law</li>
          </ul>
          <p>
            We do not sell your personal information to third parties.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            data, including:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Employee training on data protection</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our Service and
            fulfill the purposes outlined in this policy. You may request deletion of your data at
            any time, subject to legal requirements.
          </p>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>

          <h2>8. Cookies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience. You can control
            cookie preferences through your browser settings. Essential cookies are required for
            the Service to function properly.
          </p>

          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Our Service is not intended for children under 13. We do not knowingly collect personal
            information from children. If you believe we have collected data from a child, please
            contact us immediately.
          </p>

          <h2>10. International Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own.
            We ensure appropriate safeguards are in place for such transfers.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of significant changes
            via email or through the Service. Your continued use after changes constitutes acceptance
            of the updated policy.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            For questions about this Privacy Policy or to exercise your rights, contact us at:
          </p>
          <ul>
            <li>Email: privacy@wagandwash.com</li>
            <li>Phone: 1-800-WAG-WASH</li>
            <li>Address: 123 Pet Street, San Francisco, CA 94102</li>
          </ul>

          <h2>13. California Privacy Rights (CCPA)</h2>
          <p>
            California residents have additional rights under the CCPA, including the right to know
            what personal information is collected, request deletion, and opt out of the sale of
            personal information (we do not sell personal information).
          </p>

          <h2>14. European Privacy Rights (GDPR)</h2>
          <p>
            If you are in the European Economic Area, you have rights under GDPR including access,
            rectification, erasure, and the right to lodge a complaint with a supervisory authority.
          </p>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Dog className="h-6 w-6 text-primary" />
            <span className="font-bold">WagAndWash</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 WagAndWash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
