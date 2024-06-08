/*
1. Empty current db collections
2. Initialise with default values (white pixels)
3. generate a PNG 
*/
import PixelChanges from "@/lib/utils/db/models/PixelChange";
import PixelTypes from "@/lib/utils/db/models/PixelType";
import { createPNG } from "@/lib/utils/createPNG";
import { dbConnect } from "@/lib/utils/db/db";

const gridSize = parseInt(process.env.GRID_SIZE!);
const PixelTypesList = [
  { colourID: 0, RGB: [185, 28, 28], Name: "red" },
  { colourID: 1, RGB: [255, 255, 255], Name: "white" },
  { colourID: 2, RGB: [0, 0, 0], Name: "black" },
  { colourID: 3, RGB: [21, 128, 61], Name: "green" },
  { colourID: 4, RGB: [29, 78, 216], Name: "blue" },
  { colourID: 5, RGB: [14, 116, 144], Name: "cyan" },
  { colourID: 6, RGB: [190, 24, 93], Name: "pink" },
  { colourID: 7, RGB: [194, 65, 12], Name: "orange" },
  { colourID: 8, RGB: [126, 34, 206], Name: "purple" },
  { colourID: 9, RGB: [55, 65, 81], Name: "gray" },
  { colourID: 10, RGB: [234, 179, 8], Name: "yellow" },
  { colourID: 11, RGB: [67, 56, 202], Name: "indigo" },
];
export async function GET(req: Request) {
  await dbConnect();
  //Delete all existing Grid data
  await PixelChanges.deleteMany({});
  await PixelTypes.deleteMany({});

  //Add PixelTypes
  PixelTypesList.forEach(async (item) => {
    await PixelTypes.create({ ...item });
  });

  //Generate new blank PNG
  var dataArr = new Uint8ClampedArray(gridSize * gridSize * 4).fill(255);
  await createPNG(dataArr);

  return Response.json({
    text: "Grid has been reset.",
  });
}
