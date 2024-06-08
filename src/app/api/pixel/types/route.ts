//send and array of all the pixel types {colourID, RGB, Name}
import { dbConnect } from "@/lib/utils/db/db";
import { getPixelTypes } from "@/lib/controllers/PixelTypesController";

export async function GET(req: Request) {
  var PixelTypes = await getPixelTypes();

  return Response.json(PixelTypes);
}
