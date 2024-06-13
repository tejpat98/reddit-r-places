/*
    PNG files are used as they have lossless compression built in:
    (*) Multiple repeating pixels are grouped together, this form of compression is called "Run Length Encoding" e.g. instead of [1,1,1,1,1,1,1,1,1] is stored as [1](9)
        ... LZSS is an algorithm for compression that does this, but also works on all repeated sequences e.g. [1,2,1,2,1,2,1,2,1,2] would compress as a pattern of [1,2](5)
    (*) >>> PNG formats already implement both of these and more ... 
*/
import { PNG } from "pngjs";
import fs from "fs";
import PlaceConfig from "@/lib/utils/rplace-config.js";
import { refetchPNG } from "./fetchPNG";

const gridSize = PlaceConfig.gridSize;
export async function createPNG(data: Uint8ClampedArray) {
  var png = new PNG({
    width: gridSize,
    height: gridSize,
    filterType: -1,
  });
  for (var y = 0; y < png.height; y++) {
    for (var x = 0; x < png.width; x++) {
      var idx = (png.width * y + x) << 2;
      png.data[idx] = data[idx]; // red
      png.data[idx + 1] = data[idx + 1]; // green
      png.data[idx + 2] = data[idx + 2]; // blue
      png.data[idx + 3] = data[idx + 3]; // alpha (0 is transparent)
    }
  }

  var pngBuffer = PNG.sync.write(png);
  fs.writeFileSync("./reddit-r-place-assets/rplace-grid.png", pngBuffer);

  refetchPNG();

  console.log("created new PNG");
}
