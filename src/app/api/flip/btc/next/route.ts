import { NextResponse } from "next/server";
import { getCacheHeaders, getNextFlipResponse } from "@/lib/flip/snapshot";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const response = await getNextFlipResponse(origin);

  return NextResponse.json(response, {
    headers: getCacheHeaders(),
  });
}
