import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SELLER_WEBSITE}`;

export async function GET(req: NextRequest) {
  const seller_token = req.cookies.get("seller_token")?.value;

  const { searchParams } = new URL(req.url);

  const params = {
    status: searchParams.get("status"),
    per_page: searchParams.get("per_page"),
    page: searchParams.get("page"),
  };

  try {
    const res = await axios.get(`${BASE_URL}/wallet/reserves`, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
      },
      params,
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch reserves" },
      { status: error.response?.status || 500 }
    );
  }
}