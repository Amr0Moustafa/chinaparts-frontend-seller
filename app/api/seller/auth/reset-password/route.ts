import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { phone, code, password, password_confirmation } = body;
    
    if (!phone || !code || !password || !password_confirmation) {
      return NextResponse.json(
        { error: "Phone, code, password, and password confirmation are required" },
        { status: 400 }
      );
    }

    // Basic phone validation
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Basic code validation
    const codeRegex = /^\d{4,6}$/;
    if (!codeRegex.test(code)) {
      return NextResponse.json(
        { error: "Code must be 4-6 digits" },
        { status: 400 }
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Basic password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}/auth/reset-password`,
      body,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Password reset failed" },
      { status: error.response?.status || 500 }
    );
  }
}
