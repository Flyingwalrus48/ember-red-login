import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OFAICertification {
  certification_name: string
  ofai_stage: string | null
  status: string
}

const ofaiCertifications: OFAICertification[] = [
  // Stage One
  {
    certification_name: "Firefighter Aptitude and Character Test™ (FACT™)",
    ofai_stage: "Stage One",
    status: "Not Started"
  },
  
  // Stage Two
  {
    certification_name: "Vision Assessment",
    ofai_stage: "Stage Two", 
    status: "Not Started"
  },
  {
    certification_name: "Hearing Assessment",
    ofai_stage: "Stage Two",
    status: "Not Started"
  },
  {
    certification_name: "Encapsulated Treadmill Test",
    ofai_stage: "Stage Two",
    status: "Not Started"
  },
  
  // Stage Three
  {
    certification_name: "Firefighter Physical Aptitude Job-Related Tests (FPAT)",
    ofai_stage: "Stage Three",
    status: "Not Started"
  },
  {
    certification_name: "Firefighter Technical Skills Assessment (FFTS)",
    ofai_stage: "Stage Three",
    status: "Not Started"
  },
  
  // Other (no stage)
  {
    certification_name: "Swim Test",
    ofai_stage: null,
    status: "Not Started"
  }
]

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prepare certification records for the new user
    const certificationRecords = ofaiCertifications.map(cert => ({
      user_id: user_id,
      certification_name: cert.certification_name,
      ofai_stage: cert.ofai_stage,
      status: cert.status
    }))

    // Insert all certifications for the new user
    const { data, error } = await supabaseClient
      .from('ofai_certifications')
      .insert(certificationRecords)

    if (error) {
      console.error('Error inserting OFAI certifications:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create OFAI certifications' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'OFAI certifications created successfully',
        count: certificationRecords.length,
        data: data 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in populate-ofai-certifications function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})