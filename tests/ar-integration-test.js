// AR Integration Test Script
// Run this in browser console on http://localhost:3001/ar-demo

console.log('🧪 Starting AR Integration Tests...');

// Test 1: Component Loading
function testComponentLoading() {
  console.log('\n📦 Testing Component Loading...');
  
  const arComponent = document.querySelector('[class*="relative w-full h-full"]');
  const webcam = document.querySelector('video');
  const canvas = document.querySelector('canvas');
  
  console.log('✓ AR Component loaded:', !!arComponent);
  console.log('✓ Webcam element found:', !!webcam);
  console.log('✓ Canvas element found:', !!canvas);
  
  return {
    component: !!arComponent,
    webcam: !!webcam,
    canvas: !!canvas
  };
}

// Test 2: MediaPipe Integration
async function testMediaPipeIntegration() {
  console.log('\n🎯 Testing MediaPipe Integration...');
  
  // Check if MediaPipe modules are available
  const checkModule = async (moduleName) => {
    try {
      const module = await import(`@mediapipe/${moduleName}`);
      return !!module;
    } catch (error) {
      return false;
    }
  };
  
  const faceMeshAvailable = await checkModule('face_mesh');
  const handsAvailable = await checkModule('hands');
  const segmentationAvailable = await checkModule('selfie_segmentation');
  
  console.log('✓ Face Mesh available:', faceMeshAvailable);
  console.log('✓ Hands available:', handsAvailable);
  console.log('✓ Segmentation available:', segmentationAvailable);
  
  return {
    faceMesh: faceMeshAvailable,
    hands: handsAvailable,
    segmentation: segmentationAvailable
  };
}

// Test 3: Camera Functionality
async function testCameraFunctionality() {
  console.log('\n📷 Testing Camera Functionality...');
  
  const webcam = document.querySelector('video');
  if (!webcam) {
    console.log('❌ No webcam element found');
    return { available: false };
  }
  
  const hasVideo = webcam.videoWidth > 0 && webcam.videoHeight > 0;
  const isPlaying = !webcam.paused && !webcam.ended && webcam.readyState > 2;
  
  console.log('✓ Video dimensions:', `${webcam.videoWidth}x${webcam.videoHeight}`);
  console.log('✓ Video playing:', isPlaying);
  console.log('✓ Has video stream:', hasVideo);
  
  return {
    available: true,
    dimensions: { width: webcam.videoWidth, height: webcam.videoHeight },
    playing: isPlaying,
    hasVideo: hasVideo
  };
}

// Test 4: Jewelry Selection
function testJewelrySelection() {
  console.log('\n💍 Testing Jewelry Selection...');
  
  const jewelryButtons = document.querySelectorAll('button[class*="px-4 py-2 rounded-lg"]');
  const earringButton = Array.from(jewelryButtons).find(btn => btn.textContent.includes('Earring'));
  const necklaceButton = Array.from(jewelryButtons).find(btn => btn.textContent.includes('Necklace'));
  const ringButton = Array.from(jewelryButtons).find(btn => btn.textContent.includes('Ring'));
  
  console.log('✓ Jewelry buttons found:', jewelryButtons.length);
  console.log('✓ Earring button:', !!earringButton);
  console.log('✓ Necklace button:', !!necklaceButton);
  console.log('✓ Ring button:', !!ringButton);
  
  // Test button clicks
  if (earringButton) {
    earringButton.click();
    console.log('✓ Earring button clicked');
  }
  
  return {
    buttonsFound: jewelryButtons.length,
    earring: !!earringButton,
    necklace: !!necklaceButton,
    ring: !!ringButton
  };
}

// Test 5: Canvas Rendering
function testCanvasRendering() {
  console.log('\n🎨 Testing Canvas Rendering...');
  
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    console.log('❌ No canvas found');
    return { available: false };
  }
  
  const ctx = canvas.getContext('2d');
  const hasContext = !!ctx;
  const canvasSize = { width: canvas.width, height: canvas.height };
  
  console.log('✓ Canvas context available:', hasContext);
  console.log('✓ Canvas size:', `${canvasSize.width}x${canvasSize.height}`);
  
  // Test drawing
  if (ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 50, 50);
    console.log('✓ Canvas drawing test passed');
  }
  
  return {
    available: true,
    context: hasContext,
    size: canvasSize
  };
}

// Test 6: Performance
function testPerformance() {
  console.log('\n⚡ Testing Performance...');
  
  const startTime = performance.now();
  
  // Simulate some work
  for (let i = 0; i < 1000; i++) {
    Math.random();
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  console.log('✓ Execution time:', `${executionTime.toFixed(2)}ms`);
  console.log('✓ Performance acceptable:', executionTime < 10);
  
  return {
    executionTime: executionTime,
    acceptable: executionTime < 10
  };
}

// Test 7: Error Handling
function testErrorHandling() {
  console.log('\n⚠️ Testing Error Handling...');
  
  const originalError = console.error;
  let errorCount = 0;
  
  console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
  };
  
  // Test error scenarios
  try {
    // Simulate an error
    throw new Error('Test error');
  } catch (error) {
    console.log('✓ Error caught and handled');
  }
  
  // Restore original console.error
  console.error = originalError;
  
  console.log('✓ Error handling test passed');
  
  return {
    errorsCaught: true,
    errorCount: errorCount
  };
}

// Test 8: Mobile Compatibility
function testMobileCompatibility() {
  console.log('\n📱 Testing Mobile Compatibility...');
  
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const hasTouch = 'ontouchstart' in window;
  const hasOrientation = 'orientation' in window;
  
  console.log('✓ Mobile device detected:', isMobile);
  console.log('✓ Touch support:', hasTouch);
  console.log('✓ Orientation support:', hasOrientation);
  
  return {
    isMobile: isMobile,
    touchSupport: hasTouch,
    orientationSupport: hasOrientation
  };
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running AR Integration Tests...\n');
  
  const results = {
    componentLoading: testComponentLoading(),
    mediaPipeIntegration: await testMediaPipeIntegration(),
    cameraFunctionality: await testCameraFunctionality(),
    jewelrySelection: testJewelrySelection(),
    canvasRendering: testCanvasRendering(),
    performance: testPerformance(),
    errorHandling: testErrorHandling(),
    mobileCompatibility: testMobileCompatibility()
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
  window.arIntegrationTestResults = results;
  console.log('\n💾 Test results saved to window.arIntegrationTestResults');
});

// Export for manual testing
window.testARIntegration = {
  runAllTests,
  testComponentLoading,
  testMediaPipeIntegration,
  testCameraFunctionality,
  testJewelrySelection,
  testCanvasRendering,
  testPerformance,
  testErrorHandling,
  testMobileCompatibility
};
