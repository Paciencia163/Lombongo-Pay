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
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const email = "lombongo@gmail.com";
    const password = "12345678";

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === email);

    if (existing) {
      // Ensure admin role exists
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", existing.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!existingRole) {
        await supabase.from("user_roles").insert({ user_id: existing.id, role: "admin" });
      }

      // Update profile
      await supabase
        .from("profiles")
        .update({ full_name: "Administrador Lombongo" })
        .eq("user_id", existing.id);

      return new Response(JSON.stringify({ message: "Admin already exists, role ensured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Administrador Lombongo" },
    });

    if (createError) throw createError;

    // Assign admin role
    await supabase.from("user_roles").insert({ user_id: newUser.user.id, role: "admin" });

    // Update profile name
    await supabase
      .from("profiles")
      .update({ full_name: "Administrador Lombongo" })
      .eq("user_id", newUser.user.id);

    return new Response(JSON.stringify({ message: "Admin created successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
