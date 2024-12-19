import React, { useState } from "react";

const GamesNav = () => {
  const [activeLink, setActiveLink] = useState("home");

  function handleLinkClick(section) {
    setActiveLink(section);
  }
  return (
    <div>
      <div
        style={{
          background: "linear-gradient(to top, #ffffff27,  #99999927)",
        }}
        className="flex flex-grow md:flex-col justify-around md:justify-start gap-2 md:gap-4 py-2 sm:py-4 text-xs sm:text-sm md:text-md lg:text-lg md:ps-8 md:pe-16 px-8 h-full md:border-r-2 md:border-t-2 md:border-b-2 border-[#3f3939] md:rounded-r-2xl"
      >
        <div
          onClick={() => handleLinkClick("home")}
          className="cursor-pointer font-adam font-semibold"
        >
          <p
            className={`${
              activeLink === "home"
                ? "text-[#ee3ec9]"
                : "text-white hover:text-[#fdb6ee]"
            } transition-colors duration-300`}
          >
            Home
          </p>
        </div>
        <div
          onClick={() => handleLinkClick("recently-played")}
          className="cursor-pointer  font-adam font-semibold"
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
          className="cursor-pointer  font-adam font-semibold"
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
          className="cursor-pointer  font-adam font-semibold"
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
