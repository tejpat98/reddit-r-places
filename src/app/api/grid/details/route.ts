import PlaceConfig from "@/lib/utils/rplace-config";

export async function GET(req: Request) {
  return Response.json({
    PlaceConfig,
  });
}
