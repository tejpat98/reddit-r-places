"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Canvas from "./Canvas";
import Overlay from "./Overlay";

type gridDetails = { PixelTypes: any[]; gridSize: number };

let socket: any;
function RedditPlaces() {
  const [selectedPixel, setSelectedPixel] = useState({ X: 0, Y: 0 });
  const [PixelChanges, setPixelChanges] = useState<Array<any>>([]);
  const [gridDetails, setGridDetails] = useState<gridDetails>();
  const [isSocketConnected, setIsSocketConnected] = useState<Boolean>(false);

  const socketInitializer = async () => {
    socket = io({
      path: "/api/socket",
      addTrailingSlash: false,
      autoConnect: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 500,
    });
    socket.on("connect", () => {
      setIsSocketConnected(true);
      console.log("Connected to server, my id: " + socket.id);
    });
    socket.on("connect_error", (err: any) => {
      //console.log("error: ", err);
    });
    socket.on("pixel-update", (data: any) => {
      var { X, Y, colourID } = data;
      setPixelChanges((prevPixelChanges: any[]) => [...prevPixelChanges, data]);
      console.log(`pixel-update: {X: ${X}, Y: ${Y}, colourID: ${colourID}}`);
    });
  };
  const changePixel = async (selectedPaletteColour: String) => {
    if (!gridDetails) {
      fetchGridDetails();
    }
    var { colourID } = gridDetails!.PixelTypes.find((e) => e.Name === selectedPaletteColour);
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
  const fetchGridDetails = async () => {
    await fetch("/api/grid/details")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data.PlaceConfig);
        setGridDetails({ PixelTypes: data.PlaceConfig.PixelTypes, gridSize: data.PlaceConfig.gridSize });
      });
  };
  const fetchPixelChanges = async () => {
    await fetch("/api/pixel/changes")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPixelChanges((prevPixelChanges: any[]) => [...prevPixelChanges, ...data]);
      });
  };
  useEffect(() => {
    socketInitializer();
    fetchPixelChanges();
    fetchGridDetails();

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("pixel-update");
      socket.disconnect();

      setIsSocketConnected(false);
    };
  }, []);

  return (
    <>
      {gridDetails && isSocketConnected ? (
        <>
          <Canvas setSelectedPixel={setSelectedPixel} PixelChanges={PixelChanges} gridDetails={gridDetails} />
          <Overlay selectedPixel={selectedPixel} changePixel={changePixel} />
        </>
      ) : (
        <>
          <div className="grid place-items-center h-screen">
            <div className="animate-spin inline-block w-20 h-20 border-[3px] border-current border-t-transparent text-yellow-1000 rounded-full" role="status" aria-label="loading">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default RedditPlaces;
