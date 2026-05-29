import { ImageResponse } from "next/og";
import { getFlipTarget } from "@/lib/flip/assets";
import { buildImageCopy, parseFlipImageSlug } from "@/lib/flip/images";
import { logFlipRequest } from "@/lib/flip/logging";
import {
  getCacheHeaders,
  getFlipResponse,
  getNextFlipResponse,
} from "@/lib/flip/snapshot";

interface RouteContext {
  params: Promise<{
    image: string;
  }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { image } = await context.params;
  const parsed = parseFlipImageSlug(image);

  if (!parsed) {
    return new Response("Unsupported image", { status: 404 });
  }

  await logFlipRequest(request, {
    endpoint: "image.flip",
    target: parsed.kind === "next" ? "next" : parsed.target,
  });

  const origin = new URL(request.url).origin;
  const response =
    parsed.kind === "next"
      ? await getNextFlipResponse(origin)
      : await getFlipResponse(parsed.target, origin);
  const target = getFlipTarget(response.target);
  const copy = buildImageCopy({
    targetName: target?.name,
    response,
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070707",
          color: "white",
          padding: "64px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#f59e0b",
            fontSize: 28,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>BTC Hits</span>
          <span>{copy.updatedAt}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              color: "#f59e0b",
              fontSize: 42,
              fontWeight: 700,
            }}
          >
            {copy.title}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 980,
              fontSize: 86,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {copy.progress}
          </div>
          <div
            style={{
              display: "flex",
              color: "#e5e7eb",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            {copy.requiredPrice}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(245, 158, 11, 0.35)",
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ color: "#f9fafb", fontSize: 34, fontWeight: 700 }}>
              {copy.gap}
            </span>
            <span style={{ color: "#9ca3af", fontSize: 28 }}>
              {copy.gapChange}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              textAlign: "right",
              color: "#9ca3af",
              fontSize: 24,
            }}
          >
            <span>Methodology</span>
            <span>btchits.top/methodology</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: getCacheHeaders(),
    }
  );
}
