import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceKey);

    const email = "superadmin@test.com";
    const password = "Admin@123";

    // Check if super admin already exists
    const { data: existingRoles } = await adminClient
      .from("user_roles")
      .select("user_id")
      .eq("role", "super_admin");

    if (existingRoles && existingRoles.length > 0) {
      return new Response(
        JSON.stringify({ message: "Super Admin already exists", email }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the user
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: "Super Admin" },
    });

    if (createError) throw createError;

    // Assign super_admin role
    await adminClient.from("user_roles").insert({
      user_id: newUser.user.id,
      role: "super_admin",
    });

    // Create profile
    await adminClient.from("profiles").upsert({
      user_id: newUser.user.id,
      display_name: "Super Admin",
    }, { onConflict: "user_id" });

    return new Response(
      JSON.stringify({ success: true, message: "Super Admin created!", email, password }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
