import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, score, metadata } = await req.json()

    // Validate required fields
    if (!user_id || score === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, score' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Broadcast to leaderboard:global channel
    const channel = supabase.channel('leaderboard:global', {
      config: {
        broadcast: { ack: true },
      },
    })

    // Send broadcast
    const broadcastPayload = {
      user_id,
      score,
      metadata: {
        ...metadata,
        created_at: metadata?.created_at || new Date().toISOString()
      }
    }

    const result = await channel.send({
      type: 'broadcast',
      event: 'highscore_update',
      payload: broadcastPayload
    })

    console.log('[Edge Function] Broadcast sent successfully:', result)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Broadcast sent successfully',
        payload: broadcastPayload,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('[Edge Function] Error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
