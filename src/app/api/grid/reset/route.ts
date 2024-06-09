/*
1. Empty current db collections
2. Initialise with default values (white pixels)
3. generate a PNG 
*/
import PixelChanges from "@/lib/utils/db/models/PixelChange";
import { createPNG } from "@/lib/utils/createPNG";
import { dbConnect } from "@/lib/utils/db/db";
import PlaceConfig from "@/lib/utils/rplace-config";

const PixelTypesList = PlaceConfig.PixelTypes;
const gridSize = PlaceConfig.gridSize;
export async function GET(req: Request) {
  await dbConnect();
  //Delete all existing Grid data
  await PixelChanges.deleteMany({});

  //Generate new blank PNG
  var dataArr = new Uint8ClampedArray(gridSize * gridSize * 4).fill(255);
  await createPNG(dataArr);

  return Response.json({
    text: "Grid has been reset.",
  });
}
