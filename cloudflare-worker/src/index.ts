const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const apiKey = "AIzaSyCceULl39Mo_Z9apfNugIALFfJXDqeldF0";
    
    // Handle OPTIONS request for CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
          ...corsHeaders
        },
      });
    }
    
    // Handle HEAD request
    if (request.method === "HEAD") {
      return new Response(null, {
        status: 200,
        headers: { "Content-Type": "application/json" ,          ...corsHeaders},
      });
    }
    
    // Ensure request is a POST to forward it correctly
    if (request.method !== "POST") {
      return new Response("Only POST, OPTIONS, and HEAD requests are allowed", { status: 405 });
    }
    
    const apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";
    
    // Forward the request body
    const body = await request.text();
    
    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      
      const responseData = await response.json();
      return new Response(JSON.stringify(responseData), {
        headers: { "Content-Type": "application/json" , ...corsHeaders},
      });
    } catch (error) {
      return new Response(`Error fetching Gemini API: ${error.message}`, { status: 500 });
    }
  },
};
