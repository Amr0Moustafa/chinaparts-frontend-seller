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
    const res = await axios.get(
      `${BASE_URL}/products/${product}/attributes`,
      {
        headers: {
          Authorization: `Bearer ${seller_token}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch attributes" },
      { status: error.response?.status || 500 }
    );
  }
}
