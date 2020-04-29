import React, { useState, useEffect } from "react";
import Spinner from "./components/Spinner/Spinner";
import Ticket from "./components/Ticket/Ticket";
import { Container, Row, Col, Image } from "react-bootstrap";
import db from "./firbase";
import "./Rolly.css";
import { imgs } from "./data";

export default function Rolly() {
  const [spinning, setSpinning] = useState(true);
  const [status, setStatus] = useState("loading");
  const [answers, setAnswers] = useState([0]);
  const [data, setData] = useState(Array(5).fill(Array(12).fill(99)));
  const [index, setIndex] = useState(-1);
  const [active, setActive] = useState(true);
  const [current, setCurrent] = useState(null);
  const [score, setScore] = useState(0);
  const [wins, setWins] = useState([]);

  var timerSound = document.getElementById("timerSound");
  var spinnerSound = document.getElementById("spinnerSound");

  window.onbeforeunload = function (event) {
    event.returnValue = "Your custom message.";
  };

  window.onunload = window.onbeforeunload;
  function playTimer() {
    console.log("played");
    timerSound.currentTime = 0;
    timerSound.play();
  }

  function pauseTimer() {
    console.log("paused");
    timerSound.pause();
  }
  function playSpinner() {
    console.log("played");
    spinnerSound.currentTime = 0;
    spinnerSound.play();
  }

  function pauseSpinner() {
    console.log("paused");
    spinnerSound.pause();
  }

  useEffect(() => {
    if (status === "active") {
      if (index < answers.length - 1) {
        scoreGame();
        setTimeout(() => {
          pauseTimer();
          playSpinner();
          setSpinning(true);
          setIndex(index + 1);
          setCurrent(null);
        }, 17000);
      }
      setTimeout(() => {
        setActive(false);
      }, 17000);
      setTimeout(() => {
        pauseSpinner();
        playTimer();
        setSpinning(false);
        setActive(true);
      }, 2000);
    }
  }, [index, answers.length, status]);

  useEffect(() => {
    const unsubscribe = db
      .collection("meta")
      .doc("demo-site-rolly-base-1587818395")
      .onSnapshot(
        (doc) => {
          let data = doc.data();
          console.log(data);
          if (data.state === "start") {
            setAnswers(data.meta);
            setStatus("ready");
            setTimeout(() => {
              setIndex(0);
              setStatus("active");
            }, 15000);
          }
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

  const putData = (colId, rowId) => {
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
      score += e.length * 10;
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

  return (
    <div style={{ minHeight: "100%", textAlign: "center" }}>
      {status === "loading" ? (
        <h1 style={{ color: "aliceblue" }}>Game Not Started</h1>
      ) : null}
      {status === "ready" ? (
        <Spinner
          spining={true}
          speed={1000}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].reverse()}
          draw={(item) => {
            return (
              <h1
                style={{
                  color: "aliceblue",
                }}
              >
                Game will start in {item} seconds
              </h1>
            );
          }}
        ></Spinner>
      ) : null}

      <Container>
        {/* <Button onClick={scoreGame}> score</Button> */}

        <div className="d-lg-none d-md-none">
          <div className="d-flex justify-content-center">
            <Row>
              <Col style={{ padding: 0, margin: 0 }}>
                <Spinner
                  spining={spinning}
                  result={index !== -1 ? answers[index].row : 0}
                  speed={100}
                  data={imgs}
                  draw={(item) => (
                    <>
                      {spinning ? (
                        <div className="roll" style={{ width: "13vh" }}>
                          <div
                            id="inner-spin"
                            //  style={{ filter: "blur(10px)" }}
                          >
                            <Image
                              fluid
                              src={item}
                              style={{ height: "11vh" }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="roll" style={{ width: "13vh" }}>
                          <div id="inner-spin">
                            <Image
                              fluid
                              src={item}
                              style={{ height: "11vh" }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                ></Spinner>
              </Col>
              <Col style={{ padding: 0, margin: 0 }}>
                <Spinner
                  spining={spinning}
                  result={index !== -1 ? index : 0}
                  speed={100}
                  data={answers}
                  draw={(item) => (
                    <>
                      {spinning ? (
                        <div className="roll" style={{ width: "13vh" }}>
                          <div
                            id="inner-spin"
                            style={{
                              // filter: "blur(10px)",
                              fontSize: "3rem",
                            }}
                          >
                            {item.number}
                          </div>
                        </div>
                      ) : (
                        <div className="roll" style={{ width: "13vh" }}>
                          <div id="inner-spin" style={{ fontSize: "3rem" }}>
                            {item.number}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                ></Spinner>
              </Col>
              <div className="ml-auto mt-2">
                <Col>
                  <Spinner
                    spining={true}
                    result={index}
                    speed={1000}
                    data={
                      spinning || status !== "active"
                        ? [0]
                        : [
                            0,
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                          ].reverse()
                    }
                    draw={(item) => (
                      <div
                        style={{
                          fontFamily: "Sans-serif",
                          border: "2px solid goldenrod",
                          backgroundColor: "black",
                          fontSize: "3rem",
                          height: "12vh",
                          width: "10vh",
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
                <Col xs={6}>
                  <div
                    className="rules"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    <h5>
                      Score:
                      <span>
                        <h6> {score}</h6>
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
                <Col xs={6}>
                  <div
                    className="rules"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    <h5>Remaining {90 - index - 1}</h5>
                  </div>
                </Col>
              </Row>

              <div className="hide-in-small mt-3">
                <Row>
                  <Col lg={4} style={{ padding: 0, margin: 0 }}>
                    <Spinner
                      spining={spinning}
                      result={index !== -1 ? answers[index].row : 0}
                      speed={100}
                      data={imgs}
                      draw={(item) => (
                        <>
                          {spinning ? (
                            <div className="roll">
                              <div
                                id="inner-spin"
                                // style={{ filter: "blur(10px)" }}
                              >
                                <Image
                                  fluid
                                  src={item}
                                  style={{ height: "11vh" }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="roll">
                              <div id="inner-spin">
                                <Image
                                  fluid
                                  src={item}
                                  style={{ height: "11vh" }}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    ></Spinner>
                  </Col>
                  <Col lg={4} style={{ padding: 0, margin: 0 }}>
                    <Spinner
                      spining={spinning}
                      result={index !== -1 ? index : 0}
                      speed={100}
                      data={answers}
                      draw={(item) => (
                        <>
                          {spinning ? (
                            <div className="roll">
                              <div
                                id="inner-spin"
                                style={{
                                  // filter: "blur(10px)",
                                  fontSize: "3rem",
                                }}
                              >
                                {item !== undefined ? item.number : 0}
                              </div>
                            </div>
                          ) : (
                            <div className="roll">
                              <div id="inner-spin" style={{ fontSize: "3rem" }}>
                                {item.number}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    ></Spinner>
                  </Col>
                  <div className="ml-auto mt-2">
                    <Col lg={3} style={{ padding: 0, margin: 0 }}>
                      <Spinner
                        spining={true}
                        result={index}
                        speed={1000}
                        data={
                          spinning || status !== "active"
                            ? [0]
                            : [
                                0,
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8,
                                9,
                                10,
                                11,
                                12,
                                13,
                                14,
                              ].reverse()
                        }
                        draw={(item) => (
                          <div
                            style={{
                              fontFamily: "Sans-serif",
                              border: "2px solid goldenrod",
                              backgroundColor: "black",
                              fontSize: "3rem",
                              height: "12vh",
                              width: "10vh",
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

              <div className=" mt-3">
                {/* Scoring */}
                <Row>
                  <Col>
                    <div
                      className="rules"
                      style={{ textAlign: "left", marginTop: "1.3vh" }}
                    >
                      <h3>Scoring</h3>
                      <ol>
                        <li>150 points per complete COLUMN</li>
                        <li>200 points per complete BLOCK</li>
                        <li>
                          100 points- Odd/Even- If the 1 st row has either all
                          even or all odd numbers
                        </li>
                        <li>
                          100 points- Odd/Even- If the Last row has either all
                          even or all odd numbers
                        </li>
                        <li>
                          100 points per row (marked by Ascending), if the
                          numbers are from left to right in ascending order
                          (small to big)
                        </li>
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
                      <h3>How To Play</h3>
                      <ol>
                        <li>Numbers will randomly appear between 1-90</li>
                        <li>
                          Put the number in the same column as the slot machine
                          symbol
                        </li>
                        <li>
                          While placing numbers in the same column, they have to
                          be in ascending order (smallest to largest)
                        </li>
                        <li>
                          Joker numbers can be placed in any column, in
                          ascending order
                        </li>
                        <li>
                          Game ends when all numbers between 1-90 would have
                          come out
                        </li>
                      </ol>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <audio id="timerSound" controls preload="auto" hidden>
        <source
          src={`${window.location.origin}/assets/rolly/timer.mp3`}
          type="audio/mp3"
        />
      </audio>
      <audio id="spinnerSound" controls preload="auto" hidden>
        <source
          src={`${window.location.origin}/assets/rolly/spin.mp3`}
          type="audio/mp3"
        />
      </audio>
    </div>
  );
}
