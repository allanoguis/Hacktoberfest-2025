// Test script for real-time cleanup
// Run this in browser console to test subscription lifecycle

async function testRealtimeCleanup() {
  console.log('🧪 Testing real-time subscription cleanup...');
  
  // Import the subscribeToLeaderboard function (if available in global scope)
  // or copy the implementation here for testing
  
  let unsubscribe1 = null;
  let unsubscribe2 = null;
  
  try {
    // Test 1: Create first subscription
    console.log('📡 Creating first subscription...');
    unsubscribe1 = await subscribeToLeaderboard((payload) => {
      console.log('📨 Subscription 1 received:', payload);
    });
    
    if (unsubscribe1) {
      console.log('✅ First subscription created successfully');
    }
    
    // Wait a bit
    await new Promise(r => setTimeout(r, 1000));
    
    // Test 2: Create second subscription
    console.log('📡 Creating second subscription...');
    unsubscribe2 = await subscribeToLeaderboard((payload) => {
      console.log('📨 Subscription 2 received:', payload);
    });
    
    if (unsubscribe2) {
      console.log('✅ Second subscription created successfully');
    }
    
    // Wait a bit
    await new Promise(r => setTimeout(r, 1000));
    
    // Test 3: Cleanup first subscription
    console.log('🧹 Cleaning up first subscription...');
    if (unsubscribe1) {
      unsubscribe1();
      unsubscribe1 = null;
      console.log('✅ First subscription cleaned up');
    }
    
    // Wait a bit
    await new Promise(r => setTimeout(r, 1000));
    
    // Test 4: Cleanup second subscription
    console.log('🧹 Cleaning up second subscription...');
    if (unsubscribe2) {
      unsubscribe2();
      unsubscribe2 = null;
      console.log('✅ Second subscription cleaned up');
    }
    
    console.log('🎉 All cleanup tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    // Ensure cleanup even on error
    if (unsubscribe1) unsubscribe1();
    if (unsubscribe2) unsubscribe2();
  }
}

// Test subscription limits
async function testSubscriptionLimits() {
  console.log('🧪 Testing subscription limits...');
  
  const subscriptions = [];
  
  try {
    // Create multiple subscriptions to test limits
    for (let i = 0; i < 10; i++) {
      console.log(`📡 Creating subscription ${i + 1}...`);
      const unsubscribe = await subscribeToLeaderboard((payload) => {
        console.log(`📨 Subscription ${i + 1} received:`, payload);
      });
      
      if (unsubscribe) {
        subscriptions.push(unsubscribe);
        console.log(`✅ Subscription ${i + 1} created`);
      } else {
        console.warn(`⚠️ Failed to create subscription ${i + 1}`);
        break;
      }
      
      // Small delay between subscriptions
      await new Promise(r => setTimeout(r, 100));
    }
    
    console.log(`📊 Created ${subscriptions.length} subscriptions`);
    
    // Cleanup all subscriptions
    console.log('🧹 Cleaning up all subscriptions...');
    subscriptions.forEach((unsubscribe, index) => {
      unsubscribe();
      console.log(`✅ Subscription ${index + 1} cleaned up`);
    });
    
    console.log('🎉 Subscription limits test completed!');
    
  } catch (error) {
    console.error('❌ Subscription limits test failed:', error);
    
    // Ensure cleanup even on error
    subscriptions.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    });
  }
}

// Export for use in browser console
window.testRealtimeCleanup = testRealtimeCleanup;
window.testSubscriptionLimits = testSubscriptionLimits;

console.log('🧪 Real-time cleanup tests loaded!');
console.log('Run testRealtimeCleanup() or testSubscriptionLimits() in console');
