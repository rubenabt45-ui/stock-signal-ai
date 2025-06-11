
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Scale, FileText, Shield, Award } from 'lucide-react';

export const LegalSection = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const legalContent = {
    terms: `# Terms and Conditions

Last updated: ${new Date().toLocaleDateString()}

## 1. Acceptance of Terms
By accessing and using TradeIQ, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Use License
Permission is granted to temporarily download one copy of TradeIQ's materials for personal, non-commercial transitory viewing only.

## 3. Disclaimer
The materials on TradeIQ are provided on an 'as is' basis. TradeIQ makes no warranties, expressed or implied, and hereby disclaims all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## 4. Limitations
In no event shall TradeIQ or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TradeIQ, even if TradeIQ or a TradeIQ authorized representative has been notified orally or in writing of the possibility of such damage.

## 5. Trading Risks
Trading in financial markets involves substantial risk of loss and is not suitable for all investors. You should carefully consider your financial situation and risk tolerance before engaging in trading activities.

## 6. Data Usage
We collect and use data as described in our Privacy Policy to provide and improve our services.

## 7. Modifications
TradeIQ may revise these terms of service at any time without notice. By using this application, you are agreeing to be bound by the then current version of these terms of service.

## 8. Governing Law
Any claim relating to TradeIQ shall be governed by the laws of the jurisdiction in which TradeIQ operates without regard to its conflict of law provisions.`,

    privacy: `# Privacy Policy

Last updated: ${new Date().toLocaleDateString()}

## Information We Collect

### Personal Information
- Account information (email address, name, username)
- Profile information (avatar, preferences)
- Usage data and analytics
- Trading preferences and settings

### Automatically Collected Information
- Device information and browser type
- IP address and location data
- Usage patterns and feature interactions
- Performance and error logs

## How We Use Information

We use the collected information for the following purposes:
- To provide and maintain our services
- To notify you about changes to our service
- To provide customer support and assistance
- To monitor usage and improve our services
- To detect and prevent fraud or abuse

## Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
- Encryption of data in transit and at rest
- Regular security assessments
- Access controls and authentication
- Secure data storage practices

## Third Party Services

Our service may contain links to third party services that are not operated by us. We strongly advise you to review the Privacy Policy of every site you visit.

## Data Retention

We retain your personal data only for as long as necessary for the purposes set out in this policy. We will retain and use your information to comply with legal obligations, resolve disputes, and enforce agreements.

## Your Rights

You have the right to:
- Access your personal information
- Update or correct your data
- Delete your account and associated data
- Opt out of certain communications
- Export your data

## Contact Us

If you have any questions about this Privacy Policy, please contact us at:
- Email: support@tradeiq.ai
- Website: https://tradeiq.ai/contact`,

    license: `# License Agreement

Last updated: ${new Date().toLocaleDateString()}

## Software License

TradeIQ grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the software strictly in accordance with the terms of this agreement.

## Restrictions

You agree not to, and you will not permit others to:
- License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the software
- Copy, modify, make derivative works of, disassemble, reverse compile or reverse engineer any part of the software
- Remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of TradeIQ or its affiliates

## Intellectual Property

The software and all worldwide copyrights, trade secrets, and other intellectual property rights therein are the exclusive property of TradeIQ. TradeIQ reserves all rights in and to the software not expressly granted to you in this agreement.

## Updates and Modifications

TradeIQ may from time to time in its sole discretion develop and provide updates, which may include upgrades, bug fixes, patches, and other error corrections and/or new features.

## Term and Termination

This license is effective until terminated. Your rights under this license will terminate automatically without notice from TradeIQ if you fail to comply with any term(s) of this agreement.

## Limitation of Liability

TradeIQ's total liability to you for all damages shall not exceed the amount paid by you for the software. In no event shall TradeIQ be liable for any indirect, incidental, special, consequential, or punitive damages.

## Governing Law

This agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which TradeIQ operates, without regard to its conflict of law provisions.

## Severability

If any provision of this agreement is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law.`
  };

  return (
    <>
      <Card className="tradeiq-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Scale className="h-5 w-5 text-tradeiq-blue" />
            <CardTitle className="text-white">Legal</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setOpenModal('terms')}
            className="w-full justify-start border-gray-600 text-white hover:bg-gray-800"
          >
            <FileText className="h-4 w-4 mr-2" />
            Terms and Conditions
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setOpenModal('privacy')}
            className="w-full justify-start border-gray-600 text-white hover:bg-gray-800"
          >
            <Shield className="h-4 w-4 mr-2" />
            Privacy Policy
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setOpenModal('license')}
            className="w-full justify-start border-gray-600 text-white hover:bg-gray-800"
          >
            <Award className="h-4 w-4 mr-2" />
            License Agreement
          </Button>
        </CardContent>
      </Card>

      {/* Terms Modal */}
      <Dialog open={openModal === 'terms'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Terms and Conditions</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please read our terms and conditions carefully.
            </DialogDescription>
          </DialogHeader>
          <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
            {legalContent.terms}
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Modal */}
      <Dialog open={openModal === 'privacy'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Privacy Policy</DialogTitle>
            <DialogDescription className="text-gray-400">
              Learn how we protect and use your data.
            </DialogDescription>
          </DialogHeader>
          <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
            {legalContent.privacy}
          </div>
        </DialogContent>
      </Dialog>

      {/* License Modal */}
      <Dialog open={openModal === 'license'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">License Agreement</DialogTitle>
            <DialogDescription className="text-gray-400">
              Software license terms and conditions.
            </DialogDescription>
          </DialogHeader>
          <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
            {legalContent.license}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
