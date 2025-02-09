/* eslint-disable @next/next/no-img-element */

"use client";
import React, { memo, useEffect, useRef } from "react";
import NextImage from "next/image";
let canvasElement: HTMLCanvasElement | null = null;
let div: HTMLDivElement | null = null;
let selectorImg: HTMLImageElement | null = null;
let ctx: CanvasRenderingContext2D;
let gridData: ImageData;
let gridImg: any;
let zoomScale = 1;
let selector = { OffsetX: 0, OffsetY: 0, X: 0, Y: 0 };
let canvas = {
  panOffsetX: 0,
  panOffsetY: 0,
  click: { downX: 0, downY: 0, upX: 0, upY: 0 },
};
let pointer = {
  isMouseDown: false,
  mouseDownStart: { X: 0, Y: 0 },
  current: { X: 0, Y: 0 },
};

const redraw = (PixelChanges: any[], gridDetails: any) => {
  PixelChanges.forEach((change) => {
    var { RGB } = gridDetails.PixelTypes.find((e: any) => e.colourID === change.colourID);
    var offsetY = 4 * gridDetails.gridSize * change.Y;
    var offsetX = 4 * change.X;
    var totalOffset = offsetY + offsetX;
    gridData.data[totalOffset] = RGB[0];
    gridData.data[totalOffset + 1] = RGB[1];
    gridData.data[totalOffset + 2] = RGB[2];
  });
  ctx.putImageData(gridData, 0, 0);
};
const setTransform = () => {
  var totalSelectorOffset = {
    dx: canvas.panOffsetX + selector.OffsetX + Math.round((1 * (zoomScale / window.devicePixelRatio) - 1) / 2),
    dy: canvas.panOffsetY + selector.OffsetY + Math.round((1 * (zoomScale / window.devicePixelRatio) - 1) / 2),
  };

  canvasElement!.style.transform = `translate(${canvas.panOffsetX}px, ${canvas.panOffsetY}px) scale(${zoomScale})`;

  selectorImg!.style.transform = `translate(${totalSelectorOffset.dx}px, ${totalSelectorOffset.dy}px) scale(${(zoomScale * 1.2) / window.devicePixelRatio})`;
};
const mouseSCROLL = (e: WheelEvent) => {
  e.preventDefault();

  if (e.deltaY < 0 && zoomScale < 20) {
    zoomScale *= 1.1;
  } else if (e.deltaY > 0 && zoomScale > 0.5) {
    zoomScale /= 1.1;
  }

  var pixelSize = 1 * zoomScale;
  selector.OffsetX = pixelSize * selector.X;
  selector.OffsetY = pixelSize * selector.Y;

  setTransform();
};
const mouseMOVE = (e: MouseEvent) => {
  if (pointer.isMouseDown) {
    canvas.panOffsetX = e.clientX - pointer.mouseDownStart.X;
    canvas.panOffsetY = e.clientY - pointer.mouseDownStart.Y;

    setTransform();
  }

  pointer.current.X = e.clientX - canvas.panOffsetX;
  pointer.current.Y = e.clientY - canvas.panOffsetY;
};
const mouseDOWN = (e: MouseEvent) => {
  e.preventDefault();
  pointer.mouseDownStart.X = e.clientX - canvas.panOffsetX;
  pointer.mouseDownStart.Y = e.clientY - canvas.panOffsetY;
  pointer.isMouseDown = true;
};
const mouseUP = (e: MouseEvent) => {
  e.preventDefault();
  pointer.isMouseDown = false;
};
const mouseLEAVE = (e: MouseEvent) => {
  if (pointer.isMouseDown) {
    e.preventDefault();
    pointer.isMouseDown = false;
  }
};
const windowResize = () => {};

