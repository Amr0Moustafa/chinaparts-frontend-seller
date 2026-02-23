import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SELLER_WEBSITE}`;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ product: string }> }
) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const { product } = await context.params;

  try {
    const res = await axios.get(
      `${BASE_URL}/products/${product}/variants`,
      {
        headers: {
          Authorization: `Bearer ${seller_token}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch variants" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ product: string }> }
) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const body = await req.json();
  const { product } = await context.params;
  try {
    const res = await axios.post(
      `${BASE_URL}/products/${product}/variants`,
      body,
      {
        headers: {
          Authorization: `Bearer ${seller_token}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to create variant" },
      { status: error.response?.status || 500 }
    );
  }
}
