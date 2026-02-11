import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { phone, email } = body;
    
    if (!phone && !email) {
      return NextResponse.json(
        { error: "Phone number or email is required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}/auth/check-availability`,
      {
        phone,
        email
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return NextResponse.json({
      success: true,
      ...response.data
    });
  } catch (error: any) {
    console.error("Check availability error:", error.response?.data);
    return NextResponse.json(
      { 
        error: error.response?.data?.message || error.response?.data || "Failed to check availability",
        details: error.response?.data
      },
      { status: error.response?.status || 500 }
    );
  }
}
