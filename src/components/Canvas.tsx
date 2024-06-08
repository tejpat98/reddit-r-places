/* eslint-disable @next/next/no-img-element */

"use client";
import React, { memo, useEffect, useRef } from "react";
import NextImage from "next/image";
let canvas: HTMLCanvasElement | null = null;
let div: HTMLDivElement | null = null;
let selector: HTMLImageElement | null = null;
let ctx: CanvasRenderingContext2D;
let gridData: ImageData;
let rPlace = { width: 100, height: 100, startX: 0, startY: 0 };
let panOffset = { dx: 0, dy: 0 };
let selectorOffset = { dx: 0, dy: 0 };
let selectorPos = { X: 0, Y: 0 };
let zoomScale = 1;
let current = { X: 0, Y: 0 };
let mouseDownStart = { X: 0, Y: 0 };
let canvasClickAt = { downX: 0, downY: 0, upX: 0, upY: 0 };
let isMouseDown = false;
const redraw = (PixelChanges: any[], PixelTypes: any[]) => {
  PixelChanges.forEach((change) => {
    //Find PixelType with matching colourID to get RGB values
    var { RGB } = PixelTypes.find((e) => e.colourID === change.colourID);
    var offsetY = 4 * rPlace.width * change.Y;
    var offsetX = 4 * change.X;
    var totalOffset = offsetY + offsetX;
    //set RGB value for the pixel
    gridData.data[totalOffset] = RGB[0];
    gridData.data[totalOffset + 1] = RGB[1];
    gridData.data[totalOffset + 2] = RGB[2];
  });
  ctx.putImageData(gridData, 0, 0);
};
const setTransform = () => {
  var totalSelectorOffset = {
    dx: panOffset.dx + selectorOffset.dx + (1 * zoomScale - 1) / 2,
    dy: panOffset.dy + selectorOffset.dy + (1 * zoomScale - 1) / 2,
  };

  canvas!.style.transform = `translate(${panOffset.dx}px, ${panOffset.dy}px) scale(${zoomScale})`;

  selector!.style.transform = `translate(${totalSelectorOffset.dx}px, ${totalSelectorOffset.dy}px) scale(${zoomScale * 1.2})`;
};
const mouseSCROLL = (e: WheelEvent) => {
  //set scale value on canvas
  if (e.deltaY < 0 && zoomScale < 20) {
    zoomScale *= 1.1;
  } else if (e.deltaY > 0 && zoomScale > 0.5) {
    zoomScale /= 1.1;
  }

  //size of a pixel at current zoomScale (pixels by default are size of 1)
  var pixelSize = 1 * zoomScale;
  //Recalculate the selectorOffset for new zoomScale
  selectorOffset.dx = pixelSize * selectorPos.X;
  selectorOffset.dy = pixelSize * selectorPos.Y;

  setTransform();
};
const mouseMOVE = (e: MouseEvent) => {
  if (isMouseDown) {
    //if panning --> update the panOffset
    panOffset.dx = e.clientX - mouseDownStart.X;
    panOffset.dy = e.clientY - mouseDownStart.Y;

    setTransform();
  }

  //current will give x,y where the top-left will be (0,0) and bottom-right (width * zoomScale, height * zoomScale)
  current.X = e.clientX - panOffset.dx - rPlace.startX;
  current.Y = e.clientY - panOffset.dy - rPlace.startY;
};
const mouseDOWN = (e: MouseEvent) => {
  e.preventDefault();
  mouseDownStart.X = e.clientX - panOffset.dx - rPlace.startX;
  mouseDownStart.Y = e.clientY - panOffset.dy - rPlace.startY;
  isMouseDown = true;
  // console.log(
  //   `current.X: ${current.X}, current.Y: ${current.Y} | zoomScale: ${zoomScale}`
  // );
};
const mouseUP = (e: MouseEvent) => {
  e.preventDefault();
  isMouseDown = false;
};
const mouseLEAVE = (e: MouseEvent) => {
  // When mouse cursor moves out of the window element
  if (isMouseDown) {
    e.preventDefault();
    isMouseDown = false;
  }
};
const windowResize = () => {};

