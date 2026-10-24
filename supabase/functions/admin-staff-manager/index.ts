// ====================================================================
// Supabase Edge Function: admin-staff-manager
// Secure administrative staff creation and role updates
// ====================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: callerUser }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !callerUser) {
      return new Response(JSON.stringify({ error: "Unauthorized caller" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller has ADMIN role in database
    const { data: callerRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .eq("role", "ADMIN")
      .single();

    if (!callerRole) {
      return new Response(JSON.stringify({ error: "Forbidden: Caller is not a platform administrator" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, email, role, displayName, userId, isActive } = await req.json();

    // ACTION: INVITE_OR_CREATE_STAFF
    if (action === "INVITE_OR_CREATE_STAFF") {
      if (!email || !role || !displayName) {
        return new Response(JSON.stringify({ error: "email, role, and displayName are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      let targetUserId = existingUser?.id;

      if (!targetUserId) {
        // Invite new user via Supabase Auth Admin
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          data: { full_name: displayName, role },
        });

        if (inviteError) throw inviteError;
        targetUserId = inviteData.user.id;

        // Create profile
        await supabaseAdmin.from("profiles").upsert({
          id: targetUserId,
          full_name: displayName,
          email,
          profile_completion: 80,
        });
      }

      // Assign role in user_roles
      await supabaseAdmin.from("user_roles").upsert(
        {
          user_id: targetUserId,
          role,
          assigned_by: callerUser.id,
        },
        { onConflict: "user_id,role" }
      );

      // Create staff_accounts row
      await supabaseAdmin.from("staff_accounts").upsert(
        {
          user_id: targetUserId,
          display_name: displayName,
          role,
          is_active: true,
        },
        { onConflict: "user_id" }
      );

      // Audit log
      await supabaseAdmin.from("audit_logs").insert({
        actor_user_id: callerUser.id,
        action: "INVITE_STAFF_MEMBER",
        entity_type: "staff_accounts",
        entity_id: targetUserId,
        safe_metadata: { email, role, displayName },
      });

      return new Response(
        JSON.stringify({ success: true, message: `Staff member ${displayName} invited with role ${role}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION: TOGGLE_ACTIVE_STATUS
    if (action === "TOGGLE_ACTIVE_STATUS") {
      if (!userId || typeof isActive !== "boolean") {
        return new Response(JSON.stringify({ error: "userId and isActive boolean are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent accidental self-deactivation
      if (userId === callerUser.id && !isActive) {
        return new Response(JSON.stringify({ error: "Security Guard: Administrators cannot deactivate their own account" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabaseAdmin
        .from("staff_accounts")
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq("user_id", userId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, message: `Staff account status updated to ${isActive ? "active" : "inactive"}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
