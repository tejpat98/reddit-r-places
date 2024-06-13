import fs from "fs";
let gridPNG: any;
const path = "./reddit-r-place-assets/rplace-grid.png";
export async function fetchPNG() {
  if (!gridPNG) {
    await refetchPNG();
  }
  return gridPNG;
}
export async function refetchPNG() {
  gridPNG = fs.readFileSync(path);
  return;
}
