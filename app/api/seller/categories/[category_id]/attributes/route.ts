import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}${process.env.NEXT_PUBLIC_API_SEllER_WEBSITE}`;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ category_id: string }> }
 
) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { category_id } = await context.params;

  try {
    const response = await axios.get(
      `${BASE_URL}/category/${category_id}/attributes`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch category products" },
      { status: error.response?.status || 500 }
    );
  }
}
