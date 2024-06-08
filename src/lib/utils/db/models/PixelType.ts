import mongoose from "mongoose";

const PixelTypeSchema = new mongoose.Schema(
  {
    colourID: { type: Number, required: true, readonly: true },
    RGB: [{ type: Number, required: true, readonly: true }],
    Name: { type: String, required: true, readonly: true },
  },
  { collection: "PixelTypes" }
);

const PixelTypes = mongoose.models.PixelTypes || mongoose.model("PixelTypes", PixelTypeSchema);
export default PixelTypes;
