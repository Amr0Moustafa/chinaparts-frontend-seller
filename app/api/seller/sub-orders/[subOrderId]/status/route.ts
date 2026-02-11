import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SELLER_WEBSITE}`;

export async function PATCH(
  req: NextRequest,
   context: { params: Promise<{ subOrderId: string }> },
) {
  const seller_token = req.cookies.get("seller_token")?.value;
  const body = await req.json();
const { subOrderId } = await context.params;
  try {
    const res = await axios.patch(
      `${BASE_URL}/sub-orders/${subOrderId}/status`,
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
      { error: error.response?.data || "Failed to update sub-order status" },
      { status: error.response?.status || 500 }
    );
  }
}
