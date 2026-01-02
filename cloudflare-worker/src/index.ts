const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
	const apiUrl = "https://ai.hackclub.com/proxy/v1/chat/completions";
    const apiKey = env.HACK_CLUB_AI_API_KEY;
    
    // Handle OPTIONS request for CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
        //   "Access-Control-Allow-Origin": "*",
        //   "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
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
    // {"model": "qwen/qwen3-32b", "messages": [{"role": "user", "content": "Hi"}]}
    
    // Forward the request body
    const body = await request.text();
    
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
		  "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: body,
      });
	  const responseData = await response.text();
	  if (!response.ok) 
		throw new Error(`Error (status ${response.status}): ${responseData}`);
      
      return new Response(responseData, {
        headers: { "Content-Type": "application/json" , ...corsHeaders},
      });
    } catch (error) {
	  const msg = error instanceof Error ? error.message : `${error}`;
	  console.error("Gemini API error:", msg);
      return new Response(`Error fetching Gemini API: ${msg}`, { status: 500 });
    }
  },
};
