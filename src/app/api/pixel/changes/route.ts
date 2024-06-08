import { getAllChanges } from "@/lib/controllers/PixelChangesController";

export async function GET(req: Request, res: any) {
  //fetch and send all PixelChanges
  var allChanges = await getAllChanges();

  return Response.json(allChanges);
}
