import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SELLER_WEBSITE}`;

export async function POST(req: NextRequest) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const body = await req.json();

  try {
    const res = await axios.post(`${BASE_URL}/wallet/withdraw`, body, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Withdraw request failed" },
      { status: error.response?.status || 500 }
    );
  }
}