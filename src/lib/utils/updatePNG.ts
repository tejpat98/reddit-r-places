import { PNG } from "pngjs";
import fs from "fs";
import PlaceConfig from "@/lib/utils/rplace-config";

const gridSize = PlaceConfig.gridSize;
export async function updatePNG(currentChanges: any[]) {
  var PixelTypesList = PlaceConfig.PixelTypes;

  fs.createReadStream("./public/images/rplace-grid.png")
    .pipe(
      new PNG({
        width: gridSize,
        height: gridSize,
        filterType: -1,
      })
    )
    .on("parsed", function () {
      currentChanges.forEach((change) => {
        var { RGB } = PixelTypesList.find((e) => e.colourID === change.colourID);
        var offsetY = 4 * gridSize * change.Y;
        var offsetX = 4 * change.X;
        var totalOffset = offsetY + offsetX;

        this.data[totalOffset] = RGB[0];
        this.data[totalOffset + 1] = RGB[1];
        this.data[totalOffset + 2] = RGB[2];
      });

      this.pack().pipe(fs.createWriteStream("./public/images/rplace-grid.png"));
    });
}
