// AR Try-On Feature Test Script
// Run this in browser console on http://localhost:3001/ar-tryon

console.log('🧪 Starting AR Try-On Feature Tests...');

// Test 1: Page Load and Basic Elements
function testPageLoad() {
  console.log('\n📄 Testing Page Load...');
  
  const heroTitle = document.querySelector('h1');
  const cameraButton = document.querySelector('button[class*="bg-gradient-gold"]');
  const jewelryTabs = document.querySelectorAll('[role="tab"]');
  const instructions = document.querySelector('h4');
  
  console.log('✓ Hero title:', heroTitle?.textContent?.includes('Virtual Try-On for Jewelry'));
  console.log('✓ Camera button:', !!cameraButton);
  console.log('✓ Jewelry tabs count:', jewelryTabs.length === 3);
  console.log('✓ Instructions visible:', !!instructions);
  
  return {
    heroTitle: !!heroTitle,
    cameraButton: !!cameraButton,
    jewelryTabs: jewelryTabs.length === 3,
    instructions: !!instructions
  };
}

// Test 2: Jewelry Selection
function testJewelrySelection() {
  console.log('\n💍 Testing Jewelry Selection...');
  
  const earringsTab = document.querySelector('[role="tab"][value="earrings"]');
  const ringsTab = document.querySelector('[role="tab"][value="rings"]');
  const necklacesTab = document.querySelector('[role="tab"][value="necklaces"]');
  
  // Test tab switching
  if (earringsTab) earringsTab.click();
  const earringsContent = document.querySelector('[role="tabpanel"][data-state="active"]');
  
  if (ringsTab) ringsTab.click();
  const ringsContent = document.querySelector('[role="tabpanel"][data-state="active"]');
  
  if (necklacesTab) necklacesTab.click();
  const necklacesContent = document.querySelector('[role="tabpanel"][data-state="active"]');
  
  console.log('✓ Earrings tab works:', !!earringsContent);
  console.log('✓ Rings tab works:', !!ringsContent);
  console.log('✓ Necklaces tab works:', !!necklacesContent);
  
  // Test jewelry items
  const jewelryItems = document.querySelectorAll('[class*="cursor-pointer"]');
  console.log('✓ Jewelry items found:', jewelryItems.length);
  
  return {
    earringsTab: !!earringsContent,
    ringsTab: !!ringsContent,
    necklacesTab: !!necklacesContent,
    jewelryItems: jewelryItems.length
  };
}

// Test 3: Camera Integration
async function testCameraIntegration() {
  console.log('\n📷 Testing Camera Integration...');
  
  const cameraButton = document.querySelector('button[class*="bg-gradient-gold"]');
  
  if (!cameraButton) {
    console.log('❌ Camera button not found');
    return { cameraButton: false };
  }
  
  // Check if camera is available
  const hasCamera = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  console.log('✓ Camera API available:', hasCamera);
  
  // Test camera button click
  try {
    cameraButton.click();
    console.log('✓ Camera button clicked');
    
    // Wait a bit for camera to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const stopButton = document.querySelector('button[class*="bg-gradient-gold"]');
    const cameraActive = stopButton?.textContent?.includes('Stop Camera');
    console.log('✓ Camera activated:', cameraActive);
    
    return {
      cameraButton: true,
      cameraAPI: hasCamera,
      cameraActive: cameraActive
    };
  } catch (error) {
    console.log('❌ Camera error:', error.message);
    return { cameraButton: true, cameraAPI: hasCamera, cameraActive: false, error: error.message };
  }
}

