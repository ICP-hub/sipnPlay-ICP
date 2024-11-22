import React from "react";
import PrivateLayout from "../../../playsipnPlay-ICP-frontend/src/Layout/PrivateLayout";
import notFoundToy from "../../../sipnPlay-ICP-frontend/src/assets/images/notFoundToy.png";

const NotFound = () => {
  return (
    <PrivateLayout>
      {/* MOST STYLES ARE INLINE BECAUSE THEY DON'T WORK WITH TAILWIND */}
      <div className="relative font-adam flex flex-col justify-center items-center">
        <div style={{ position: "relative", marginTop: "5rem" }}>
          <img
            src={notFoundToy}
            alt="not-found-toy"
            style={{
              position: "absolute",
              right: "-25%",
              top: "-50%",
              translateX: "50%",
            }}
            className="position-target"
          />
          <h1 style={{ fontSize: "8rem", fontWeight: 900 }}>
            Ooops
            <span
              style={{
                transform: "rotate(45deg)",
                fontWeight: 900,
                fontSize: "8rem",
              }}
            >
              !
            </span>
            <span
              style={{
                transform: "rotate(145deg)",
                fontWeight: 900,
                fontSize: "8rem",
              }}
            >
              !
            </span>
          </h1>
        </div>
        <h2 style={{ fontSize: "16rem", fontWeight: 600, marginTop: "-6rem" }}>
          404
        </h2>
        <h3 style={{ fontSize: "3rem", fontWeight: 300, marginTop: "-6rem" }}>
          Page Not Found
        </h3>
      </div>
    </PrivateLayout>
  );
};

export default NotFound;
