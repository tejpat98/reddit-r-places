"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Canvas from "./Canvas";
import Overlay from "./Overlay";

let socket: any;
function RedditPlaces() {
  const [selectedPixel, setSelectedPixel] = useState({ X: 0, Y: 0, Colour: "red" });
  const [PixelChanges, setPixelChanges] = useState<Array<any>>([]);
  const [PixelTypes, setPixelTypes] = useState<Array<any>>([]);
  const isSocketConnected = useRef<Boolean>(false);

  const socketInitializer = async () => {
    socket = io({ autoConnect: true, reconnectionDelay: 500, reconnectionDelayMax: 500 });
    socket.connect();
    socket.on("connect", () => {
      isSocketConnected.current = true;
      console.log("Connected to server, my id: " + socket.id);
    });
    socket.on("connect_error", (err: any) => {
      console.log("error: ", err);
    });
    socket.on("pixel-update", (data: any) => {
      var { X, Y, colourID } = data;
      setPixelChanges((prevPixelChanges: any[]) => [...prevPixelChanges, data]);
      console.log(`pixel-update: {X: ${X}, Y: ${Y}, colourID: ${colourID}}`);
    });
    socket.on("hydrate-canvas", (data: any) => {
      setPixelChanges((prevPixelChanges: any[]) => [...prevPixelChanges, ...data]);
    });
  };
  const changePixel = async (selectedPaletteColour: String) => {
    var { colourID } = PixelTypes.find((e: any) => e.Name === selectedPaletteColour);
    const response = await fetch("/api/pixel/colour", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        X: selectedPixel.X,
        Y: selectedPixel.Y,
        colourID: colourID,
        socketID: socket.id,
      }),
    });
  };
  const fetchPixelTypes = async () => {
    await fetch("/api/pixel/types")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPixelTypes([...data]);
      });
  };
  useEffect(() => {
    console.log(PixelChanges);
  });
  useEffect(() => {
    socketInitializer();
    fetchPixelTypes();

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("connect_error");
      socket.off("hydrate-canvas");
      socket.off("pixel-change");
      socket.off("pixel-update");

      isSocketConnected.current = false;
    };
  }, []);

  if (PixelTypes.length && isSocketConnected.current) {
    return (
      <>
        <Canvas setSelectedPixel={setSelectedPixel} PixelChanges={PixelChanges} PixelTypes={PixelTypes} />
        <Overlay selectedPixel={selectedPixel} changePixel={changePixel} />
      </>
    );
  } else {
    return (
      <>
        <div className="grid place-items-center h-screen">
          <div className="animate-spin inline-block w-20 h-20 border-[3px] border-current border-t-transparent text-yellow-1000 rounded-full" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </>
    );
  }
}

export default RedditPlaces;
