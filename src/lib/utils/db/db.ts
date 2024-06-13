//connect to mongoDB
import mongoose from "mongoose";
const URI: string = process.env.MONGODB_URI!;
const DB_NAME: string = process.env.DB_NAME!;
export async function dbConnect() {
  if (mongoose.connection.readyState == 1 || mongoose.connection.readyState == 2) {
    //If connected or connecting
    return;
  } else {
    await mongoose
      .connect(URI, { dbName: DB_NAME })
      .catch((e) => {
        mongoose.disconnect();
        return console.log("( ✖ ) Error: Failed to connect to MongoDB. ErrorTrace: " + e);
      })
      .then(
        () => {
          //fulfilled
          return console.log("( ✔ ) Connected to MongoDB" + " Database: " + DB_NAME);
        },
        () => {
          //onreject
          mongoose.disconnect();
          return console.log("( ✖ ) Rejected: Failed to connect to MongoDB.");
        }
      );
  }
  mongoose.connection.on("error", (err) => {
    console.log("(e) MongoDB Error: " + err);
  });
}
