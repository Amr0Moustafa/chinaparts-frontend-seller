import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SELLER_WEBSITE}`;

export async function GET(req: NextRequest) {
  const seller_token = req.cookies.get("seller_token")?.value;

  const { searchParams } = new URL(req.url);

  const params = {
    type: searchParams.get("type"),
    bucket: searchParams.get("bucket"),
    date_from: searchParams.get("date_from"),
    date_to: searchParams.get("date_to"),
    per_page: searchParams.get("per_page"),
    page: searchParams.get("page"),
  };

  try {
    const res = await axios.get(`${BASE_URL}/wallet/transactions`, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
      },
      params,
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch transactions" },
      { status: error.response?.status || 500 }
    );
  }
}