const Canvas = memo(function Canvas({
  setSelectedPixel,
  PixelChanges,
  gridDetails,
}: {
  setSelectedPixel: any;
  PixelChanges: any[];
  gridDetails: any;
}) {
  const canvasDivRef = useRef<HTMLCanvasElement>(null);
  const DivRef = useRef<HTMLDivElement>(null);
  const selectorImgRef = useRef<HTMLImageElement>(null);
  const isImageLoading = useRef<Boolean>(true);
  const canvasClick = (e: MouseEvent) => {
    e.preventDefault();

    if (e.type === "mousedown") {
      canvas.click.downX = e.clientX;
      canvas.click.downY = e.clientY;
    }
    if (e.type === "mouseup") {
      canvas.click.upX = e.clientX;
      canvas.click.upY = e.clientY;
      var deltaX = Math.abs(canvas.click.downX - canvas.click.upX);
      var deltaY = Math.abs(canvas.click.downY - canvas.click.upY);
      if (deltaX > 5 || deltaY > 5) {
      } else {
        var pixelSize = 1 * zoomScale;
        selector.X = Math.floor(pointer.current.X / pixelSize);
        selector.Y = Math.floor(pointer.current.Y / pixelSize);

        selector.OffsetX = pixelSize * selector.X;
        selector.OffsetY = pixelSize * selector.Y;
        setSelectedPixel({ X: selector.X, Y: selector.Y });
        setTransform();
      }
    }
  };
  const fetchCurrentGrid = async () => {
    await fetch("/api/grid/current").then(async (res) => {
      var parsed = JSON.parse(await res.json());
      var buffer = Buffer.from(parsed.blob, "base64");
      var pngFile = new File([buffer], "grid.png", { type: "image/png" });
      var gridImgURL = URL.createObjectURL(pngFile);
      gridImg = new Image();
      gridImg.src = gridImgURL;
      gridImg.onload = () => {
        ctx.drawImage(gridImg, 0, 0);
        gridData = ctx.getImageData(0, 0, gridDetails.gridSize, gridDetails.gridSize);
        redraw(PixelChanges, gridDetails);
      };
    });
  };
  useEffect(() => {
    canvasElement = canvasDivRef.current;
    div = DivRef.current;
    selectorImg = selectorImgRef.current;

    ctx = canvasElement!.getContext("2d")!;

    if (isImageLoading.current == false) {
      redraw(PixelChanges, gridDetails);
    }
  });
  useEffect(() => {
    fetchCurrentGrid().then(() => {
      isImageLoading.current = false;
    });
  }, [gridDetails]);
  useEffect(() => {
    canvasElement!.style.transformOrigin = `${0}px ${0}px`;
    canvasElement!.style.scale = `${zoomScale}`;
    canvasElement!.width = gridDetails.gridSize;
    canvasElement!.height = gridDetails.gridSize;

    selectorImg!.style.top = `${0}px`;
    selectorImg!.style.left = `${0}px`;

    console.log(`devicePixelRatio: ${window.devicePixelRatio}`);

    div?.addEventListener("wheel", mouseSCROLL);
    div?.addEventListener("mousemove", mouseMOVE);
    div?.addEventListener("mousedown", mouseDOWN);
    div?.addEventListener("mouseup", mouseUP);
    div?.addEventListener("mouseleave", mouseLEAVE);
    canvasElement?.addEventListener("mousedown", canvasClick);
    canvasElement?.addEventListener("mouseup", canvasClick);

    window.addEventListener("resize", windowResize);

    return () => {
      div?.removeEventListener("wheel", mouseSCROLL);
      div?.removeEventListener("mousemove", mouseMOVE);
      div?.removeEventListener("mousedown", mouseDOWN);
      div?.removeEventListener("mouseup", mouseUP);
      div?.removeEventListener("mouseleave", mouseLEAVE);
      canvasElement?.removeEventListener("mousedown", canvasClick);
      canvasElement?.removeEventListener("mouseup", canvasClick);

      window.removeEventListener("resize", windowResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridDetails]);
  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden" style={{ scale: 1 }} ref={DivRef}>
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
