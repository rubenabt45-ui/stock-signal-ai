
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
    terms: `
# Terms and Conditions

Last updated: ${new Date().toLocaleDateString()}

## 1. Acceptance of Terms
By accessing and using TradeIQ, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Use License
Permission is granted to temporarily download one copy of TradeIQ's materials for personal, non-commercial transitory viewing only.

## 3. Disclaimer
The materials on TradeIQ are provided on an 'as is' basis. TradeIQ makes no warranties, expressed or implied.

## 4. Limitations
In no event shall TradeIQ be liable for any damages arising out of the use or inability to use the materials on TradeIQ.

## 5. Trading Risks
Trading in financial markets involves substantial risk of loss and is not suitable for all investors.

## 6. Data Usage
We collect and use data as described in our Privacy Policy to provide and improve our services.

## 7. Modifications
TradeIQ may revise these terms of service at any time without notice.
    `,
    privacy: `
# Privacy Policy

Last updated: ${new Date().toLocaleDateString()}

## Information We Collect
- Account information (email, name)
- Usage data and analytics
- Trading preferences and settings

## How We Use Information
- To provide and maintain our services
- To notify you about changes to our service
- To provide customer support

## Data Security
We implement appropriate security measures to protect your personal information.

## Third Party Services
Our service may contain links to third party services that are not operated by us.

## Data Retention
We retain your personal data only for as long as necessary for the purposes set out in this policy.

## Your Rights
You have the right to access, update, or delete your personal information.

## Contact Us
If you have any questions about this Privacy Policy, please contact us at support@tradeiq.ai
    `,
    license: `
# License Agreement

Last updated: ${new Date().toLocaleDateString()}

## Software License
TradeIQ grants you a revocable, non-exclusive, non-transferable, limited license to use the software.

## Restrictions
You may not:
- Copy, modify, or distribute the software
- Reverse engineer or attempt to extract source code
- Remove any proprietary notices

## Intellectual Property
All content, features, and functionality are owned by TradeIQ and protected by copyright laws.

## Termination
This license is effective until terminated by either party.

## Limitation of Liability
TradeIQ's liability shall not exceed the amount paid by you for the software.

## Governing Law
This agreement shall be governed by and construed in accordance with applicable laws.
    `
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
