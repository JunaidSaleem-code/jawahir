# AR Try-On Feature Manual Testing Checklist

## Pre-Test Setup
- [ ] Development server is running (`pnpm dev`)
- [ ] Browser has camera permissions enabled
- [ ] Test on both desktop and mobile devices
- [ ] Clear browser cache before testing

## 1. Page Load & Layout Testing

### Basic Page Load
- [ ] Navigate to `/ar-tryon`
- [ ] Page loads without errors
- [ ] Hero section displays "Virtual Try-On for Jewelry"
- [ ] Instructions are visible and clear
- [ ] All three jewelry category tabs are present (Earrings, Rings, Necklaces)

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Layout adapts properly on all screen sizes
- [ ] Text remains readable on all devices

## 2. Jewelry Selection Testing

### Category Navigation
- [ ] Click on "Earrings" tab
  - [ ] Trinity Diamond Earrings visible (PKR 85,000)
  - [ ] Juste un Clou Earrings visible (PKR 65,000)
  - [ ] Love Hoop Earrings visible (PKR 45,000)
  - [ ] Panthere Pearl Earrings visible (PKR 120,000)

- [ ] Click on "Rings" tab
  - [ ] Trinity Ring visible (PKR 95,000)
  - [ ] Love Ring visible (PKR 75,000)
  - [ ] Juste un Clou Ring visible (PKR 55,000)
  - [ ] Panthere Ring visible (PKR 180,000)

- [ ] Click on "Necklaces" tab
  - [ ] Trinity Necklace visible (PKR 125,000)
  - [ ] Love Pendant visible (PKR 85,000)
  - [ ] Juste un Clou Necklace visible (PKR 95,000)
  - [ ] Panthere Choker visible (PKR 250,000)

### Jewelry Selection
- [ ] Click on any jewelry item
- [ ] Item shows "Selected" status
- [ ] Only one item can be selected at a time
- [ ] Switching categories deselects previous item
- [ ] Images load properly (no broken image icons)

## 3. Camera Integration Testing

### Camera Activation
- [ ] Click "Enable Camera" button
- [ ] Browser requests camera permission
- [ ] Grant camera permission
- [ ] Camera feed appears in the main area
- [ ] Button changes to "Stop Camera"
- [ ] Camera feed is mirrored (selfie-style)

### Camera Controls
- [ ] Camera feed is responsive to movement
- [ ] Video quality is acceptable
- [ ] No significant lag or stuttering
- [ ] Camera can be stopped and restarted

## 4. AR Filter Testing

### Face Detection (Earrings & Necklaces)
- [ ] Select an earring item
- [ ] Point camera at your face
- [ ] Jewelry should appear on your earlobes
- [ ] Jewelry follows face movement
- [ ] Select a necklace item
- [ ] Jewelry should appear on your neck/chest area
- [ ] Jewelry follows head movement

### Hand Detection (Rings)
- [ ] Select a ring item
- [ ] Show your hands to the camera
- [ ] Ring should appear on your finger
- [ ] Ring follows hand movement
- [ ] Works with both left and right hands

### Manual Controls
- [ ] "+" button increases jewelry size
- [ ] "-" button decreases jewelry size
- [ ] "↻" button rotates jewelry
- [ ] "Auto" button resets to automatic positioning
- [ ] All controls work smoothly

## 5. Visual Quality Testing

### Background Removal
- [ ] Jewelry appears without background
- [ ] No white/light background visible
- [ ] Jewelry blends naturally with face/hands
- [ ] Transparency is handled correctly

### Positioning Accuracy
- [ ] Earrings positioned on earlobes
- [ ] Necklaces positioned on neck/chest
- [ ] Rings positioned on fingers
- [ ] Positioning is consistent and stable

### Visual Feedback
- [ ] Debug overlay shows "✓ AR Filter Active"
- [ ] Position coordinates are displayed
- [ ] Scale value is shown
- [ ] Category is correctly identified

## 6. Error Handling Testing

### Image Loading Errors
- [ ] Test with slow internet connection
- [ ] Images should show fallback icons if they fail to load
- [ ] No broken image placeholders
- [ ] Application doesn't crash on image errors

### Camera Permission Denial
- [ ] Deny camera permission when prompted
- [ ] Application handles gracefully
- [ ] Appropriate error message shown
- [ ] Can retry camera activation

### Missing Landmarks
- [ ] Test with poor lighting
- [ ] Test with face partially obscured
- [ ] Test with hands not visible
- [ ] Application should handle gracefully

## 7. Performance Testing

### Smooth Operation
- [ ] No significant lag during jewelry positioning
- [ ] Smooth transitions when switching jewelry
- [ ] Responsive manual controls
- [ ] No memory leaks during extended use

### Resource Usage
- [ ] CPU usage remains reasonable
- [ ] Memory usage doesn't continuously increase
- [ ] Browser doesn't become unresponsive

## 8. WhatsApp Integration Testing

### Share Functionality
- [ ] Select a jewelry item
- [ ] Click share button
- [ ] WhatsApp opens with pre-filled message
- [ ] Message includes jewelry name and price
- [ ] Correct phone number is used

### Message Content
- [ ] Message format: "I want this product: [Jewelry Name] - PKR [Price]"
- [ ] Price is formatted correctly with commas
- [ ] Jewelry name is accurate

## 9. Cross-Browser Testing

### Chrome
- [ ] All features work correctly
- [ ] Camera integration works
- [ ] AR positioning is accurate

### Firefox
- [ ] All features work correctly
- [ ] Camera integration works
- [ ] AR positioning is accurate

### Safari (if available)
- [ ] All features work correctly
- [ ] Camera integration works
- [ ] AR positioning is accurate

### Edge
- [ ] All features work correctly
- [ ] Camera integration works
- [ ] AR positioning is accurate

## 10. Mobile Testing

### Touch Controls
- [ ] Manual controls work with touch
- [ ] Dragging jewelry works on touch devices
- [ ] Buttons are appropriately sized for touch
- [ ] No accidental activations

### Mobile Camera
- [ ] Camera activates properly on mobile
- [ ] AR positioning works on mobile
- [ ] Performance is acceptable on mobile

## 11. Edge Cases

### Rapid Category Switching
- [ ] Switch between categories quickly
- [ ] No errors or crashes
- [ ] Jewelry selection updates correctly

### Multiple Jewelry Selection
- [ ] Try to select multiple items
- [ ] Only one item should be selected at a time
- [ ] Previous selection should be deselected

### Camera Start/Stop Cycles
- [ ] Start and stop camera multiple times
- [ ] No memory leaks or errors
- [ ] AR positioning continues to work

## 12. Accessibility Testing

### Keyboard Navigation
- [ ] All buttons can be accessed with keyboard
- [ ] Tab order is logical
- [ ] Focus indicators are visible

### Screen Reader Compatibility
- [ ] Alt text is provided for images
- [ ] Button labels are descriptive
- [ ] Status information is announced

## Test Results Summary

### Passed Tests: ___/___
### Failed Tests: ___/___
### Issues Found:
1. 
2. 
3. 

### Recommendations:
1. 
2. 
3. 

### Overall Assessment:
- [ ] Feature is ready for production
- [ ] Minor issues need fixing
- [ ] Major issues need fixing
- [ ] Feature needs complete overhaul

## Notes:
- Test performed on: [Date]
- Browser: [Browser and version]
- Device: [Device type and model]
- Tester: [Name]
