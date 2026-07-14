import { NextResponse } from "next/server";
import { WebConfiguration } from "@matterchat/config";

export async function GET() {
  // CRITICAL: Ensure no secrets are exposed here. This endpoint is public and can be accessed by anyone.
  return NextResponse.json({ ...WebConfiguration });
}
