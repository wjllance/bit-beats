import { NextResponse } from "next/server";
import { logFlipRequest } from "@/lib/flip/logging";
import { getCacheHeaders, getNextFlipResponse } from "@/lib/flip/snapshot";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  await logFlipRequest(request, {
    endpoint: "api.flip.next",
    target: "next",
  });
  const response = await getNextFlipResponse(origin);

  return NextResponse.json(response, {
    headers: getCacheHeaders(),
  });
}
