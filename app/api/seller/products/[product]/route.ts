import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}`;

type Params = {
  params: Promise<{ product: string }>;
};

export async function GET(req: NextRequest, context: Params) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const { product } = await context.params;
  try {
    const res = await axios.get(`${BASE_URL}/products/${product}`, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch product" },
      { status: error.response?.status || 500 },
    );
  }
}

export async function PUT(req: NextRequest, context: Params) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const body = await req.json();
  const { product } = await context.params;
  try {
    const res = await axios.put(`${BASE_URL}/products/${product}`, body, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to update product" },
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(req: NextRequest, context: Params) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const formData = await req.formData();
  const { product } = await context.params;
  try {
    const res = await axios.post(`${BASE_URL}/products/${product}`, formData, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to update product with files" },
      { status: error.response?.status || 500 },
    );
  }
}

export async function DELETE(req: NextRequest, context: Params) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const { product } = await context.params;
  try {
    const res = await axios.delete(`${BASE_URL}/products/${product}`, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to delete product" },
      { status: error.response?.status || 500 },
    );
  }
}
