import { fetchPNG } from "@/lib/utils/fetchPNG";

export const revalidate = 0;

export async function GET(req: Request, res: any) {
  var png = await fetchPNG();
  // create a JSON string that contains the data in the property "blob"
  var json = JSON.stringify({ blob: png.toString("base64") });

  return Response.json(json);
}
