import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dog } from "lucide-react";

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: January 25, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the WagAndWash platform (&quot;Service&quot;), you agree to be bound by these
            Terms of Service (&quot;Terms&quot;). If you disagree with any part of the terms, you may not
            access the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            WagAndWash provides a platform for pet grooming businesses to manage appointments, clients,
            and operations. The Service includes scheduling tools, client management, payment processing,
            and related features.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate and complete information.
            You are responsible for safeguarding the password and for all activities that occur under
            your account.
          </p>
          <ul>
            <li>You must be at least 18 years old to use this Service</li>
            <li>You must provide valid contact information</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must notify us immediately of any unauthorized access</li>
          </ul>

          <h2>4. Booking and Cancellation Policy</h2>
          <p>
            Appointments booked through WagAndWash are subject to the following policies:
          </p>
          <ul>
            <li>Deposits may be required at the time of booking</li>
            <li>Cancellations within 24 hours may result in forfeiture of deposit</li>
            <li>No-shows may be charged in full</li>
            <li>Rescheduling is subject to availability</li>
          </ul>

          <h2>5. Payment Terms</h2>
          <p>
            Payment processing is handled through our secure payment partners. By using our payment
            features, you agree to:
          </p>
          <ul>
            <li>Provide accurate payment information</li>
            <li>Authorize charges for services rendered</li>
            <li>Pay all applicable fees and taxes</li>
          </ul>

          <h2>6. Pet Health and Safety</h2>
          <p>
            Clients are responsible for:
          </p>
          <ul>
            <li>Ensuring pets are current on vaccinations</li>
            <li>Disclosing any health conditions or behavioral issues</li>
            <li>Providing accurate information about pet temperament</li>
            <li>Notifying groomers of any known allergies or sensitivities</li>
          </ul>

          <h2>7. Liability Limitations</h2>
          <p>
            WagAndWash and its grooming partners take every precaution to ensure pet safety. However:
          </p>
          <ul>
            <li>We are not liable for pre-existing conditions</li>
            <li>Minor skin irritation from grooming is normal</li>
            <li>Aggressive pets may be refused service for safety</li>
            <li>Emergency vet care, if needed, is the owner&apos;s responsibility</li>
          </ul>

          <h2>8. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by WagAndWash
            and are protected by international copyright, trademark, and other intellectual property laws.
          </p>

          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice, for any reason,
            including breach of these Terms. Upon termination, your right to use the Service will
            immediately cease.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of significant
            changes via email or through the Service. Continued use after changes constitutes acceptance
            of the new Terms.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <ul>
            <li>Email: legal@wagandwash.com</li>
            <li>Phone: 1-800-WAG-WASH</li>
            <li>Address: 123 Pet Street, San Francisco, CA 94102</li>
          </ul>
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
