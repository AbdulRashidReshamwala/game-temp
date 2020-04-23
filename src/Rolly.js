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

<<<<<<< HEAD
  useEffect(() => {
    if (status === "active") {
      if (index < answers.length - 1) {
        setTimeout(() => {
          setSpinning(true);
          setIndex(index + 1);
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
  const verifyPlacement = (rowId, colId, value) => {
    if (value.row !== rowId && value.row !== 5) {
      return false;
    }
    value = value.number;
    if (data[rowId][colId] !== 99) {
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
=======
	useEffect(() => {
		if (status === "active") {
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
>>>>>>> c3f8e9203fefd3f6a6dbb5253d927c4770127165

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

<<<<<<< HEAD
  return (
    <div style={{ minHeight: "100%", textAlign: "center" }}>
      {index > -1 ? (
        <>
          <Container>
            <div className="d-lg-none d-md-none">
              <div className="d-flex justify-content-center">
                <Row>
                  <Col style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                    <Spinner
                      spining={spinning}
                      result={answers[index].row}
                      speed={200}
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
                  <Col style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                    <Spinner
                      spining={spinning}
                      result={index}
                      speed={200}
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
            </div>
            <Row>
              <Col
                className="left"
                sm={12}
                md={6}
                style={{
                  marginLeft: "2.4rem",
                  marginRight: "2.4rem",
                  marginTop: "2vh",
                }}
              >
                <Ticket data={data} putData={putData} />
              </Col>
              <Col sm={12} md={4} style={{ margin: "2.4rem" }}>
                <Row>
                  <Jumbotron
                    className="rules"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    <h3>Rules</h3>
                    <ul>
                      <li>Rules</li>
                      <li>Rules</li>
                      <li>Rules</li>
                      <li>Rules</li>
                      <li>Rules</li>
                    </ul>
                  </Jumbotron>
                </Row>
                <div className="hide-in-small">
                  <Row>
                    <Col style={{ paddingLeft: "0px", paddingRight: "0px" }}>
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
                    <Col style={{ paddingLeft: "0px", paddingRight: "0px" }}>
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
                              paddingLeft: "0px",
                              paddingRight: "0px",
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
=======
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
											speed={200}
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
															backgroundColor: "black",

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
>>>>>>> c3f8e9203fefd3f6a6dbb5253d927c4770127165
}
