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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is super_admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    const adminClient = createClient(supabaseUrl, serviceKey);

    // Check caller role
    const { data: callerRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!callerRole || callerRole.role !== "super_admin") {
      throw new Error("Only super admins can manage admins");
    }

    const body = await req.json();
    const { action } = body;

    if (action === "list") {
      // Get all admins with their roles and locations
      const { data: roles } = await adminClient.from("user_roles").select("user_id, role");
      if (!roles || roles.length === 0) {
        return new Response(JSON.stringify({ admins: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const admins = [];
      for (const role of roles) {
        const { data: { user: adminUser } } = await adminClient.auth.admin.getUserById(role.user_id);
        
        const { data: locData } = await adminClient
          .from("admin_locations")
          .select("location_id, locations(name)")
          .eq("user_id", role.user_id)
          .single();

        const { data: profile } = await adminClient
          .from("profiles")
          .select("display_name")
          .eq("user_id", role.user_id)
          .single();

        admins.push({
          user_id: role.user_id,
          email: adminUser?.email ?? "unknown",
          role: role.role,
          location_name: (locData as any)?.locations?.name ?? null,
          display_name: profile?.display_name ?? null,
        });
      }

      return new Response(JSON.stringify({ admins }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create") {
      const { email, password, role, locationName, displayName } = body;
      if (!email || !password) throw new Error("Email and password required");

      // Create user
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: displayName },
      });
      if (createError) throw createError;

      // Assign role
      await adminClient.from("user_roles").insert({ user_id: newUser.user.id, role });

      // Assign location if location_admin
      if (role === "location_admin" && locationName) {
        const { data: loc } = await adminClient.from("locations").select("id").eq("name", locationName).single();
        if (loc) {
          await adminClient.from("admin_locations").insert({ user_id: newUser.user.id, location_id: loc.id });
        }
      }

      // Create profile
      await adminClient.from("profiles").insert({
        user_id: newUser.user.id,
        display_name: displayName || email,
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      const { userId, role, locationName, displayName, password } = body;

      // Update role
      await adminClient.from("user_roles").update({ role }).eq("user_id", userId);

      // Update location
      await adminClient.from("admin_locations").delete().eq("user_id", userId);
      if (role === "location_admin" && locationName) {
        const { data: loc } = await adminClient.from("locations").select("id").eq("name", locationName).single();
        if (loc) {
          await adminClient.from("admin_locations").insert({ user_id: userId, location_id: loc.id });
        }
      }

      // Update profile
      if (displayName !== undefined) {
        await adminClient.from("profiles").update({ display_name: displayName }).eq("user_id", userId);
      }

      // Update password if provided
      if (password) {
        await adminClient.auth.admin.updateUserById(userId, { password });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const { userId } = body;
      // Remove role and location (cascade will handle), then delete user
      await adminClient.from("user_roles").delete().eq("user_id", userId);
      await adminClient.from("admin_locations").delete().eq("user_id", userId);
      // Don't delete the auth user, just remove admin privileges

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