const Canvas = memo(function Canvas({ setSelectedPixel, PixelChanges, PixelTypes }: { setSelectedPixel: any; PixelChanges: any[]; PixelTypes: any[] }) {
  const canvasDivRef = useRef<HTMLCanvasElement>(null);
  const DivRef = useRef<HTMLDivElement>(null);
  const selectorImgRef = useRef<HTMLImageElement>(null);
  const isImageLoading = useRef<Boolean>(true);
  const canvasClick = (e: MouseEvent) => {
    e.preventDefault();

    if (e.type === "mousedown") {
      canvasClickAt.downX = e.clientX;
      canvasClickAt.downY = e.clientY;
    }
    if (e.type === "mouseup") {
      canvasClickAt.upX = e.clientX;
      canvasClickAt.upY = e.clientY;
      var deltaX = Math.abs(canvasClickAt.downX - canvasClickAt.upX);
      var deltaY = Math.abs(canvasClickAt.downY - canvasClickAt.upY);
      if (deltaX > 5 || deltaY > 5) {
        //significant delta x or y between mouse down and up --> user is probably panning
      } else {
        //move selector to the pixel that was clicked
        //size of a pixel at current zoomScale (pixels by default are size of 1)
        var pixelSize = 1 * zoomScale;
        //which pixel was clicked on the rPlace grid
        selectorPos.X = Math.floor(current.X / pixelSize);
        selectorPos.Y = Math.floor(current.Y / pixelSize);

        //Calculate the offset to put selector onto the selectorPos
        selectorOffset.dx = pixelSize * selectorPos.X;
        selectorOffset.dy = pixelSize * selectorPos.Y;
        //Set selectedPixel useState for rPlaces
        setSelectedPixel({ X: selectorPos.X, Y: selectorPos.Y, Colour: "blue" });
        //console.log("selected pixel: " + selectorPos.X, selectorPos.Y);
        setTransform();
      }
    }
  };
  useEffect(() => {
    canvas = canvasDivRef.current;
    div = DivRef.current;
    selector = selectorImgRef.current;

    ctx = canvas!.getContext("2d")!;

    if (isImageLoading.current == false) {
      //extract imageData obj
      gridData = ctx.getImageData(0, 0, rPlace.width, rPlace.height);
      //redraw with lastest changes
      redraw(PixelChanges, PixelTypes);
    }
  });
  useEffect(() => {
    var gridImg = new Image();
    gridImg.src = "/images/rplace-grid.png";
    gridImg.onload = () => {
      isImageLoading.current = false;
      //draw inital grid from PNG
      ctx.drawImage(gridImg, 0, 0);
    };
  }, []);
  useEffect(() => {
    canvas!.style.transformOrigin = `${0}px ${0}px`;
    canvas!.style.scale = `${zoomScale}`;
    canvas!.width = rPlace.width;
    canvas!.height = rPlace.height;

    selector!.style.top = `${0}px`;
    selector!.style.left = `${0}px`;

    div?.addEventListener("wheel", mouseSCROLL);
    div?.addEventListener("mousemove", mouseMOVE);
    div?.addEventListener("mousedown", mouseDOWN);
    div?.addEventListener("mouseup", mouseUP);
    div?.addEventListener("mouseleave", mouseLEAVE);
    canvas?.addEventListener("mousedown", canvasClick);
    canvas?.addEventListener("mouseup", canvasClick);

    window.addEventListener("resize", windowResize);

    return () => {
      //The cleanup function runs during unmount, and before every re-render with changed dependencies.

      div?.removeEventListener("wheel", mouseSCROLL);
      div?.removeEventListener("mousemove", mouseMOVE);
      div?.removeEventListener("mousedown", mouseDOWN);
      div?.removeEventListener("mouseup", mouseUP);
      div?.removeEventListener("mouseleave", mouseLEAVE);
      canvas?.removeEventListener("mousedown", canvasClick);
      canvas?.removeEventListener("mouseup", canvasClick);

      window.removeEventListener("resize", windowResize);
    };
  }, []);
  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden" style={{ scale: 1 }} ref={DivRef}>
        <canvas
          ref={canvasDivRef}
          style={{
            imageRendering: "pixelated",
            scale: 1,
          }}
          width={""}
          height={""}
          className="absolute"
        ></canvas>

        <NextImage
          ref={selectorImgRef}
          src={"/images/pixel-select.svg"}
          z-index={20}
          style={{
            scale: 1,
          }}
          alt="Selector"
          width={`${1}`}
          height={`${1}`}
          className="absolute shadow-2xl"
        ></NextImage>
      </div>
    </>
  );
});

export default Canvas;
