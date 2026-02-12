import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SELLER_WEBSITE}`;

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ product: string; variant: string }> }
) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const body = await req.json();
  const { product, variant } = await context.params;

  try {
    const res = await axios.patch(
      `${BASE_URL}/products/${product}/variants/${variant}/stock`,
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
      { error: error.response?.data || "Failed to update stock" },
      { status: error.response?.status || 500 }
    );
  }
}
