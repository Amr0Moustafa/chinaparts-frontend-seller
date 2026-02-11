import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}`;

/**
 * GET /api/seller/vehicle-attributes/brands/[brand_id]/models
 * List vehicle models by brand
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ brand_id: string }> },
) {
  
  const seller_token = req.cookies.get("seller_token")?.value;

  if (!seller_token) {
    return NextResponse.json(
      { error: "Unauthorized - No seller token" },
      { status: 401 },
    );
  }
  const { brand_id } = await context.params;
  try {
    const res = await axios.get(
      `${BASE_URL}/vehicle-attributes/brands/${brand_id}/models`,
      {
        headers: {
          Authorization: `Bearer ${seller_token}`,
        },
      },
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error(
      `Error fetching vehicle models for brand ${brand_id}:`,
      error,
    );
    return NextResponse.json(
      {
        error:
          error.response?.data || "Failed to fetch vehicle models by brand",
      },
      { status: error.response?.status || 500 },
    );
  }
}
