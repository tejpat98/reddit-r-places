import { dbConnect } from "../utils/db/db";
import PixelTypes from "../utils/db/models/PixelType";

let pixeltypes: any[] = [];
let lastCalled: Date | number = 0;
let throttleDelay = 10000;
export async function getPixelTypes(): Promise<any[]> {
  var currentTime = new Date();
  if (currentTime - lastCalled > throttleDelay) {
    await dbConnect();
    pixeltypes = await PixelTypes.find({}).select(["colourID", "Name", "RGB", "-_id"]);
    lastCalled = new Date();
  }
  return pixeltypes;
}
