import React, { useEffect, useState } from "react";
import "./Spinner.css";

export default function Spinner({ spining, result, data, speed, draw }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (spining) {
        setIndex((index + 1) % data.length);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [spining, data, index, speed]);

  return <>{spining ? draw(data[index]) : draw(data[result])}</>;
}
