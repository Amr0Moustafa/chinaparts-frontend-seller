import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
  

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}/auth/send-verification-code`,
      {},
      {
        headers: { 
          "Content-Type": "application/json" ,
          "Authorization": `Bearer ${req.cookies.get("token")?.value}`
        },
      
        
      }
    );

    console.log(response.data);
   
    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
      ...response.data
    });
   
    
  } catch (error: any) {
   
    return NextResponse.json(
      { 
        error: error.response?.data?.message || error.response?.data || "Failed to send verification code",
        details: error.response?.data
      },
      { status: error.response?.status || 500 }
    );
  }
}
