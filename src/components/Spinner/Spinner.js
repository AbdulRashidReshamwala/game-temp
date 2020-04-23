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

<<<<<<< HEAD
  return (
    <div>
      {spining ? (
        <div className="roll">
          <div id="blur">{draw(data[index])}</div>
        </div>
      ) : (
        <div className="roll">{draw(data[result])}</div>
      )}
    </div>
  );
=======
	return (
		<div>
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
>>>>>>> c3f8e9203fefd3f6a6dbb5253d927c4770127165
}
