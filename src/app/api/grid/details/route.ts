import PlaceConfig from "@/lib/utils/rplace-config.js";

export async function GET(req: Request) {
  return Response.json({
    PlaceConfig,
  });
}
