import { useMemo, useRef, useState } from "react";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import WorldMap from "./WorldMap";
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;
const MAX_POINTS = 1000;

const questions = [
  {
    structure: "Sydney Opera House",
    location: "Sydney, Australia",
    latitude: -33.8568,
    longitude: 151.2153,
    clue: "A performing arts complex famous for its distinctive shell-shaped roof.",
    icon: "🎭",
  },
  {
    structure: "Golden Gate Bridge",
    location: "San Francisco, USA",
    latitude: 37.8199,
    longitude: -122.4783,
    clue: "An iconic suspension bridge spanning the Golden Gate strait.",
    icon: "🌉",
  },
  {
    structure: "Millau Viaduct",
    location: "Millau, France",
    latitude: 44.0775,
    longitude: 3.0227,
    clue: "A multi-span cable-stayed bridge crossing the Tarn Valley.",
    icon: "🏗️",
  },
  {
    structure: "Brooklyn Bridge",
    location: "New York City, USA",
    latitude: 40.7061,
    longitude: -73.9969,
    clue: "A historic hybrid suspension and cable-stayed bridge completed in 1883.",
    icon: "🌁",
  },
];

function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
  const earthRadius = 6371;
  const degreesToRadians = Math.PI / 180;

  const latitudeDifference =
    (latitude2 - latitude1) * degreesToRadians;

  const longitudeDifference =
    (longitude2 - longitude1) * degreesToRadians;

  const value =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitude1 * degreesToRadians) *
      Math.cos(latitude2 * degreesToRadians) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 2 * earthRadius * Math.asin(Math.sqrt(value));
}

function calculatePoints(distance) {
  return Math.round(MAX_POINTS * Math.exp(-distance / 2000));
}

const styles = {
  app: {
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "24px",
    color: "white",
    background:
      "radial-gradient(circle at top, #163b65 0%, #07111f 48%, #030914 100%)",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  container: {
    width: "100%",
    maxWidth: "1080px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "22px",
  },

  eyebrow: {
    margin: "0 0 5px",
    color: "#fb923c",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.22em",
  },

  title: {
    margin: 0,
    fontSize: "clamp(28px, 5vw, 44px)",
    lineHeight: 1,
    fontWeight: "900",
  },

  scoreBox: {
    minWidth: "125px",
    padding: "12px 18px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "16px",
    background: "rgba(15,23,42,0.9)",
    textAlign: "right",
  },

  scoreNumber: {
    display: "block",
    fontSize: "24px",
    fontWeight: "900",
  },

  scoreLabel: {
    color: "#94a3b8",
    fontSize: "12px",
  },

  questionMeta: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "9px",
    color: "#94a3b8",
    fontSize: "14px",
  },

  progressTrack: {
    height: "8px",
    marginBottom: "18px",
    overflow: "hidden",
    borderRadius: "999px",
    background: "#1e293b",
  },

  progressBar: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #f97316, #facc15)",
    transition: "width 0.3s ease",
  },

  card: {
    overflow: "hidden",
    marginBottom: "18px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "26px",
    background: "rgba(15,23,42,0.95)",
    boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
  },

  questionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "22px",
    background:
      "linear-gradient(135deg, #075985 0%, #1d4ed8 55%, #312e81 100%)",
  },

  iconBox: {
    display: "grid",
    flex: "0 0 72px",
    width: "72px",
    height: "72px",
    placeItems: "center",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.15)",
    fontSize: "40px",
  },

  structureName: {
    margin: "0 0 7px",
    fontSize: "clamp(25px, 5vw, 40px)",
    lineHeight: 1.05,
    fontWeight: "900",
  },

  clue: {
    margin: 0,
    color: "#dbeafe",
    lineHeight: 1.45,
  },

  mapSection: {
    padding: "22px",
  },

  mapHeadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "14px",
  },

  mapHeading: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "900",
  },

  mapInstruction: {
    color: "#94a3b8",
    fontSize: "13px",
    textAlign: "right",
  },

  mapWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "2 / 1",
    overflow: "hidden",
    border: "4px solid #334155",
    borderRadius: "18px",
    background: "#89c9df",
    cursor: "crosshair",
    boxSizing: "border-box",
  },

  mapSvg: {
    display: "block",
    width: "100%",
    height: "100%",
  },

  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "12px",
    color: "#cbd5e1",
    fontSize: "13px",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  orangeDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#f97316",
    border: "2px solid white",
  },

  greenDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#22c55e",
    border: "2px solid white",
  },

  button: {
    width: "100%",
    marginTop: "17px",
    padding: "16px",
    border: "none",
    borderRadius: "16px",
    background: "#f97316",
    color: "#07111f",
    fontSize: "17px",
    fontWeight: "900",
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.4,
    cursor: "not-allowed",
  },

  resultBox: {
    marginTop: "18px",
    padding: "18px",
    border: "1px solid rgba(52,211,153,0.35)",
    borderRadius: "18px",
    background: "#052e2b",
  },

  resultTitle: {
    margin: "0 0 4px",
    color: "#6ee7b7",
    fontSize: "22px",
    fontWeight: "900",
  },

  resultLocation: {
    display: "block",
    marginBottom: "14px",
    color: "#d1fae5",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
  },

  resultMetric: {
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(0,0,0,0.2)",
  },

  metricLabel: {
    display: "block",
    marginBottom: "3px",
    color: "#6ee7b7",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.08em",
  },

  metricValue: {
    fontSize: "20px",
    fontWeight: "900",
  },

  resultsCard: {
    maxWidth: "680px",
    margin: "12vh auto 0",
    padding: "45px 28px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "30px",
    background: "rgba(15,23,42,0.96)",
    textAlign: "center",
    boxShadow: "0 25px 70px rgba(0,0,0,0.4)",
  },

  trophy: {
    fontSize: "72px",
  },

  finalScore: {
    margin: "16px 0 4px",
    color: "#facc15",
    fontSize: "clamp(55px, 12vw, 88px)",
    lineHeight: 1,
    fontWeight: "900",
  },

  restartButton: {
    marginTop: "25px",
    padding: "15px 28px",
    border: "none",
    borderRadius: "16px",
    background: "#f97316",
    color: "#07111f",
    fontSize: "17px",
    fontWeight: "900",
    cursor: "pointer",
  },
};

