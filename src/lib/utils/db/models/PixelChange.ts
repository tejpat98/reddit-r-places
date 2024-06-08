import mongoose from "mongoose";

const PixelChangeSchema = new mongoose.Schema(
  {
    X: { type: Number, required: true },
    Y: { type: Number, required: true },
    colourID: { type: Number, required: true },
  },
  { collection: "PixelChanges" }
);
const PixelChanges = mongoose.models.PixelChanges || mongoose.model("PixelChanges", PixelChangeSchema);
export default PixelChanges;
