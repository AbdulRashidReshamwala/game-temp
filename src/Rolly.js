import React, { useState, useEffect } from "react";
import Spinner from "./components/Spinner/Spinner";
import Ticket from "./components/Ticket/Ticket";
import { Container, Row, Col, Image, Jumbotron } from "react-bootstrap";
import db from "./firbase";
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
	const [status, setStatus] = useState("loading");
	const [answers, setAnswers] = useState([]);
	const [data, setData] = useState(Array(5).fill(Array(12).fill(99)));
	const [index, setIndex] = useState(-1);
	const [active, setActive] = useState(true);
	const [current, setCurrent] = useState(null);

	var audio = new Audio(`${window.location.origin}/assets/c.mp3`);
	var spinSound = new Audio(`${window.location.origin}/assets/spin.mp3`);

	useEffect(() => {
		if (status === "active") {
			if (index < answers.length - 1) {
				setTimeout(() => {
					setSpinning(true);
					setIndex(index + 1);
					setCurrent(null);
				}, 10000);
			}
			setTimeout(() => {
				setActive(false);
			}, 10000);
			setTimeout(() => {
				setSpinning(false);
				setActive(true);
			}, 2000);
		}
	}, [index, answers.length, status]);

	useEffect(() => {
		const unsubscribe = db
			.collection("events")
			.doc("flowers-rolly-base-1587571664")
			.onSnapshot(
				(doc) => {
					let data = doc.data();
					console.log(data);
					setAnswers(data.meta);
					setStatus("active");
					setIndex(0);
				},
				(err) => {
					console.log(err);
				}
			);
		return () => unsubscribe();
	}, []);

	const addData = (rowId, colId, number) => {
		let n = [...data];
		let j = [...n[rowId]];
		j[colId] = number;
		n[rowId] = j;
		setData(n);
	};
	const replaceData = (rowId, colId, number, current) => {
		let n = [...data];
		let j = [...n[rowId]];
		j[colId] = number;
		n[rowId] = j;
		j = [...n[current[0]]];
		j[current[1]] = 99;
		n[current[0]] = j;
		setData(n);
	};

	const verifyPlacement = (rowId, colId, value) => {
		if (value.row !== rowId && value.row !== 5) {
			console.log("wrong row");
			return false;
		}
		value = value.number;

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
		audio.play();
		if (active) {
			//if already data there undo
			if (data[rowId][colId] === answers[index].number) {
				addData(rowId, colId, 99);
				setCurrent(null);
			} else if (current) {
				console.log("replace");
				if (verifyPlacement(rowId, colId, answers[index])) {
					replaceData(rowId, colId, answers[index].number, current);
					setCurrent([rowId, colId]);
				}
			} else {
				console.log("add");
				if (verifyPlacement(rowId, colId, answers[index])) {
					addData(rowId, colId, answers[index].number);
					setCurrent([rowId, colId]);
				}
			}
		}
	};

	document.getElementById(
		"root"
	).style.backgroundImage = `url("${window.location.origin}/assets/rolly/bg.png")`;

	return (
		<div style={{ minHeight: "100%", textAlign: "center" }}>
			{index > -1 ? (
				<>
					<Container>
						<div className="d-lg-none d-md-none">
							<div className="d-flex justify-content-center">
								<Row>
									<Col>
										<Spinner
											spining={spinning}
											result={answers[index].row}
											speed={200}
											data={images}
											draw={(item) => (
												<>
													{spinning ? (
														<div className="roll">
															<div
																id="inner-spin"
																style={{ filter: "blur(10px)" }}
															>
																<Image
																	fluid
																	src={`${window.location.origin}/assets/rolly/images/${item}`}
																	style={{
																		height: "10vh",
																		width: "10vh",
																	}}
																/>
															</div>
														</div>
													) : (
														<div className="roll">
															<div id="inner-spin">
																<Image
																	fluid
																	src={`${window.location.origin}/assets/rolly/images/${item}`}
																	style={{
																		height: "10vh",
																		width: "10vh",
																	}}
																/>
															</div>
														</div>
													)}
												</>
											)}
										></Spinner>
									</Col>
									<Col>
										<Spinner
											spining={spinning}
											result={index}
											speed={200}
											data={answers}
											draw={(item) => (
												<>
													{spinning ? (
														<div className="roll" style={{ width: "12vh" }}>
															<div
																id="inner-spin"
																style={{
																	fontSize: "3rem",
																	filter: "blur(10px)",
																}}
															>
																{item.number}
															</div>
														</div>
													) : (
														<div className="roll" style={{ width: "12vh" }}>
															<div id="inner-spin" style={{ fontSize: "3rem" }}>
																{item.number}
															</div>
														</div>
													)}
												</>
											)}
										></Spinner>
									</Col>
								</Row>
							</div>
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
													<>
														{spinning ? (
															<div className="roll">
																<div
																	className="inner-spin"
																	style={{ filter: "blur(10px)" }}
																>
																	<Image
																		fluid
																		src={`${window.location.origin}/assets/rolly/images/${item}`}
																		style={{
																			height: "12vh",
																			width: "100%",
																		}}
																	/>
																</div>
															</div>
														) : (
															<div className="roll">
																<div className="inner-spin">
																	<Image
																		fluid
																		src={`${window.location.origin}/assets/rolly/images/${item}`}
																		style={{
																			height: "12vh",
																			width: "100%",
																		}}
																	/>
																</div>
															</div>
														)}
													</>
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
													<>
														{spinning ? (
															<>
																<div className="roll">
																	<div
																		id="inner-spin"
																		style={{ filter: "blur(10px)" }}
																	>
																		{item.number}
																	</div>
																</div>
															</>
														) : (
															<>
																<div className="roll">
																	<div id="inner-spin">{item.number}</div>
																</div>
															</>
														)}
													</>
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
