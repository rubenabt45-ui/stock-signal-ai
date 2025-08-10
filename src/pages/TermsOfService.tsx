import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and 
                INGENIO FINANCIERO DIGITAL, S.A.P.I. DE C.V. ("TradeIQ", "we", "our", "us") regarding 
                your use of the TradeIQ Pro platform and services available at https://tradeiqpro.com 
                (the "Service").
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree 
                with any part of these terms, then you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Company Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                TradeIQ Pro is operated by INGENIO FINANCIERO DIGITAL, S.A.P.I. DE C.V., a company 
                incorporated under the laws of Mexico.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Contact Information:</strong><br />
                Email: support@tradeiqpro.com<br />
                Website: https://tradeiqpro.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Service Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                TradeIQ Pro provides financial market analysis tools, trading insights, educational 
                content, and related services. Our platform is designed to assist users in making 
                informed trading decisions through AI-powered analysis and market data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Accounts and Registration</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To access certain features of our Service, you must create an account. You agree to:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly update your account information as needed</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to use our Service only for lawful purposes and in accordance with these Terms. 
                You agree not to:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Resell or redistribute our Service without authorization</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Financial Disclaimers and Risk Warnings</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>IMPORTANT FINANCIAL RISK DISCLOSURE:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Trading in financial markets involves substantial risk of loss</li>
                <li>Past performance does not guarantee future results</li>
                <li>Our Service provides information and analysis, not investment advice</li>
                <li>You should consult with qualified financial professionals before making investment decisions</li>
                <li>We do not guarantee the accuracy or completeness of market data</li>
                <li>You are solely responsible for your trading decisions and their consequences</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Intellectual Property Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will remain 
                the exclusive property of INGENIO FINANCIERO DIGITAL, S.A.P.I. DE C.V. and its licensors. 
                The Service is protected by copyright, trademark, and other laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, 
                publicly perform, republish, download, store, or transmit any of the material on our 
                Service without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the Service, to understand our practices regarding the collection and use 
                of your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Subscription and Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Certain features of our Service may require payment. By subscribing to paid features:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>You agree to pay all applicable fees as described in our pricing</li>
                <li>Payments are processed securely through third-party payment processors</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>Refunds are subject to our refund policy</li>
                <li>We reserve the right to modify pricing with appropriate notice</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without 
                prior notice or liability, for any reason, including if you breach these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You may terminate your account at any time by contacting us or using the account 
                deletion features in the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To the maximum extent permitted by applicable law, INGENIO FINANCIERO DIGITAL, S.A.P.I. DE C.V. 
                shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including loss of profits, data, use, or other intangible losses.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our total liability to you for all claims arising from or relating to these Terms or 
                the Service shall not exceed the amount you paid us in the twelve (12) months preceding 
                the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim 
                all warranties of any kind, whether express or implied, including the implied warranties 
                of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Governing Law and Jurisdiction</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Mexico. 
                Any disputes arising from or relating to these Terms or the Service shall be subject 
                to the exclusive jurisdiction of the courts of Guadalajara, Jalisco, Mexico.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is 
                material, we will provide at least 30 days' notice prior to any new terms taking effect. 
                Your continued use of the Service after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">15. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining 
                provisions will continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">16. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at 
                support@tradeiqpro.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
