import { NextResponse } from "next/server";
import { getSupportedTargetSlugs } from "@/lib/flip/assets";
import { logFlipRequest } from "@/lib/flip/logging";
import { formatTargetSlug } from "@/lib/flip/metrics";
import { getCacheHeaders, getFlipResponse } from "@/lib/flip/snapshot";

interface RouteContext {
  params: Promise<{
    target: string;
  }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { target } = await context.params;
  const targetSlug = formatTargetSlug(target);
  const supportedTargets = getSupportedTargetSlugs();
  await logFlipRequest(request, {
    endpoint: "api.flip.target",
    target: targetSlug,
  });

  if (!supportedTargets.includes(targetSlug as never)) {
    return NextResponse.json(
      {
        error: "Unsupported flip target",
        target: targetSlug,
        supported_targets: supportedTargets,
      },
      { status: 404 }
    );
  }

  const origin = new URL(request.url).origin;
  const response = await getFlipResponse(targetSlug as never, origin);

  return NextResponse.json(response, {
    headers: getCacheHeaders(),
  });
}
