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
			<div>
				{spining ? (
					<div
						style={{
							textAlign: "center",
							color: "orange",
							border: "7px solid",
							borderColor: " #b3743d",
							borderImage:
								"linear-gradient(30deg, #b3743d 0%, #d0a987 50%, #b3743d 100%)",
							borderImageSlice: "1",
							fontFamily: "Dotted",
						}}
					>
						<div id="blur">{draw(data[index])}</div>
					</div>
				) : (
					<div
						style={{
							textAlign: "center",
							color: "orange",
							border: "7px solid",
							borderColor: " #b3743d",
							borderImage:
								"linear-gradient(30deg, #b3743d 0%, #d0a987 50%, #b3743d 100%)",
							borderImageSlice: "1",
							fontFamily: "Dotted",
						}}
					>
						{draw(data[result])}
					</div>
				)}
			</div>
		</div>
	);
}
