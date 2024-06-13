import { dbConnect } from "../utils/db/db";
import PixelChanges from "../utils/db/models/PixelChange";
import { refetchPNG } from "../utils/fetchPNG";
import { updatePNG } from "../utils/updatePNG";
import PlaceConfig from "@/lib/utils/rplace-config.js";

const gridSize = PlaceConfig.gridSize;
let PixelTypesList = PlaceConfig.PixelTypes;

let isUpdatingPNG: boolean = false;
let changeBuffer: any[] = [];

let lastUpdated: number = 0;
let throttleDelay: number = 10000;

export async function addPixelChange(req: any) {
  var pixelChangeReq = validatePixelChange(req);
  if (pixelChangeReq.hasOwnProperty("error")) {
    return pixelChangeReq;
  } else {
    if (isUpdatingPNG) {
      //PNG is currently being updated --> hold change in changeBuffer
      changeBuffer.push(pixelChangeReq);
    } else {
      //Not currently updating PNG --> add to DB
      await dbConnect();
      await PixelChanges.create({ X: pixelChangeReq.X, Y: pixelChangeReq.Y, colourID: pixelChangeReq.colourID });
    }
    return pixelChangeReq;
  }
}
export async function getAllChanges() {
  await dbConnect();
  var allChanges = await PixelChanges.find({}).select(["-_id", "-__v"]);
  allChanges.push(...changeBuffer);
  return allChanges;
}

export async function updateGrid() {
  var currentTime = Date.now();
  if (currentTime - lastUpdated > throttleDelay) {
    isUpdatingPNG = true;
    await dbConnect();
    var currentChanges = await PixelChanges.find({});
    if (currentChanges.length === 0) {
      //no changes to consolidate
      isUpdatingPNG = false;
      clearChangeBuffer();
    } else {
      //consolidate PixelChanges to currentPNG
      await updatePNG(currentChanges);
      //delete all PixelChanges (already reflected in the new PNG, so are unnecessary)
      await dbConnect();
      await PixelChanges.deleteMany({});
      isUpdatingPNG = false;
      clearChangeBuffer();
      //update lastUpadated time to reset cooldown on updatePNG
      lastUpdated = Date.now();
    }
    return;
  } else {
    //on cooldown
    return;
  }
}
async function clearChangeBuffer() {
  if (isUpdatingPNG === false) {
    //Not updating PNG --> changes are being added stright to DB --> changeBuffer is unused --> safe to clear buffer
    await dbConnect();
    //save buffer to DB
    await PixelChanges.create(changeBuffer);
    //empty the buffer
    changeBuffer.length = 0;
  }
}
function validatePixelChange(req: any) {
  var { X, Y, colourID } = req;
  if (X != undefined && Y != undefined && colourID != undefined) {
    //All 3 fields exist
    if (!Number.isInteger(X) || !(X >= 0) || !(X <= gridSize - 1)) {
      return { error: "X is not an valid Integer." };
    }
    if (!Number.isInteger(Y) || !(Y >= 0) || !(Y <= gridSize - 1)) {
      return { error: "Y is not an valid Integer." };
    }
    var isValidType = PixelTypesList.some((e) => e.colourID === colourID);
    if (!Number.isInteger(colourID) || !isValidType) {
      return { error: "Invalid colourID value." };
    }
  } else {
    return { error: "Missing either X, Y or colourID fields." };
  }
  return { X, Y, colourID };
}
