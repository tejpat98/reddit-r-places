import { PNG } from "pngjs";
import fs from "fs";
import PlaceConfig from "@/lib/utils/rplace-config.js";
import { refetchPNG } from "./fetchPNG";

type PixelTypes = any[];

const gridSize = PlaceConfig.gridSize;
export async function updatePNG(currentChanges: any[]) {
  var PixelTypesList: PixelTypes = PlaceConfig.PixelTypes;

  var file = fs.readFileSync("./reddit-r-place-assets/rplace-grid.png");
  var pngFile = PNG.sync.read(file);

  currentChanges.forEach((change) => {
    var { RGB } = PixelTypesList.find((e) => e.colourID === change.colourID);
    var offsetY = 4 * gridSize * change.Y;
    var offsetX = 4 * change.X;
    var totalOffset = offsetY + offsetX;

    pngFile.data[totalOffset] = RGB[0];
    pngFile.data[totalOffset + 1] = RGB[1];
    pngFile.data[totalOffset + 2] = RGB[2];
  });

  var pngBuffer = PNG.sync.write(pngFile);
  fs.writeFileSync("./reddit-r-place-assets/rplace-grid.png", pngBuffer);

  refetchPNG();
}
