import React from "react";
import "./DotLoader.css";

const DotLoader = ({ dotSize }) => {
  return (
    <div className="loader flex justify-center">
      <div
        style={{ height: dotSize, width: dotSize }}
        className={`colored-dot`}
      ></div>
      <div
        style={{ height: dotSize, width: dotSize }}
        className={`dot dot-1`}
      ></div>
      <div
        style={{ height: dotSize, width: dotSize }}
        className={`dot dot-2`}
      ></div>
      <div
        style={{ height: dotSize, width: dotSize }}
        className={`dot dot-3`}
      ></div>
      <div
        style={{ height: dotSize, width: dotSize }}
        className={`dot dot-4`}
      ></div>
    </div>
  );
};

export default DotLoader;
