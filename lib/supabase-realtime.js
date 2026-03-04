import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

// Validate environment variables before creating client
function validateSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return false;
  }
  
  // Validate URL format
  try {
    new URL(SUPABASE_URL);
  } catch (urlError) {
    console.error('⚠️ [Supabase] Invalid URL format:', SUPABASE_URL);
    return false;
  }
  
  // Validate key format (basic check)
  if (typeof SUPABASE_ANON_KEY !== 'string' || SUPABASE_ANON_KEY.length < 10) {
    console.error('⚠️ [Supabase] Invalid anon key format');
    return false;
  }
  
  return true;
}

// Only create Supabase client if environment variables are valid
if (validateSupabaseConfig()) {
  console.log('🔑 [Supabase] Environment variables validated, creating client...');
  console.log('🔗 [Supabase] URL:', SUPABASE_URL);
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ [Supabase] Client created successfully');
} else {
  console.warn('⚠️ [Supabase] Environment variables not found or invalid. Real-time features will be disabled.');
  console.warn('🔑 [Supabase] NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? 'found' : 'missing');
  console.warn('🔑 [Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'found' : 'missing');
}

export { supabase };

// Create leaderboard subscription with proper cleanup
function createLeaderboardSubscription(onMessage) {
  console.log('[leaderboard] Creating subscription to leaderboard:global');
  
  const channel = supabase.channel('leaderboard:global', {
    config: { 
      broadcast: { ack: true },
    },
  });

  channel.on('broadcast', { event: 'highscore_update' }, (payload) => {
    try {
      console.log('[leaderboard] 🎉 highscore_update received:', payload);
      onMessage(payload);
    } catch (e) {
      console.error('[leaderboard] handler error', e);
    }
  });

  // Remove catch-all listener for performance - only listen to specific events we need
  // channel.on('broadcast', { event: '*' }, (payload) => {
  //   console.log('[leaderboard] 📡 broadcast (all):', payload);
  // });

  channel.subscribe((status, err) => {
    console.log(`[leaderboard] 📊 subscription status: ${status}`);
    if (status === 'SUBSCRIBED') {
      console.info('[leaderboard] ✅ subscribed successfully');
      return;
    }
    console.warn('[leaderboard] ⚠️ subscription status', status);
    if (err) console.error('[leaderboard] ❌ subscription error', err);
  });

  return channel;
}

// Safe re-subscribe with exponential backoff
async function safeSubscribe(onMessage, maxRetries = 5) {
  let attempt = 0;
  let channel = null;

  while (attempt < maxRetries) {
    try {
      channel = createLeaderboardSubscription(onMessage);
      console.log(`[leaderboard] subscription attempt ${attempt + 1} successful`);
      return channel;
    } catch (err) {
      attempt++;
      const backoff = Math.min(1000 * 2 ** attempt, 30000);
      console.warn(`[leaderboard] subscribe attempt ${attempt} failed, retrying in ${backoff}ms`, err);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  throw new Error('[leaderboard] failed to subscribe after retries');
}

// Updated subscribeToLeaderboard function with proper cleanup
export async function subscribeToLeaderboard(onMessage) {
  // Return early if Supabase is not available
  if (!supabase) {
    console.warn('[leaderboard] Supabase client not available. Real-time features disabled.');
    return null;
  }

  let channel = null;

  try {
    // Create subscription with retry logic
    channel = await safeSubscribe(onMessage);
    
    // Return cleanup function
    return () => {
      if (channel) {
        console.log('[leaderboard] removing channel');
        supabase.removeChannel(channel);
        channel = null;
      }
    };

  } catch (error) {
    console.error('[leaderboard] subscribeLeaderboard failed', error);
    return null;
  }
}

// Auto-cleanup utility for page unload (call this once per app)
export function setupAutoCleanup() {
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      console.log('[leaderboard] page unloading, cleaning up channels');
      // Supabase automatically handles cleanup on page unload,
      // but we can add any additional cleanup here if needed
    });
  }
}
