#!/bin/bash

echo "🍔 Running Critical Mobile Menu Tests..."

# Test specific viewports that were failing
npx playwright test tests/mobile-menu-critical.spec.ts \
  --project=Mobile-Chrome-iPhone-SE \
  --reporter=html \
  --headed=false

echo "📊 Test results:"
npx playwright show-report --host=localhost --port=9323 &

echo "✅ Mobile menu validation complete!"
echo "📁 Screenshots saved to: test-results/"
echo "🌐 View results at: http://localhost:9323"