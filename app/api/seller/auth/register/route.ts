import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { first_name, last_name, email, phone, password, password_confirmation, verification_code } = body;
    
    if (!first_name || !last_name || !email || !phone || !password || !password_confirmation) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // If verification_code is provided, include it in the request
    const requestData = verification_code ? { ...body } : body;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}/auth/register`,
      requestData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    // If registration is successful and includes a token, set it as a cookie
    const token = response.data?.data?.token;
    if (token) {
      const res = NextResponse.json({ success: true, ...response.data });
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return res;
    }

    return NextResponse.json({ success: true, ...response.data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Registration failed" },
      { status: error.response?.status || 500 }
    );
  }
}
