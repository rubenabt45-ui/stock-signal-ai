import React from 'react';

// Mobile Menu Test Component for Manual Validation
const MobileMenuTester: React.FC = () => {
  const [testResults, setTestResults] = React.useState({
    buttonVisible: false,
    menuOpens: false,
    menuCloses: false,
    navigationWorks: false,
    touchTargetsOk: false,
  });

  React.useEffect(() => {
    // Auto-run validation tests
    const runTests = async () => {
      const results = { ...testResults };
      
      // Test 1: Check if hamburger button is visible
      const menuButton = document.querySelector('[aria-label*="navigation menu"]');
      results.buttonVisible = !!menuButton && window.getComputedStyle(menuButton).display !== 'none';
      
      // Test 2: Check if menu can open
      if (menuButton) {
        (menuButton as HTMLElement).click();
        setTimeout(() => {
          const menu = document.querySelector('#mobile-nav-menu');
          results.menuOpens = !!menu && window.getComputedStyle(menu).display !== 'none';
          
          // Test 3: Check if menu can close
          if (menu) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            setTimeout(() => {
              results.menuCloses = window.getComputedStyle(menu).display === 'none';
              setTestResults(results);
            }, 500);
          }
        }, 500);
      }
      
      // Test 4: Touch target sizes
      const buttons = document.querySelectorAll('button, a, [role="button"]');
      let touchTargetsOk = true;
      
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          touchTargetsOk = false;
        }
      });
      
      results.touchTargetsOk = touchTargetsOk;
      setTestResults(results);
    };

    // Run tests after component mounts
    setTimeout(runTests, 1000);
  }, []);

  const getTestIcon = (passed: boolean) => passed ? '✅' : '❌';
  const getTestColor = (passed: boolean) => passed ? 'text-green-600' : 'text-red-600';

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-[200] font-mono text-sm">
      <h3 className="font-bold mb-3 text-gray-800">Mobile Menu Tests</h3>
      
      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${getTestColor(testResults.buttonVisible)}`}>
          <span>{getTestIcon(testResults.buttonVisible)}</span>
          <span>Hamburger Button Visible</span>
        </div>
        
        <div className={`flex items-center gap-2 ${getTestColor(testResults.menuOpens)}`}>
          <span>{getTestIcon(testResults.menuOpens)}</span>
          <span>Menu Opens Correctly</span>
        </div>
        
        <div className={`flex items-center gap-2 ${getTestColor(testResults.menuCloses)}`}>
          <span>{getTestIcon(testResults.menuCloses)}</span>
          <span>Menu Closes with Escape</span>
        </div>
        
        <div className={`flex items-center gap-2 ${getTestColor(testResults.touchTargetsOk)}`}>
          <span>{getTestIcon(testResults.touchTargetsOk)}</span>
          <span>Touch Targets ≥ 44px</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          Viewport: {window.innerWidth}×{window.innerHeight}
        </div>
        <div className="text-xs text-gray-600">
          User Agent: {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}
        </div>
      </div>
      
      <button 
        onClick={() => window.location.reload()}
        className="mt-3 w-full bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
      >
        Re-run Tests
      </button>
    </div>
  );
};

export default MobileMenuTester;