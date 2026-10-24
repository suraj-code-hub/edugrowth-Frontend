// ====================================================================
// Supabase Edge Function: create-razorpay-order
// Secure server-side order generation with Razorpay API
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
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") ?? "";
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";

    // Authenticate user via authorization header
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

    const { productId, productType } = await req.json();

    if (!productId || !productType) {
      return new Response(JSON.stringify({ error: "productId and productType are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Lookup verified price from database (Never trust client price!)
    let itemPrice = 0;
    let itemTitle = "";

    if (productType === "course") {
      const { data: course, error } = await supabase
        .from("courses")
        .select("price, title")
        .eq("id", productId)
        .single();
      if (error || !course) throw new Error("Course not found");
      itemPrice = Number(course.price);
      itemTitle = course.title;
    } else if (productType === "learning_resource") {
      const { data: resource, error } = await supabase
        .from("learning_resources")
        .select("price, title")
        .eq("id", productId)
        .single();
      if (error || !resource) throw new Error("Resource not found");
      itemPrice = Number(resource.price);
      itemTitle = resource.title;
    } else {
      throw new Error("Invalid product type");
    }

    if (itemPrice <= 0) {
      return new Response(
        JSON.stringify({ error: "This item is free, no payment order needed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(itemPrice * 100);

    // Call Razorpay API to generate order
    let orderId = `order_test_${Date.now()}`;

    if (razorpayKeyId && razorpayKeySecret) {
      const credentials = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${user.id.substring(0, 8)}_${Date.now().toString().slice(-6)}`,
          notes: {
            userId: user.id,
            productId,
            productType,
            title: itemTitle,
          },
        }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) {
        throw new Error(rzpData.error?.description || "Failed to create Razorpay order");
      }
      orderId = rzpData.id;
    }

    // Insert pending payment record
    await supabase.from("payments").insert({
      student_id: user.id,
      product_type: productType,
      product_id: productId,
      provider: "razorpay",
      provider_order_id: orderId,
      amount: itemPrice,
      currency: "INR",
      payment_status: "pending",
      verification_metadata: { itemTitle, amountInPaise },
    });

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        amount: itemPrice,
        currency: "INR",
        keyId: razorpayKeyId || "rzp_test_placeholder",
        title: itemTitle,
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
