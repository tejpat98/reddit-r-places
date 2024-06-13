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
  document.getElementById(selectedPaletteColour)?.classList.toggle("border-black");
  document.getElementById(selectedPaletteColour)?.classList.toggle("border-gray-300");
  targetElement.classList.toggle("border-black");
  targetElement.classList.toggle("border-gray-300");
  selectedPaletteColour = targetElement.id.toString();
};

const Overlay = memo(function Overlay({ selectedPixel, changePixel }: { selectedPixel: any; changePixel: any }) {
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
        className="fixed group bg-gray-50 w-1/5 h-20 bottom-5 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 delay-100 ease-in-out border-black border-2 hover:bg-gray-400"
        style={{
          maxWidth: "160px",
          minWidth: "80px",
        }}
      >
        <div className="fixed bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 p-1 w-10 h-10 ">
          <Image fill src="/images/picker-button-svg.svg" className="transition-all duration-300 delay-100 ease-in-out group-hover:scale-110" alt="Palette"></Image>
        </div>
      </div>
      <div
        ref={mainPanelRef}
        className=" hidden fixed bg-gray-50 border-black border-2 rounded p-1 w-3/4 h-1/5 left-1/2 -translate-x-1/2 bottom-1 "
        style={{
          maxHeight: "150px",
          maxWidth: "650px",
          minWidth: "250px",
          minHeight: "100px",
        }}
      >
        <div ref={closeBtnRef} role="button" className="absolute top-0 left-full -translate-x-full p-1 sm:w-10 sm:h-10 w-5 h-5">
          <Image fill src="/images/close-button-svg.svg" className="p-1 transition-all duration-300 delay-100 ease-in-out hover:scale-110" alt="Close"></Image>
        </div>

        <div className="absolute top-0 w-1/3 h-full">
          <div className="flex justify-center">
            <button
              id="SelectBtn"
              onClick={() => {
                changePixel(selectedPaletteColour);
                document.getElementById("SelectBtn")?.classList.toggle("bg-gray-400");
                setTimeout(() => document.getElementById("SelectBtn")?.classList.toggle("bg-gray-400"), 150);
              }}
              className="m-1 w-4/5 border-2 border-black rounded-full bg-white py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105"
            >
              <p className="flex justify-center text-black text-2xl">✓</p>
            </button>
          </div>
          <div ref={infoPanelRef} className="absolute text-black font-bold text-xs top-3/4 w-full h-1/5 -translate-y-1">
            <p className="m-1 flex justify-center">{`Pixel: [${selectedPixel.X} , ${selectedPixel.Y}]`}</p>
          </div>
        </div>

        <div id="palette" ref={paletteRef} className="absolute top-0 left-1/3 p-1 h-full w-3/5">
          <div id="paletteGrid" className="grid sm:grid-cols-8 grid-cols-4 gap-1 h-full border-2 rounded-sm p-1 justify-items-center items-center overflow-y-auto">
            <div id="red" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-red-700 border-black border-2 rounded-full shadow"></div>
            <div id="white" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-white border-gray-300 border-2 rounded-full"></div>
            <div id="black" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-black border-gray-300 border-2 rounded-full"></div>
            <div id="green" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-green-700  border-gray-300 border-2 rounded-full"></div>
            <div id="blue" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-blue-700 border-gray-300 border-2 rounded-full"></div>
            <div id="cyan" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-cyan-700  border-gray-300 border-2 rounded-full"></div>
            <div id="pink" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-pink-700 border-gray-300 border-2 rounded-full"></div>
            <div id="orange" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-orange-700 border-gray-300 border-2 rounded-full"></div>
            <div id="purple" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-purple-700 border-gray-300 border-2 rounded-full"></div>
            <div id="gray" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-gray-700 border-gray-300 border-2 rounded-full"></div>
            <div id="yellow" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-yellow-500 border-gray-300 border-2 rounded-full"></div>
            <div id="indigo" className="w-5 h-5 sm:w-8 sm:h-8 hover:scale-105 bg-indigo-700 border-gray-300 border-2 rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Overlay;
