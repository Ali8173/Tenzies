import React from "react";

const Die = (props) => {
  return (
    <button
      aria-label={`Die with a value of ${props.value}, ${
        props.isHeld ? "is Held" : "Not Held"
      }`}
      aria-pressed={props.isHeld}
      onClick={props.hold}
      style={{ backgroundColor: props.isHeld ? "#59E391" : "whiteSmoke" }}
      className="px-6 py-3 shadow-lg bg-gray-150 shadow-gray-400 rounded-lg font-bold text-2xl cursor-pointer"
    >
      {props.value}
    </button>
  );
};

export default Die;
