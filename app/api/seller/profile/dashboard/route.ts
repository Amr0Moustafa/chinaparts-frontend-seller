import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}/profile/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return NextResponse.json(response.data?.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch dashboard data" },
      { status: error.response?.status || 500 }
    );
  }
}
