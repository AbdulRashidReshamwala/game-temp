import React from "react";
import "./TicketCol.css";

export default function TicketCol({ data, colId, fun }) {
	return (
		<>
			{data.map((ele, id) => (
				<div key={id}>
					{colId === 4 && id === 1 ? (
						<div
							className="box"
							id="block"
							style={{
								float: "right",
								backgroundColor: "#523223",
								marginRight: "-3rem",
								height: "fit-content",
							}}
						>
							BLOCK <br />
							<span id="number">1</span>
						</div>
					) : null}
					{colId === 4 && id === 5 ? (
						<div
							className="box"
							style={{
								float: "right",
								backgroundColor: "#523223",
								marginRight: "-3rem",
								height: "fit-content",
							}}
						>
							BLOCK <br />
							<span id="number">2</span>
						</div>
					) : null}
					{colId === 4 && id === 9 ? (
						<div
							className="box"
							style={{
								float: "right",
								backgroundColor: "#523223",
								marginRight: "-3rem",
								height: "fit-content",
							}}
						>
							BLOCK <br />
							<span id="number">3</span>
						</div>
					) : null}
					{colId === 0 && id === 0 ? (
						<div
							className="box"
							id="o"
							style={{
								float: "left",
								marginLeft: "-4.6rem",
								backgroundColor: "#04022e",
							}}
						>
							ODD/EVEN
						</div>
					) : null}
					{colId === 0 && id === 2 ? (
						<div
							className="box"
							id="a"
							style={{ float: "left", marginLeft: "-5rem" }}
						>
							ASCENDING
						</div>
					) : null}
					{colId === 0 && id === 6 ? (
						<div
							className="box"
							id="a"
							style={{ float: "left", marginLeft: "-5rem" }}
						>
							ASCENDING
						</div>
					) : null}
					{colId === 0 && id === 9 ? (
						<div
							className="box"
							id="a"
							style={{ float: "left", marginLeft: "-5rem" }}
						>
							ASCENDING
						</div>
					) : null}
					{colId === 0 && id === 11 ? (
						<div
							id="o"
							className="box"
							style={{
								float: "left",
								marginLeft: "-4.6rem",
								backgroundColor: "#04022e",
							}}
						>
							ODD/EVEN
						</div>
					) : null}

					<div className="ticketBox" key={id} onClick={() => fun(id, colId)}>
						<span id="element">{ele === 99 ? null : ele}</span>
					</div>
					{(id + 1) % 4 === 0 ? <div style={{ height: "1.2vh" }}></div> : null}
				</div>
			))}
		</>
	);
}
