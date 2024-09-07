import React, { useState } from "react";

const GamesNav = () => {
  const [activeLink, setActiveLink] = useState("home");

  function handleLinkClick(section) {
    setActiveLink(section);
  }
  return (
    <div>
      <div className="flex lg:flex-col justify-around lg:justify-start gap-2 md:gap-4 lg:gap-6 py-4 text-xs md:text-md lg:text-lg lg:ps-0 lg:pe-8 px-8 bg-black lg:h-dvh my-4">
        <div onClick={() => handleLinkClick("home")} className="cursor-pointer">
          <p
            className={`${
              activeLink === "home"
                ? "text-[#ee3ec9]"
                : "text-white hover:text-[#fdb6ee]"
            } transition-colors duration-100`}
          >
            Home
          </p>
        </div>
        <div
          onClick={() => handleLinkClick("recently-played")}
          className="cursor-pointer"
        >
          <p
            className={`${
              activeLink === "recently-played"
                ? "text-[#ee3ec9]"
                : "text-white hover:text-[#fdb6ee]"
            } transition-colors duration-100`}
          >
            Recently Played
          </p>
        </div>
        <div
          onClick={() => handleLinkClick("trending")}
          className="cursor-pointer"
        >
          <p
            className={`${
              activeLink === "trending"
                ? "text-[#ee3ec9]"
                : "text-white hover:text-[#fdb6ee]"
            } transition-colors duration-100`}
          >
            Trending
          </p>
        </div>
        <div
          onClick={() => handleLinkClick("most-played")}
          className="cursor-pointer"
        >
          <p
            className={`${
              activeLink === "most-played"
                ? "text-[#ee3ec9]"
                : "text-white hover:text-[#fdb6ee]"
            } transition-colors duration-100`}
          >
            Most Played
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamesNav;
