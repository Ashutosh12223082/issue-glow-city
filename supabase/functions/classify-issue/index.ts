import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { title, description, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a civic issue classifier. Given a civic complaint title, description, and category, determine:
1. The priority level (low, medium, high, critical)
2. The appropriate department to handle it
3. A brief AI analysis summary

Priority guidelines:
- critical: immediate danger to life/safety (water main breaks, road collapse, gas leaks)
- high: significant safety risk or widespread impact (large potholes on busy roads, illegal dumping near schools)
- medium: moderate inconvenience or localized issue (garbage overflow, broken streetlights)
- low: minor issues with minimal impact (damaged benches, faded road markings)

Use the tool to return structured output.`
          },
          {
            role: "user",
            content: `Title: ${title}\nDescription: ${description}\nCategory: ${category}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_issue",
              description: "Classify a civic issue with priority, department, and analysis",
              parameters: {
                type: "object",
                properties: {
                  priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
                  department: { type: "string", description: "Department name e.g. Public Works, Sanitation, Water Services" },
                  analysis: { type: "string", description: "Brief AI analysis of the issue (1-2 sentences)" },
                  is_spam: { type: "boolean", description: "Whether the complaint appears to be spam or fake" }
                },
                required: ["priority", "department", "analysis", "is_spam"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "classify_issue" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      // Fallback classification
      return new Response(JSON.stringify({
        priority: "medium",
        department: "General Services",
        analysis: "Unable to classify automatically. Assigned default priority.",
        is_spam: false
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const classification = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(classification), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-issue error:", e);
    return new Response(JSON.stringify({ 
      priority: "medium",
      department: "General Services",
      analysis: "Classification unavailable. Default priority assigned.",
      is_spam: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
