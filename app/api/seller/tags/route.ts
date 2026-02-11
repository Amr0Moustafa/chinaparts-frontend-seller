import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}`;

/**
 * GET /api/seller/tags
 * List all tags for product selection
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
    const res = await axios.get(`${BASE_URL}/tags`, {
      headers: {
        Authorization: `Bearer ${seller_token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch tags" },
      { status: error.response?.status || 500 }
    );
  }
}