// Test 4: AR Filter Components
function testARFilterComponents() {
  console.log('\n🎯 Testing AR Filter Components...');
  
  // Check for canvas elements
  const canvases = document.querySelectorAll('canvas');
  console.log('✓ Canvas elements found:', canvases.length);
  
  // Check for AR overlay elements
  const arOverlay = document.querySelector('[class*="absolute inset-0"]');
  console.log('✓ AR overlay container found:', !!arOverlay);
  
  // Check for manual controls
  const controls = document.querySelectorAll('button[class*="bg-gold"]');
  const hasControls = controls.length >= 4; // +, -, ↻, Auto buttons
  console.log('✓ Manual controls found:', hasControls);
  
  return {
    canvases: canvases.length,
    arOverlay: !!arOverlay,
    controls: hasControls
  };
}

// Test 5: Image Loading
function testImageLoading() {
  console.log('\n🖼️ Testing Image Loading...');
  
  const images = document.querySelectorAll('img');
  let loadedImages = 0;
  let failedImages = 0;
  
  images.forEach((img, index) => {
    if (img.complete && img.naturalHeight !== 0) {
      loadedImages++;
    } else {
      failedImages++;
    }
  });
  
  console.log('✓ Images loaded:', loadedImages);
  console.log('✓ Images failed:', failedImages);
  console.log('✓ Image success rate:', `${Math.round((loadedImages / images.length) * 100)}%`);
  
  return {
    totalImages: images.length,
    loadedImages: loadedImages,
    failedImages: failedImages,
    successRate: Math.round((loadedImages / images.length) * 100)
  };
}

// Test 6: Responsive Design
function testResponsiveDesign() {
  console.log('\n📱 Testing Responsive Design...');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log('✓ Viewport size:', `${viewport.width}x${viewport.height}`);
  
  // Test if elements are visible
  const heroTitle = document.querySelector('h1');
  const cameraButton = document.querySelector('button[class*="bg-gradient-gold"]');
  const jewelryTabs = document.querySelectorAll('[role="tab"]');
  
  const isResponsive = heroTitle && cameraButton && jewelryTabs.length > 0;
  console.log('✓ Responsive layout:', isResponsive);
  
  return {
    viewport: viewport,
    responsive: isResponsive
  };
}

// Test 7: Error Handling
function testErrorHandling() {
  console.log('\n⚠️ Testing Error Handling...');
  
  // Check for error messages
  const errorMessages = document.querySelectorAll('[class*="error"], [class*="Error"]');
  console.log('✓ Error messages found:', errorMessages.length);
  
  // Check for fallback elements
  const fallbackElements = document.querySelectorAll('[class*="fallback"], [class*="Fallback"]');
  console.log('✓ Fallback elements found:', fallbackElements.length);
  
  // Test console errors
  const originalError = console.error;
  let errorCount = 0;
  console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
  };
  
  return {
    errorMessages: errorMessages.length,
    fallbackElements: fallbackElements.length,
    errorCount: errorCount
  };
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running Comprehensive AR Try-On Tests...\n');
  
  const results = {
    pageLoad: testPageLoad(),
    jewelrySelection: testJewelrySelection(),
    cameraIntegration: await testCameraIntegration(),
    arFilterComponents: testARFilterComponents(),
    imageLoading: testImageLoading(),
    responsiveDesign: testResponsiveDesign(),
    errorHandling: testErrorHandling()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const totalTests = Object.keys(results).length;
  let passedTests = 0;
  
  Object.entries(results).forEach(([testName, result]) => {
    const testPassed = typeof result === 'object' ? 
      Object.values(result).every(value => value !== false && value !== 0) : 
      result;
    
    console.log(`${testPassed ? '✅' : '❌'} ${testName}:`, testPassed ? 'PASSED' : 'FAILED');
    if (testPassed) passedTests++;
  });
  
  console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! AR Try-On feature is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the issues above.');
  }
  
  return results;
}

// Auto-run tests
runAllTests().then(results => {
  window.arTestResults = results;
  console.log('\n💾 Test results saved to window.arTestResults');
});

// Export for manual testing
window.testARFeature = {
  runAllTests,
  testPageLoad,
  testJewelrySelection,
  testCameraIntegration,
  testARFilterComponents,
  testImageLoading,
  testResponsiveDesign,
  testErrorHandling
};
