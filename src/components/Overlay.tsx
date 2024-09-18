/* eslint-disable @next/next/no-img-element */

"use client";
import React, { memo, useEffect, useRef } from "react";
import Image from "next/image";

let selectedPaletteColour = "red";
let mainPanel: HTMLDivElement | null = null;
let palette: HTMLDivElement | null = null;
let showPanelBtn: HTMLDivElement | null = null;
let closeBtn: HTMLDivElement | null = null;

const togglePanel = (e: MouseEvent) => {
  mainPanel?.classList.toggle("hidden");
  showPanelBtn?.classList.toggle("hidden");
};
const paletteClick = (e: MouseEvent) => {
  let targetElement = e.target as HTMLDivElement;
  if (targetElement.id == "paletteGrid") {
    return;
  }
  document
    .getElementById(selectedPaletteColour)
    ?.classList.toggle("border-black");
  document
    .getElementById(selectedPaletteColour)
    ?.classList.toggle("border-gray-300");
  targetElement.classList.toggle("border-black");
  targetElement.classList.toggle("border-gray-300");
  selectedPaletteColour = targetElement.id.toString();
};

const Overlay = memo(function Overlay({
  selectedPixel,
  changePixel,
}: {
  selectedPixel: any;
  changePixel: any;
}) {
  const mainPanelRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const showPanelBtnRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mainPanel = mainPanelRef.current;
    palette = paletteRef.current;
    showPanelBtn = showPanelBtnRef.current;
    closeBtn = closeBtnRef.current;
  });
  useEffect(() => {
    showPanelBtn?.addEventListener("click", togglePanel);
    closeBtn?.addEventListener("click", togglePanel);
    palette?.addEventListener("click", paletteClick);
    return () => {
      showPanelBtn?.removeEventListener("click", togglePanel);
      closeBtn?.removeEventListener("click", togglePanel);
      palette?.removeEventListener("click", paletteClick);
    };
  }, []);
  return (
    <>
      <div
        ref={showPanelBtnRef}
        role="button"
        className="group fixed bottom-5 left-1/2 h-20 w-1/5 -translate-x-1/2 rounded-full border-2 border-black bg-gray-50 transition-all delay-100 duration-300 ease-in-out hover:bg-gray-400"
        style={{
          maxWidth: "160px",
          minWidth: "80px",
        }}
      >
        <div className="fixed bottom-1/2 left-1/2 h-10 w-10 -translate-x-1/2 translate-y-1/2 p-1">
          <Image
            fill
            src="/images/picker-button-svg.svg"
            className="transition-all delay-100 duration-300 ease-in-out group-hover:scale-110"
            alt="Palette"
          ></Image>
        </div>
      </div>
      <div
        ref={mainPanelRef}
        className="fixed bottom-1 left-1/2 hidden h-1/5 w-3/4 -translate-x-1/2 rounded border-2 border-black bg-gray-50 p-1"
        style={{
          maxHeight: "150px",
          maxWidth: "650px",
          minWidth: "250px",
          minHeight: "100px",
        }}
      >
        <div
          ref={closeBtnRef}
          role="button"
          className="absolute left-full top-0 h-5 w-5 -translate-x-full p-1 sm:h-10 sm:w-10"
        >
          <Image
            fill
            src="/images/close-button-svg.svg"
            className="p-1 transition-all delay-100 duration-300 ease-in-out hover:scale-110"
            alt="Close"
          ></Image>
        </div>

        <div className="absolute top-0 h-full w-1/3">
          <div className="flex justify-center">
            <button
              id="SelectBtn"
              onClick={() => {
                changePixel(selectedPaletteColour);
                document
                  .getElementById("SelectBtn")
                  ?.classList.toggle("bg-gray-400");
                setTimeout(
                  () =>
                    document
                      .getElementById("SelectBtn")
                      ?.classList.toggle("bg-gray-400"),
                  150,
                );
              }}
              className="m-1 w-4/5 rounded-full border-2 border-black bg-white px-6 py-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40"
            >
              <p className="flex justify-center text-2xl text-black">✓</p>
            </button>
          </div>
          <div
            ref={infoPanelRef}
            className="absolute top-3/4 h-1/5 w-full -translate-y-1 text-xs font-bold text-black"
          >
            <p className="m-1 flex justify-center">{`Pixel: [${selectedPixel.X} , ${selectedPixel.Y}]`}</p>
          </div>
        </div>

        <div
          id="palette"
          ref={paletteRef}
          className="absolute left-1/3 top-0 h-full w-3/5 p-1"
        >
          <div
            id="paletteGrid"
            className="grid h-full grid-cols-4 items-center justify-items-center gap-1 overflow-y-auto rounded-sm border-2 p-1 sm:grid-cols-8"
          >
            <div
              id="red"
              className="h-5 w-5 rounded-full border-2 border-black bg-red-700 shadow hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="white"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="black"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-black hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="green"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-green-700 hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="blue"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-blue-700 hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="cyan"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-cyan-700 hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="pink"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-pink-700 hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="orange"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-orange-700 hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="purple"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-purple-700 hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="gray"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-gray-700 hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="yellow"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-yellow-500 hover:scale-105 sm:h-8 sm:w-8"
            ></div>
            <div
              id="indigo"
              className="h-5 w-5 rounded-full border-2 border-gray-300 bg-indigo-700 hover:scale-105 sm:h-8 sm:w-8"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Overlay;
