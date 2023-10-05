"use client";

import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitle = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString("The help of Ai")
          .start()
          .pauseFor(1000)
          .deleteAll()
          .typeString("AI assistant")
          .start()
          .pauseFor(1000)
          .deleteAll()
          .typeString("Smart notes")
          .start()
          .pauseFor(1000)
          .deleteAll()
          .typeString("Free of cost")
          .start().pauseFor(1000)
      }}
    />
  );
};

export default TypewriterTitle;
