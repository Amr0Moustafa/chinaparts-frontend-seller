// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}/auth/login`,
      body,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    ); 
  
 

    const token = response.data?.data?.token;
  
    if (!token) {
      return NextResponse.json({ error: "No token received" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, token });

    // ✅ Correct way to set cookie:
    res.cookies.set("seller_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Login failed" },
      { status: error.response?.status || 500 }
    );
  }
}
