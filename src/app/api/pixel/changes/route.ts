import { getAllChanges } from "@/lib/controllers/PixelChangesController";

//to prevent caching on this route
export const revalidate = 0;

export async function GET(req: Request, res: any) {
  //fetch and send all PixelChanges
  var allChanges = await getAllChanges();

  return Response.json(allChanges);
}
