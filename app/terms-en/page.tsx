"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

export default function EnglishTermsPage() {
  const { currentLang } = useLanguage();

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div
        className="container mx-auto px-4 py-8 max-w-4xl"
        style={{
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        }}
      >
        <div
          dir="ltr"
          style={{
            textAlign: "left",
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.8",
          }}
        >
          <h2 className="text-2xl font-bold mb-4">
            Terms and Conditions for Using True Chance Platform
          </h2>
          <p className="mb-4">
            <strong>Owned entirely by:</strong> Mr. Ahmed Ali Hussein Alghamdi
            <br />
            <strong>Last Updated:</strong> 21 August 2025
          </p>

          <p className="mb-6">
            Please read these terms carefully before using any of the platform's
            services. By accessing or using the platform, you agree to all of
            the conditions below and confirm your full commitment to them. This
            document represents a final and legally binding agreement between
            the user and True Chance platform.
          </p>

          <hr className="my-6 border-zinc-700" />

          <h3 className="text-xl font-semibold mb-3">1. Definitions</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              <strong>Platform:</strong> Refers to "True Chance" digital
              services, fully and exclusively owned by Mr. Ahmed Ali Hussein
              Alghamdi.
            </li>
            <li>
              <strong>User:</strong> Anyone who uses the platform in any form,
              whether browsing, uploading a CV, conducting an interview, or
              subscribing to any service.
            </li>
            <li>
              <strong>Service:</strong> Includes all the tools and solutions
              offered by the platform, such as professional analysis, AI-driven
              interviews, file creation, job matching, and any future services.
            </li>
            <li>
              <strong>Payment:</strong> A fixed fee paid by the user for each
              service used. It is not a subscription and is non-refundable under
              any circumstances.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            2. Subscription and Service Nature
          </h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              Access to services requires payment of a one-time fixed fee for
              each usage of the service.
            </li>
            <li>
              This fee is charged per service usage, not as a subscription, and
              is non-refundable.
            </li>
            <li>
              The platform provides advanced professional analysis and
              AI-powered recommendations, but it does not guarantee any specific
              results or employment.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            3. Relationship and Liability
          </h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              Using the platform does not constitute an employment contract.
            </li>
            <li>
              The platform makes every effort to highlight and present users
              professionally but does not guarantee responses from employers or
              acceptance into jobs.
            </li>
            <li>
              Neither the platform, its owner, nor its team bear any liability
              beyond the amount paid by the user.
            </li>
            <li>
              Users cannot claim any financial or moral compensation for lack of
              job matching, delays, or any other reason.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            4. Privacy and Data Usage
          </h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              The platform itself commits to keeping all user data confidential
              and will handle it within the scope of legitimate and lawful
              usage.
            </li>
            <li>
              The platform reserves the right to use the provided data (CVs,
              interview answers, professional analysis, audio or text records)
              for service improvement, internal research, and presenting users
              to employers.
            </li>
            <li>
              The platform may involve third-party providers at any stage of the
              technology used, and the user expressly agrees to this by
              accepting these terms.
            </li>
            <li>
              The user is responsible for the accuracy of the information they
              provide during usage.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">5. User Conduct</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              Users must use the platform in a lawful and ethical manner and
              must not submit false, misleading, or rights-violating content.
            </li>
            <li>
              The platform reserves the right to suspend or terminate user
              access without prior notice and without any refund if violations
              occur.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">6. Future Services</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              The platform may introduce additional services or packages (such
              as career consultations, skill assessments, or interview
              preparation).
            </li>
            <li>
              Each of these services will have separate terms and fees clearly
              presented before subscription.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            7. Intellectual Property
          </h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              All intellectual property rights, technologies, databases,
              content, and operations of the "True Chance" platform are
              exclusively owned by Mr. Ahmed Ali Hussein Alghamdi.
            </li>
            <li>
              Copying, reusing, selling, or redistributing any part of the
              platform is strictly prohibited without written approval from the
              owner.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            8. Disputes and Legal Jurisdiction
          </h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              These terms are governed by the laws of the Kingdom of Saudi
              Arabia.
            </li>
            <li>
              Any disputes will fall under the exclusive jurisdiction of the
              courts in Riyadh.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">9. Amendments</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              The platform reserves the right to update or amend these terms at
              any time without prior notice. Continued use of the platform after
              updates constitutes acceptance of the new terms.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">10. General Provisions</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              These terms represent the full and final agreement between the
              platform and the user.
            </li>
            <li>
              If any clause is found legally invalid, the remaining clauses
              remain binding and enforceable.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
