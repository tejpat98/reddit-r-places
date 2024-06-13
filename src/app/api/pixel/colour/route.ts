//setPixelColour
import { addPixelChange, updateGrid } from "@/lib/controllers/PixelChangesController";
import { Server } from "socket.io";

export async function POST(req: Request, res: any) {
  const { X, Y, colourID, socketID } = await req.json();
  //console.log(X, Y, colourID, socketID);
  var change = { X: X, Y: Y, colourID: colourID };

  //Will either return {X,Y,colourID} or {error}
  var result = await addPixelChange(change);

  if (result.hasOwnProperty("error")) {
    var errorMsg = `Error: failed to change pixel. ${result.error}`;
    console.log(errorMsg);
    return new Response(JSON.stringify(result), { headers: { "Content-type": "application/json" }, status: 400 });
  } else {
    //sucessful --> send change to all connected sockets
    //sendChange(change);
    global.Socket_IO.emit("pixel-update", change);
    await updateGrid();
    return new Response(JSON.stringify(result), { headers: { "Content-type": "application/json" }, status: 201 });
  }
}
