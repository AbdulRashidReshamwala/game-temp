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
            style={{ paddingLeft: "0px", paddingRight: "0px" }}
          >
            <Image
              src={`${window.location.origin}/assets/rolly/images/${images[id]}`}
              style={{
                width: "100%",
                borderStyle: " solid",
                borderColor: " #b3743d",
                borderImage:
                  "linear-gradient(30deg, #b3743d 0%, #d0a987 50%, #b3743d 100%)",
                borderImageSlice: "1",
              }}
            />
            <br />
            <br />
            <TicketCol key={id} data={row} fun={putData} colId={id}></TicketCol>
          </Col>
        ))}
      </Row>
    </>
  );
}
