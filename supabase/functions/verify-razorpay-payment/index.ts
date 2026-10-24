// ====================================================================
// Supabase Edge Function: verify-razorpay-payment
// Cryptographic HMAC SHA256 Signature Verification & Access Provisioning
// ====================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

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
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized user" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return new Response(JSON.stringify({ error: "Order ID and Payment ID are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify cryptographic signature if secret key is configured
    if (razorpayKeySecret && razorpay_signature) {
      const generatedSignature = hmac(
        "sha256",
        razorpayKeySecret,
        `${razorpay_order_id}|${razorpay_payment_id}`,
        "utf8",
        "hex"
      );

      if (generatedSignature !== razorpay_signature) {
        // Record failed attempt
        await supabase
          .from("payments")
          .update({ payment_status: "failed", provider_payment_id: razorpay_payment_id })
          .eq("provider_order_id", razorpay_order_id);

        return new Response(
          JSON.stringify({ error: "Invalid payment signature. Transaction rejected." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Fetch existing pending payment
    const { data: paymentRecord, error: pError } = await supabase
      .from("payments")
      .select("*")
      .eq("provider_order_id", razorpay_order_id)
      .single();

    if (pError || !paymentRecord) {
      throw new Error("Payment record matching order ID not found");
    }

    // Update payment record to successful
    await supabase
      .from("payments")
      .update({
        payment_status: "successful",
        provider_payment_id: razorpay_payment_id,
        verification_metadata: {
          verifiedAt: new Date().toISOString(),
          verifiedBy: "verify-razorpay-payment-edge-function",
        },
      })
      .eq("id", paymentRecord.id);

    // Provision access in purchases table
    await supabase.from("purchases").upsert(
      {
        student_id: paymentRecord.student_id || user.id,
        product_type: paymentRecord.product_type,
        product_id: paymentRecord.product_id,
        payment_reference: razorpay_payment_id,
        access_status: "granted",
      },
      { onConflict: "student_id,product_type,product_id" }
    );

    // If product is a course, automatically enroll student
    if (paymentRecord.product_type === "course") {
      await supabase.from("enrollments").upsert(
        {
          student_id: paymentRecord.student_id || user.id,
          course_id: paymentRecord.product_id,
          status: "active",
          purchase_reference: paymentRecord.id,
        },
        { onConflict: "student_id,course_id" }
      );
    }

    // Send student notification
    await supabase.from("notifications").insert({
      recipient_user_id: paymentRecord.student_id || user.id,
      title: "Payment Confirmed! Access Granted",
      message: `Your payment of ₹${paymentRecord.amount} was verified successfully. Access to your ${paymentRecord.product_type} has been activated.`,
      notification_type: "success",
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      actor_user_id: user.id,
      action: "VERIFY_PAYMENT_SUCCESS",
      entity_type: "payments",
      entity_id: paymentRecord.id,
      safe_metadata: {
        amount: paymentRecord.amount,
        product_type: paymentRecord.product_type,
        order_id: razorpay_order_id,
      },
    });

    return new Response(
      JSON.stringify({
        verified: true,
        message: "Payment successfully verified and product access granted.",
        paymentId: paymentRecord.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
