import React from "react";
import TicketCol from "./TicketCol/TicketCol";
import { Row, Col, Image } from "react-bootstrap";

const images = ["bell.png", "cherry.png", "bar.png", "m.png", "leaf.png"];

export default function Ticket({ data, putData }) {
	return (
		<>
			<Row className="d-flex  justify-content-center">
				{data.map((row, id) => (
					<Col
						xs={2}
						key={id}
						style={{
							paddingLeft: "0px",
							paddingRight: "0px",
						}}
					>
						<Image
							src={`${window.location.origin}/assets/rolly/images/${images[id]}`}
							style={{
								paddingTop: "2vh",
								paddingBottom: "2vh",
								width: "100%",
								border: " 5px solid",
								backgroundColor: "black",
								borderImage:
									"linear-gradient(180deg, #faf282 0%, #a06b21 50%, #d8bf5c 100%, #a36d25)",
								borderImageSlice: "1",
							}}
						/>
						<div style={{ height: "2vh" }}></div>
						<TicketCol key={id} data={row} fun={putData} colId={id}></TicketCol>
					</Col>
				))}
			</Row>
		</>
	);
}
