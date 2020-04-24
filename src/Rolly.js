import React, { useState, useEffect } from "react";
import Spinner from "./components/Spinner/Spinner";
import Ticket from "./components/Ticket/Ticket";
import { Container, Row, Col, Image, Jumbotron, Button } from "react-bootstrap";
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
	const [score, setScore] = useState(0);
	const [wins, setWins] = useState([]);

	var clickSound = new Audio(`${window.location.origin}/assets/c.mp3`);
	//var spinSound = new Audio(`${window.location.origin}/assets/spin.mp3`);

	useEffect(() => {
		if (status === "active") {
			if (index < answers.length - 1) {
				scoreGame();
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
		clickSound.play();
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

	const getRow = (i) => {
		return data
			.map((col) => {
				return col[i];
			})
			.filter((ele) => {
				return ele !== 99;
			});
	};

	const scoreGame = () => {
		let score = 0;
		let w = [];
		data.forEach((column, i) => {
			let e = column.filter((ele) => {
				return ele !== 99;
			});
			if (e.length === 12) {
				score += 100;
				w.push(`column ${i}`);
			}
		});
		for (let i = 0; i < 3; i++) {
			let block = [
				...data[0].slice(i * 4, (i + 1) * 4),
				...data[1].slice(i * 4, (i + 1) * 4),
				...data[2].slice(i * 4, (i + 1) * 4),
				...data[3].slice(i * 4, (i + 1) * 4),
				...data[4].slice(i * 4, (i + 1) * 4),
			];
			block = block.filter((ele) => {
				return ele !== 99;
			});
			if (block.length === 20) {
				score += 200;
				w.push(`block ${i}`);
			}
		}
		let topRow = getRow(0);
		if (topRow.length === 5) {
			if (topRow.filter((ele) => ele % 2 === 0).length === 5) {
				console.log("odd");
				score += 100;
				w.push(`top row even`);
			} else if (topRow.filter((ele) => ele % 2 !== 0).length === 5) {
				console.log("even");
				score += 100;
				w.push(`top row odd`);
			}
		}
		// console.log(topRow);
		let bottomRow = getRow(11);
		// console.log(bottomRow);
		if (bottomRow.length === 5) {
			if (bottomRow.filter((ele) => ele % 2 === 0).length === 5) {
				console.log("odd");
				score += 100;
				w.push(`bottom row even`);
			} else if (bottomRow.filter((ele) => ele % 2 !== 0).length === 5) {
				console.log("even");
				score += 100;
				w.push(`bootom row odd`);
			}
		}

		let assen = [2, 6, 9];
		assen.forEach((i) => {
			let r = getRow(i);
			if (
				r.length === 5 &&
				r.reduce((n, item) => n !== false && item >= n && item)
			) {
				console.log("yes");
				score += 100;
				w.push(`assendin ${i}`);
			}
		});
		setWins(w);
		console.log(score);
		setScore(score);
	};

	const temp = () => {
		let n = [...data];
		n[0] = Array(12).fill(10);
		n[1] = Array(12).fill(12);
		n[2] = Array(12).fill(14);
		n[3] = Array(12).fill(16);
		n[4] = Array(12).fill(18);

		setData(n);
	};

	return (
		<div style={{ minHeight: "100%", textAlign: "center" }}>
			{index > -1 ? (
				<>
					<Container>
						{/* <Button onClick={scoreGame}> score</Button> */}
						{/* <Button onClick={temp}>T</Button> */}
						<div className="d-lg-none d-md-none">
							<div className="d-flex justify-content-center">
								<Row>
									<Col style={{ margin: 0, padding: 0 }}>
										<Spinner
											spining={spinning}
											result={answers[index].row}
											speed={200}
											data={images}
											draw={(item) => (
												<>
													{spinning ? (
														<div
															className="roll"
															style={{
																height: "14.8vh",
																width: "12vh",
															}}
														>
															<div
																id="inner-spin"
																style={{ filter: "blur(10px)" }}
															>
																<Image
																	fluid
																	src={`${window.location.origin}/assets/rolly/images/${item}`}
																	style={{
																		height: "7vh",
																		width: "100%",
																	}}
																/>
															</div>
														</div>
													) : (
														<div
															className="roll"
															style={{
																height: "14.8vh",
																width: "12vh",
															}}
														>
															<div id="inner-spin">
																<Image
																	fluid
																	src={`${window.location.origin}/assets/rolly/images/${item}`}
																	style={{
																		height: "7vh",
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
									<Col style={{ margin: 0, padding: 0 }}>
										<Spinner
											spining={spinning}
											result={index}
											speed={200}
											data={answers}
											draw={(item) => (
												<>
													{spinning ? (
														<div
															className="roll"
															style={{ height: "14.8vh", width: "12vh" }}
														>
															<div
																id="inner-spin"
																style={{
																	filter: "blur(10px)",
																	fontSize: "2rem",
																}}
															>
																{item.number}
															</div>
														</div>
													) : (
														<div
															className="roll"
															style={{ height: "14.8vh", width: "12vh" }}
														>
															<div id="inner-spin" style={{ fontSize: "2rem" }}>
																{item.number}
															</div>
														</div>
													)}
												</>
											)}
										></Spinner>
									</Col>
									<div className="ml-auto mt-2">
										<Col style={{ marginLeft: "5px" }}>
											<Spinner
												spining={true}
												result={index}
												speed={900}
												data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()}
												draw={(item) => (
													<div
														style={{
															fontFamily: "Sans-Serif",
															fontSize: "3rem",
															height: "12vh",
															backgroundColor: "black",
															width: "10vh",
															border: "2px solid orange",
															lineHeight: "12vh",
															textAlign: "center",
															color: "orange",
														}}
													>
														{item}
													</div>
												)}
											></Spinner>
										</Col>
									</div>
								</Row>
							</div>
						</div>
						<Row>
							<Col className="left" sm={12} md={6} style={{ margin: "2.4rem" }}>
								<Ticket data={data} putData={putData} />
							</Col>
							<Col sm={12} md={4} style={{ margin: "2.4rem" }}>
								<div className="score-boxes">
									<Row>
										{/* score */}
										<Col xs={7}>
											<div
												className="rules"
												style={{ width: "100%", textAlign: "left" }}
											>
												<h5>
													Score:
													<span>
														<h7> {score}</h7>
													</span>
												</h5>

												<ul>
													{wins.map((win) => (
														<li>{win}</li>
													))}
												</ul>
											</div>
										</Col>
										{/* nos remaining */}
										<Col xs={5}>
											<div
												className="rules"
												style={{ width: "100%", textAlign: "left" }}
											>
												<p style={{ fontSize: "0.6rem", fontWeight: "bold" }}>
													Remaining:
													<br />
													1,2,4
												</p>
											</div>
										</Col>
									</Row>
									{/* Scoring */}
									<Row>
										<Col>
											<div
												className="rules"
												style={{ textAlign: "left", marginTop: "1.3vh" }}
											>
												<h6>Scoring</h6>
												<ol>
													<li>Test</li>
													<li>Test</li>
													<li>Test</li>
													<li>Test</li>
												</ol>
											</div>
										</Col>
									</Row>
									{/* rules */}
									<Row>
										<Col>
											<div
												className="rules"
												style={{ textAlign: "left", marginTop: "1.3vh" }}
											>
												<h6>Rules</h6>
												<ol>
													<li>Rules</li>
													<li>Rules</li>
													<li>Rules</li>
													<li>Rules</li>
												</ol>
											</div>
										</Col>
									</Row>
								</div>
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
																	id="inner-spin"
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
																<div id="inner-spin">
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
															<div className="roll">
																<div
																	id="inner-spin"
																	style={{ filter: "blur(10px)" }}
																>
																	{item.number}
																</div>
															</div>
														) : (
															<div className="roll">
																<div id="inner-spin">{item.number}</div>
															</div>
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
