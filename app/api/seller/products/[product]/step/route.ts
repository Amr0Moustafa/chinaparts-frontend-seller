import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}`;


type Params = {
  params: Promise<{ product: string }>;
}; 


export async function PATCH(req: NextRequest, context: Params) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const body = await req.json();
const { product } = await context.params;
  try {
    const res = await axios.patch(
      `${BASE_URL}/products/${product}/step`,
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
      { error: error.response?.data || "Failed to update product step" },
      { status: error.response?.status || 500 }
    );
  }
}
