import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SELLER_WEBSITE}`;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ product: string; variant: string }> }
) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const { product, variant } = await context.params;

  try {
    const res = await axios.get(
      `${BASE_URL}/products/${product}/variants/${variant}`,
      {
        headers: {
          Authorization: `Bearer ${seller_token}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch variant" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ product: string; variant: string }> }
) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const body = await req.json();
  const { product, variant } = await context.params;

  try {
    const res = await axios.put(
      `${BASE_URL}/products/${product}/variants/${variant}`,
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
      { error: error.response?.data || "Failed to update variant" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ product: string; variant: string }> }
) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const { product, variant } = await context.params;

  try {
    const res = await axios.delete(
      `${BASE_URL}/products/${product}/variants/${variant}`,
      {
        headers: {
          Authorization: `Bearer ${seller_token}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to delete variant" },
      { status: error.response?.status || 500 }
    );
  }
}
