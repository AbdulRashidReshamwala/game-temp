import React, { useState, useEffect } from "react";
import Spinner from "./components/Spinner/Spinner";
import Ticket from "./components/Ticket/Ticket";
import { Container, Row, Col, Image, Jumbotron } from "react-bootstrap";
import "./Rolly.css";

const images = [
	"bell.png",
	"cherry.png",
	"bar.png",
	"m.png",
	"leaf.png",
	"wild.png",
];

export default function Rolly() {
	const [spinning, setSpinning] = useState(true);
	const answers = [
		{ number: 20, row: 4 },
		// { number: 5, row: 0 },
		{ number: 34, row: 5 },
		{ number: 32, row: 5 },
		// { number: 7, row: 2 },
		// { number: 30, row: 4 },
		// { number: 9, row: 4 },
		// { number: 8, row: 3 },
		// { number: 1, row: 1 },
		// { number: 13, row: 3 },
		// { number: 4, row: 4 },
		// { number: 11, row: 1 },
		// { number: 21, row: 0 },
		// { number: 3, row: 3 },
		// { number: 23, row: 2 },
		// { number: 25, row: 4 },
		// { number: 24, row: 3 },
		// { number: 6, row: 1 },
		// { number: 2, row: 2 },
		// { number: 27, row: 1 },
		// { number: 18, row: 3 },
		// { number: 14, row: 4 },
		// { number: 22, row: 1 },
		// { number: 12, row: 2 },
		// { number: 15, row: 0 },
		// { number: 26, row: 0 },
		// { number: 16, row: 1 },
		// { number: 17, row: 2 },
		// { number: 28, row: 2 },
		// { number: 29, row: 3 },
		// { number: 10, row: 0 },
		{ number: 42, row: 5 },
		{ number: 55, row: 5 },
		{ number: 45, row: 5 },
		{ number: 35, row: 5 },
		{ number: 57, row: 5 },
		{ number: 78, row: 5 },
		{ number: 49, row: 5 },
		{ number: 90, row: 5 },
	];

	const [data, setData] = useState(Array(5).fill(Array(12).fill(99)));
	const [index, setIndex] = useState(0);
	const [active, setActive] = useState(true);

	useEffect(() => {
		if (index < answers.length - 1) {
			setTimeout(() => {
				setSpinning(true);
				setIndex(index + 1);
			}, 5000);
		}
		setTimeout(() => {
			setActive(false);
		}, 5000);
		setTimeout(() => {
			setSpinning(false);
			setActive(true);
		}, 2000);
	}, [index, answers.length]);

	const verifyPlacement = (rowId, colId, value) => {
		if (value.row !== rowId && value.row !== 5) {
			alert(`${value.row + 1} is active but ${rowId + 1} was clicked`);
			return false;
		}
		value = value.number;
		if (data[rowId][colId] !== 99) {
			alert("stop should be empty");
			return false;
		}
		let topElements = data[rowId].slice(0, colId);
		topElements = topElements.filter((ele) => {
			return ele !== 99;
		});
		let bottomElements = data[rowId].slice(colId + 1, 12);
		bottomElements = bottomElements.filter((ele) => {
			return ele !== 99;
		});
		for (let i = 0; i < topElements.length; i++) {
			if (topElements[i] > value) {
				return false;
			}
		}
		for (let i = 0; i < bottomElements.length; i++) {
			if (bottomElements[i] < value) {
				return false;
			}
		}
		return true;
	};

	const putData = (colId, rowId) => {
		if (active && verifyPlacement(rowId, colId, answers[index])) {
			console.log("added");
			let n = [...data];
			let j = [...n[rowId]];
			j[colId] = answers[index].number;
			n[rowId] = j;
			setData(n);
			setActive(false);
		}
	};

	document.getElementById(
		"root"
	).style.backgroundImage = `url("${window.location.origin}/assets/rolly/bg.png")`;

	return (
		<div style={{ minHeight: "100%", textAlign: "center" }}>
			{index >= 0 ? (
				<>
					<Container style={{ textAlign: "center" }}>
						<div className="d-lg-none d-md-none">
							<Row className="hide-in-large">
								<Col className="left">
									<Spinner
										spining={spinning}
										result={answers[index].row}
										speed={100}
										data={images}
										draw={(item) => (
											<Image
												fluid
												src={`${window.location.origin}/assets/rolly/images/${item}`}
												style={{
													height: "10vh",
													width: "10vh",
												}}
											/>
										)}
									></Spinner>
								</Col>
								<Col>
									<Spinner
										spining={spinning}
										result={index}
										speed={100}
										data={answers}
										draw={(item) => (
											<div
												style={{
													height: "10vh",
													width: "10vh",
													lineHeight: "12vh",
													textAlign: "center",
													color: "orange",
													backgroundColor: "aliceblue",

													fontFamily: "Dotted",
													fontSize: "3rem",
												}}
											>
												{item.number}
											</div>
										)}
									></Spinner>
								</Col>
							</Row>
						</div>
						<Row>
							<Col className="left" sm={12} md={6} style={{ margin: "2.4rem" }}>
								<Ticket data={data} putData={putData} />
							</Col>
							<Col sm={12} md={4} style={{ margin: "2.4rem" }}>
								<Row>
									<Jumbotron
										className="rules"
										style={{ width: "100%", textAlign: "left" }}
									>
										<h3>Rules</h3>
										<p>
											<ul>
												<li>Rules</li>
												<li>Rules</li>
												<li>Rules</li>
												<li>Rules</li>
												<li>Rules</li>
											</ul>
										</p>
									</Jumbotron>
								</Row>
								<div className="hide-in-small">
									<Row>
										<Col>
											<Spinner
												spining={spinning}
												result={answers[index].row}
												speed={100}
												data={images}
												draw={(item) => (
													<Image
														fluid
														src={`${window.location.origin}/assets/rolly/images/${item}`}
														style={{
															height: "12vh",
															width: "100%",
														}}
													/>
												)}
											></Spinner>
										</Col>
										<Col>
											<Spinner
												spining={spinning}
												result={index}
												speed={100}
												data={answers}
												draw={(item) => (
													<div
														style={{
															height: "12vh",
															width: "100%",
															lineHeight: "12vh",
															textAlign: "center",
															color: "orange",
															backgroundColor: "aliceblue",

															fontFamily: "Dotted",
															fontSize: "5rem",
														}}
													>
														{item.number}
													</div>
												)}
											></Spinner>
										</Col>
									</Row>
								</div>
							</Col>
						</Row>
					</Container>
				</>
			) : (
				<h1>loading</h1>
			)}
		</div>
	);
}