export default function App() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState(null);
  const [result, setResult] = useState(null);
  const [finished, setFinished] = useState(false);

  const question = questions[questionIndex];

  const progress =
    ((questionIndex + 1) / questions.length) * 100;

  function placeGuess(newGuess) {
    if (!result) {
      setGuess(newGuess);
    }
  }

  function lockAnswer() {
    if (!guess || result) {
      return;
    }

    const distance = calculateDistance(
      guess.latitude,
      guess.longitude,
      question.latitude,
      question.longitude
    );

    const points = calculatePoints(distance);

    setResult({
      distance,
      points,
    });

    setScore((currentScore) => currentScore + points);
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setQuestionIndex((currentIndex) => currentIndex + 1);
    setGuess(null);
    setResult(null);
  }

  function restartGame() {
    setQuestionIndex(0);
    setScore(0);
    setGuess(null);
    setResult(null);
    setFinished(false);
  }

  if (finished) {
    const maximumScore = questions.length * MAX_POINTS;
    const percentage = Math.round(
      (score / maximumScore) * 100
    );

    let finalMessage =
      "A solid effort. Time for another lap around the globe.";

    if (percentage >= 90) {
      finalMessage =
        "Outstanding. Your structural geography is seriously impressive.";
    } else if (percentage >= 70) {
      finalMessage =
        "Excellent work. Very few structures escaped your radar.";
    } else if (percentage >= 50) {
      finalMessage =
        "A respectable result. A few structures were hiding in plain sight.";
    }

    return (
      <main style={styles.app}>
        <section style={styles.resultsCard}>
          <div style={styles.trophy}>🏆</div>

          <p style={styles.eyebrow}>
            JOURNEY COMPLETE
          </p>

          <h1 style={styles.title}>
            Structural GeoGuess
          </h1>

          <div style={styles.finalScore}>
            {score.toLocaleString()}
          </div>

          <p style={{ color: "#94a3b8" }}>
            points out of{" "}
            {maximumScore.toLocaleString()}
          </p>

          <p
            style={{
              marginTop: "20px",
              color: "#e2e8f0",
              fontSize: "18px",
              lineHeight: 1.5,
            }}
          >
            {finalMessage}
          </p>

          <button
            type="button"
            style={styles.restartButton}
            onClick={restartGame}
          >
            Play again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.app}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>
              TECHNICAL COMMUNITIES
            </p>

            <h1 style={styles.title}>
              Structural GeoGuess
            </h1>
          </div>

          <div style={styles.scoreBox}>
            <span style={styles.scoreNumber}>
              {score.toLocaleString()}
            </span>

            <span style={styles.scoreLabel}>
              points
            </span>
          </div>
        </header>

        <div style={styles.questionMeta}>
          <span>
            Question {questionIndex + 1} of{" "}
            {questions.length}
          </span>

          <span>Up to 1,000 points</span>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progress}%`,
            }}
          />
        </div>

        <section style={styles.card}>
          <div style={styles.questionHeader}>
            <div style={styles.iconBox}>
              {question.icon}
            </div>

            <div>
              <h2 style={styles.structureName}>
                {question.structure}
              </h2>

              <p style={styles.clue}>
                {question.clue}
              </p>
            </div>
          </div>

          <div style={styles.mapSection}>
            <div style={styles.mapHeadingRow}>
              <h3 style={styles.mapHeading}>
                Place your pin
              </h3>

              <span style={styles.mapInstruction}>
                {result
                  ? "Answer locked"
                  : guess
                    ? "Click again to move your pin"
                    : "Click anywhere on the map"}
              </span>
            </div>

            <WorldMap
              guess={guess}
              answer={question}
              locked={Boolean(result)}
              onGuess={placeGuess}
            />

            <div style={styles.legend}>
              <span style={styles.legendItem}>
                <span style={styles.orangeDot} />
                Your guess
              </span>

              {result && (
                <span style={styles.legendItem}>
                  <span style={styles.greenDot} />
                  Correct location
                </span>
              )}
            </div>

            {!result ? (
              <button
                type="button"
                style={{
                  ...styles.button,
                  ...(!guess
                    ? styles.disabledButton
                    : {}),
                }}
                disabled={!guess}
                onClick={lockAnswer}
              >
                Lock answer
              </button>
            ) : (
              <>
                <div style={styles.resultBox}>
                  <h3 style={styles.resultTitle}>
                    {question.structure}
                  </h3>

                  <span style={styles.resultLocation}>
                    {question.location}
                  </span>

                  <div style={styles.resultGrid}>
                    <div style={styles.resultMetric}>
                      <span style={styles.metricLabel}>
                        DISTANCE
                      </span>

                      <span style={styles.metricValue}>
                        {Math.round(
                          result.distance
                        ).toLocaleString()}{" "}
                        km
                      </span>
                    </div>

                    <div style={styles.resultMetric}>
                      <span style={styles.metricLabel}>
                        ROUND SCORE
                      </span>

                      <span style={styles.metricValue}>
                        +{result.points.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  style={styles.button}
                  onClick={nextQuestion}
                >
                  {questionIndex ===
                  questions.length - 1
                    ? "Finish game"
                    : "Next question"}{" "}
                  →
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}