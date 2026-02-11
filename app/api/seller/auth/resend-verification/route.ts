import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { phone, email, type } = body;
    
    if (!phone && !email) {
      return NextResponse.json(
        { error: "Phone number or email is required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}/auth/resend-verification-code`,
      {
        phone,
        email,
        type: type || 'registration'
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully",
      ...response.data
    });
  } catch (error: any) {
    console.error("Resend verification code error:", error.response?.data);
    return NextResponse.json(
      { 
        error: error.response?.data?.message || error.response?.data || "Failed to resend verification code",
        details: error.response?.data
      },
      { status: error.response?.status || 500 }
    );
  }
}
