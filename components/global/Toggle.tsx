"use client";

import clsx from "clsx";
import React, { useState } from "react";

interface ToggleProps {
  options: string[]; // Array of option labels
  selected: number; // Index of the currently selected option (defaults to 0)
  onChange: (value: string) => void; // Function to handle option change
}

const Toggle: React.FC<ToggleProps> = ({ options, selected = 0, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(selected);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onChange(options[index]); // Call the provided onChange function if available
  };

  const optionElements = options.map((option, index) => (
    <div
      key={option}
      className={`flex h-full w-full cursor-pointer items-center justify-center `}
      onClick={() => handleClick(index)}
    >
      {option}
    </div>
  ));

  return (
    <div
      className={clsx(
        options.length === 2 ? "w-1/4" : "w-1/3",
        "relative z-0 flex h-10 items-center rounded border border-base-300",
      )}
    >
      {optionElements}
      <span
        className={clsx(
          activeIndex === 0 && options.length === 3 && "left-0",
          activeIndex === 1 && options.length === 3 && "left-1/3",
          activeIndex === 2 && options.length === 3 && "left-2/3",
          activeIndex === 0 && options.length === 2 && "left-0",
          activeIndex === 1 && options.length === 2 && "left-1/2",
          activeIndex === 0 && options.length === 2
            ? "bg-base-300"
            : "bg-info/80",
          options.length === 2 ? "w-1/2" : "w-1/3",
          "text-bg-100 absolute flex h-full items-center justify-center rounded transition-all",
        )}
      >
        {options[activeIndex]}
      </span>
    </div>
  );
};

export default Toggle;
