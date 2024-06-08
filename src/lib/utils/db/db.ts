//connect to mongoDB
import mongoose from "mongoose";
const URI: string = process.env.MONGODB_URI!;

export async function dbConnect() {
  if (mongoose.connection.readyState == 1 || mongoose.connection.readyState == 2) {
    //If connected or connecting
    return;
  } else {
    await mongoose
      .connect(URI)
      .catch((e) => {
        return console.log("( ✖ ) Error: Failed to connect to MongoDB. ErrorTrace: " + e);
      })
      .then(
        () => {
          //fulfilled
          return console.log("( ✔ ) Connected to MongoDB");
        },
        () => {
          //onreject
          return console.log("( ✖ ) Rejected: Failed to connect to MongoDB.");
        }
      );
  }
  mongoose.connection.on("error", (err) => {
    console.log("(e) MongoDB Error: " + err);
  });
}
