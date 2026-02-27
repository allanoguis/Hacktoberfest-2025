import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

// Only create Supabase client if environment variables are available
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase environment variables not found. Real-time features will be disabled.');
}

export { supabase };

// Call this after the user signs in (or if already signed in)
export async function subscribeToLeaderboard(onMessage) {
  // Return early if Supabase is not available
  if (!supabase) {
    console.warn('Supabase client not available. Real-time features disabled.');
    return null;
  }

  try {
    // Ensure realtime auth is set (needed for private channels)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      await supabase.realtime.setAuth(session.access_token);
    }

    const channel = supabase.channel('topic:leaderboard', {
      config: { private: true, broadcast: { self: false } }
    });

    // Listen for broadcast events emitted by the trigger (INSERT/UPDATE/DELETE are used as event names)
    channel.on('broadcast', { event: 'INSERT' }, (payload) => {
      onMessage({ type: 'INSERT', payload });
    });
    channel.on('broadcast', { event: 'UPDATE' }, (payload) => {
      onMessage({ type: 'UPDATE', payload });
    });
    channel.on('broadcast', { event: 'DELETE' }, (payload) => {
      onMessage({ type: 'DELETE', payload });
    });

    const { error } = await channel.subscribe();
    if (error) {
      console.error('Failed to subscribe to leaderboard channel:', error);
      return null;
    }

    // Return an unsubscribe function for cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error('Error setting up leaderboard subscription:', error);
    return null;
  }
}
