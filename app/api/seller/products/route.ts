import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}`;

export async function GET(req: NextRequest) {
  const seller_token = req.cookies.get("seller_token")?.value;

  try {
    const { searchParams } = new URL(req.url);

    const params = Object.fromEntries(searchParams.entries());

    const res = await axios.get(`${BASE_URL}/products`, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
      },
      params,
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch products" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const formData = await req.formData();

  try {
    const res = await axios.post(`${BASE_URL}/products`, formData, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
      },
    });

    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to create product" },
      { status: error.response?.status || 500 }
    );
  }
}
