"use client";

import Image from "next/image";
import React from "react";

const ExploreButton = () => {
  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={() => console.log("Nufair")}
    >
      <a href="#events">
        Explore Events
        <Image
          src={"/icons/arrow-down.svg"}
          alt="arrow-down"
          className="mt-0.5"
          width={20}
          height={20}
        />
      </a>
    </button>
  );
};

export default ExploreButton;
