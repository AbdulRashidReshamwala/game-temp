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

  return (
    <div>
      <div className="led-box">
        <div className="led-yellow"></div>
        <p>OK</p>
      </div>
      <div>
        {spining ? (
          <div className="roll">
            <div id="blur">{draw(data[index])}</div>
          </div>
        ) : (
          <div className="roll">{draw(data[result])}</div>
        )}
      </div>
    </div>
  );
}
