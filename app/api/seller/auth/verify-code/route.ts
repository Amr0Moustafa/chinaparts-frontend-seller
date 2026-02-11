import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { code, type } = body;
    
    if (!code) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

  

    // Validate code format (assuming 6-digit code)
    if (!/^\d{4}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid verification code format" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}/auth/verify-code`,
      {
        code,
       
        type: type || 'registration'
      },
      {
        headers: { 
          "Content-Type": "application/json",
           "Authorization": `Bearer ${req.cookies.get("token")?.value}`
         },
        withCredentials: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Code verified successfully",
      ...response.data
    });
  } catch (error: any) {
    console.error("Verify code error:", error.response?.data);
    return NextResponse.json(
      { 
        error: error.response?.data?.message || error.response?.data || "Code verification failed",
        details: error.response?.data
      },
      { status: error.response?.status || 500 }
    );
  }
}
