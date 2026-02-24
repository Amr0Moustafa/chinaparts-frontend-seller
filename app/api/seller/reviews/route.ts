import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}`;

/**
 * GET /api/seller/reviews
 * List seller product reviews
 */
export async function GET(req: NextRequest) {
  const seller_token = req.cookies.get("seller_token")?.value;

  if (!seller_token) {
    return NextResponse.json(
      { error: "Unauthorized - No seller token" },
      { status: 401 }
    );
  }

  try {
    // forward query params
    const { searchParams } = new URL(req.url);

    const res = await axios.get(`${BASE_URL}/reviews`, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
      },
      params: Object.fromEntries(searchParams.entries()),
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);

    return NextResponse.json(
      {
        error: error.response?.data || "Failed to fetch reviews",
      },
      { status: error.response?.status || 500 }
    );
  }
}