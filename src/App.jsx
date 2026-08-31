import { useMemo, useState } from "react";
import Artwork from "./Artwork";
import WorldMap from "./WorldMap";
import {
  rounds,
  starterLeaders,
  maximumLocationPoints,
  maximumYearPoints,
} from "./gameData";

const calculateDistance = (
  latitude1,
  longitude1,
  latitude2,
  longitude2
) => {
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

  return (
    2 *
    earthRadius *
    Math.asin(Math.sqrt(value))
  );
};

const calculateLocationPoints = (distance) =>
  Math.round(
    maximumLocationPoints *
      Math.exp(-distance / 2000)
  );

const calculateYearPoints = (
  guessedYear,
  correctYear
) =>
  Math.round(
    maximumYearPoints *
      Math.exp(
        -Math.abs(guessedYear - correctYear) / 35
      )
  );

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
    gap: "18px",
    marginBottom: "22px",
  },

  brandGroup: {
    minWidth: 0,
  },

  eyebrow: {
    margin: "0 0 6px",
    color: "#fb923c",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.22em",
  },

  title: {
    margin: 0,
    fontSize: "clamp(27px, 5vw, 44px)",
    lineHeight: 1,
    fontWeight: "900",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  scoreBox: {
    minWidth: "125px",
    padding: "12px 17px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "16px",
    background: "rgba(15,23,42,0.9)",
    textAlign: "right",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
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

  iconButton: {
    display: "grid",
    width: "46px",
    height: "46px",
    margin: 0,
    padding: 0,
    placeItems: "center",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    background: "#1e293b",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
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
    background:
      "linear-gradient(90deg, #f97316, #facc15)",
    transition: "width 0.3s ease",
  },

  card: {
    marginBottom: "18px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "28px",
    background: "rgba(15,23,42,0.95)",
    boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
  },

  artworkPrompt: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "15px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "900",
  },

  sectionNote: {
    color: "#94a3b8",
    fontSize: "13px",
    textAlign: "right",
  },

  clueBox: {
    marginTop: "15px",
    padding: "14px 16px",
    border: "1px solid rgba(125,211,252,0.2)",
    borderRadius: "15px",
    background: "rgba(7,89,133,0.25)",
    color: "#dbeafe",
    lineHeight: 1.5,
  },

  mapHeadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "14px",
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
    border: "2px solid white",
    borderRadius: "50%",
    background: "#f97316",
  },

  greenDot: {
    width: "12px",
    height: "12px",
    border: "2px solid white",
    borderRadius: "50%",
    background: "#22c55e",
  },

  yearPanel: {
    marginTop: "18px",
    padding: "17px",
    borderRadius: "17px",
    background: "#1e293b",
  },

  yearHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
  },

  yearTitle: {
    fontSize: "18px",
    fontWeight: "900",
  },

  yearPoints: {
    color: "#94a3b8",
    fontSize: "12px",
    textAlign: "right",
  },

  range: {
    width: "100%",
    accentColor: "#8b5cf6",
    cursor: "pointer",
  },

  rangeLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "5px",
    color: "#94a3b8",
    fontSize: "11px",
  },

  primaryButton: {
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

  answerLabel: {
    marginBottom: "5px",
    color: "#6ee7b7",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.13em",
  },

  resultTitle: {
    margin: "0 0 4px",
    color: "white",
    fontSize: "28px",
    fontWeight: "900",
  },

  resultLocation: {
    display: "block",
    marginBottom: "15px",
    color: "#d1fae5",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
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
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "0.08em",
  },

  metricValue: {
    fontSize: "20px",
    fontWeight: "900",
  },

  secondaryButton: {
    width: "100%",
    marginTop: "13px",
    padding: "14px",
    border: "1px solid rgba(255,255,255,0.13)",
    borderRadius: "15px",
    background: "#1e293b",
    color: "white",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },

  finalCard: {
    maxWidth: "700px",
    margin: "7vh auto 0",
    padding: "42px 28px",
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

  finalText: {
    margin: "20px auto 0",
    maxWidth: "530px",
    color: "#e2e8f0",
    fontSize: "17px",
    lineHeight: 1.5,
  },

  namePanel: {
    marginTop: "26px",
    padding: "18px",
    borderRadius: "18px",
    background: "#1e293b",
  },

  inputRow: {
    display: "flex",
    gap: "9px",
  },

  nameInput: {
    minWidth: 0,
    flex: 1,
    padding: "14px 16px",
    border: "1px solid #475569",
    borderRadius: "14px",
    outline: "none",
    background: "#0f172a",
    color: "white",
    fontSize: "15px",
  },

  addButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "14px",
    background: "#f97316",
    color: "#07111f",
    fontWeight: "900",
    cursor: "pointer",
  },

  successMessage: {
    marginTop: "22px",
    padding: "14px",
    borderRadius: "14px",
    background: "#064e3b",
    color: "#a7f3d0",
    fontWeight: "800",
  },

  finalButtons: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginTop: "22px",
  },

  finalButton: {
    padding: "14px 21px",
    border: "none",
    borderRadius: "14px",
    background: "#f97316",
    color: "#07111f",
    fontWeight: "900",
    cursor: "pointer",
  },

  finalSecondaryButton: {
    padding: "14px 21px",
    border: "1px solid rgba(255,255,255,0.13)",
    borderRadius: "14px",
    background: "#1e293b",
    color: "white",
    fontWeight: "900",
    cursor: "pointer",
  },

  modalBackdrop: {
    position: "fixed",
    zIndex: 100,
    inset: 0,
    display: "grid",
    padding: "20px",
    placeItems: "center",
    background: "rgba(2,6,23,0.88)",
    backdropFilter: "blur(8px)",
  },

  modal: {
    width: "100%",
    maxWidth: "650px",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "25px",
    background: "#0f172a",
    boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
  },

  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "20px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "900",
  },

  closeButton: {
    display: "grid",
    width: "42px",
    height: "42px",
    marginLeft: "auto",
    placeItems: "center",
    border: "none",
    borderRadius: "12px",
    background: "#1e293b",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },

  leaderList: {
    display: "grid",
    gap: "9px",
  },

  leaderRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "#1e293b",
  },

  firstLeader: {
    background: "#facc15",
    color: "#07111f",
  },

  leaderRank: {
    width: "35px",
    fontSize: "20px",
    fontWeight: "900",
  },

  leaderName: {
    minWidth: 0,
    overflow: "hidden",
    fontWeight: "800",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  leaderScore: {
    marginLeft: "auto",
    fontSize: "18px",
    fontWeight: "900",
  },

  localNotice: {
    marginTop: "17px",
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: 1.5,
  },
};

function Leaderboard({
  leaders,
  onClose,
}) {
  const rankedLeaders = useMemo(
    () =>
      [...leaders].sort(
        (leader1, leader2) =>
          leader2.score - leader1.score
      ),
    [leaders]
  );

  return (
    <div style={styles.modalBackdrop}>
      <section style={styles.modal}>
        <div style={styles.modalHeader}>
          <span style={{ fontSize: "35px" }}>
            🏆
          </span>

          <div>
            <h2 style={styles.modalTitle}>
              Leaderboard
            </h2>

            <div
              style={{
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              Best completed journeys
            </div>
          </div>

          <button
            type="button"
            style={styles.closeButton}
            onClick={onClose}
            aria-label="Close leaderboard"
          >
            ✕
          </button>
        </div>

        <div style={styles.leaderList}>
          {rankedLeaders.map(
            (leader, index) => (
              <div
                key={`${leader.name}-${index}`}
                style={{
                  ...styles.leaderRow,
                  ...(index === 0
                    ? styles.firstLeader
                    : {}),
                }}
              >
                <span style={styles.leaderRank}>
                  {index + 1}
                </span>

                <span style={styles.leaderName}>
                  {leader.name}
                </span>

                <span style={styles.leaderScore}>
                  {leader.score.toLocaleString()}
                </span>
              </div>
            )
          )}
        </div>

        <p style={styles.localNotice}>
          This leaderboard is currently stored only
          in this browser session. A shared community
          leaderboard can be connected later.
        </p>
      </section>
    </div>
  );
}

export default function App() {
  const [roundIndex, setRoundIndex] =
    useState(0);

  const [score, setScore] = useState(0);

  const [guess, setGuess] = useState(null);

  const [selectedYear, setSelectedYear] =
    useState(1900);

  const [result, setResult] =
    useState(null);

  const [finished, setFinished] =
    useState(false);

  const [leaders, setLeaders] =
    useState(starterLeaders);

  const [showLeaderboard, setShowLeaderboard] =
    useState(false);

  const [playerName, setPlayerName] =
    useState("");

  const [scoreSaved, setScoreSaved] =
    useState(false);

  const round = rounds[roundIndex];

  const progress =
    ((roundIndex + 1) / rounds.length) *
    100;

  const maximumGameScore = rounds.reduce(
    (total, currentRound) =>
      total +
      maximumLocationPoints +
      (currentRound.historical
        ? maximumYearPoints
        : 0),
    0
  );

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
      round.latitude,
      round.longitude
    );

    const locationPoints =
      calculateLocationPoints(distance);

    const yearPoints = round.historical
      ? calculateYearPoints(
          selectedYear,
          round.year
        )
      : 0;

    const roundPoints =
      locationPoints + yearPoints;

    setResult({
      distance,
      locationPoints,
      yearPoints,
      roundPoints,
    });

    setScore(
      (currentScore) =>
        currentScore + roundPoints
    );
  }

  function nextRound() {
    if (roundIndex === rounds.length - 1) {
      setFinished(true);
      return;
    }

    setRoundIndex(
      (currentIndex) => currentIndex + 1
    );

    setGuess(null);
    setResult(null);
    setSelectedYear(1900);
  }

  function restartGame() {
    setRoundIndex(0);
    setScore(0);
    setGuess(null);
    setSelectedYear(1900);
    setResult(null);
    setFinished(false);
    setPlayerName("");
    setScoreSaved(false);
    setShowLeaderboard(false);
  }

  function saveScore() {
    const cleanName = playerName.trim();

    if (!cleanName || scoreSaved) {
      return;
    }

    setLeaders((currentLeaders) => [
      ...currentLeaders,
      {
        name: cleanName,
        score,
      },
    ]);

    setScoreSaved(true);
    setShowLeaderboard(true);
  }

  if (finished) {
    const percentage = Math.round(
      (score / maximumGameScore) * 100
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
        <section style={styles.finalCard}>
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
            {maximumGameScore.toLocaleString()}
          </p>

          <p style={styles.finalText}>
            {finalMessage}
          </p>

          {!scoreSaved ? (
            <div style={styles.namePanel}>
              <div
                style={{
                  marginBottom: "11px",
                  fontWeight: "800",
                }}
              >
                Add your score to the leaderboard
              </div>

              <div style={styles.inputRow}>
                <input
                  type="text"
                  value={playerName}
                  onChange={(event) =>
                    setPlayerName(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      saveScore();
                    }
                  }}
                  placeholder="Your name or nickname"
                  maxLength={35}
                  style={styles.nameInput}
                />

                <button
                  type="button"
                  style={{
                    ...styles.addButton,
                    ...(!playerName.trim()
                      ? styles.disabledButton
                      : {}),
                  }}
                  disabled={!playerName.trim()}
                  onClick={saveScore}
                >
                  Add score
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.successMessage}>
              Your score has been added.
            </div>
          )}

          <div style={styles.finalButtons}>
            <button
              type="button"
              style={styles.finalSecondaryButton}
              onClick={() =>
                setShowLeaderboard(true)
              }
            >
              View leaderboard
            </button>

            <button
              type="button"
              style={styles.finalButton}
              onClick={restartGame}
            >
              Play again
            </button>
          </div>
        </section>

        {showLeaderboard && (
          <Leaderboard
            leaders={leaders}
            onClose={() =>
              setShowLeaderboard(false)
            }
          />
        )}
      </main>
    );
  }

    return (
    <main style={styles.app}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.brandGroup}>
            <p style={styles.eyebrow}>
              TECHNICAL COMMUNITIES
            </p>

            <h1 style={styles.title}>
              Structural GeoGuess
            </h1>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.scoreBox}>
              <span style={styles.scoreNumber}>
                {score.toLocaleString()}
              </span>

              <span style={styles.scoreLabel}>
                points
              </span>
            </div>

            <button
              type="button"
              style={styles.iconButton}
              onClick={() => setShowLeaderboard(true)}
              title="View leaderboard"
              aria-label="View leaderboard"
            >
              🏆
            </button>

            <button
              type="button"
              style={styles.iconButton}
              onClick={restartGame}
              title="Restart game"
              aria-label="Restart game"
            >
              ↻
            </button>
          </div>
        </header>

        <div style={styles.questionMeta}>
          <span>
            Question {roundIndex + 1} of {rounds.length}
          </span>

          <span>
            Up to{" "}
            {(
              maximumLocationPoints +
              (round.historical ? maximumYearPoints : 0)
            ).toLocaleString()}{" "}
            points
          </span>
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
          <div style={styles.artworkPrompt}>
            <h2 style={styles.sectionTitle}>
              Identify the structure
            </h2>

            <span style={styles.sectionNote}>
              Study the illustration, then place your pin
            </span>
          </div>

          <Artwork
            type={round.artwork}
            name={round.answer}
            revealName={Boolean(result)}
          />

          <div style={styles.clueBox}>
            <strong>Structural clue: </strong>
            {round.clue}
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.mapHeadingRow}>
            <h2 style={styles.sectionTitle}>
              Place your pin
            </h2>

            <span style={styles.sectionNote}>
              {result
                ? "Answer locked"
                : guess
                  ? "Click again to move your pin"
                  : "Click anywhere on the map"}
            </span>
          </div>

          <WorldMap
            key={roundIndex}
            guess={guess}
            answer={round}
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

          {round.historical && (
            <div style={styles.yearPanel}>
              <div style={styles.yearHeader}>
                <span style={styles.yearTitle}>
                  Year: {selectedYear}
                </span>

                <span style={styles.yearPoints}>
                  Up to 1,000 additional points
                </span>
              </div>

              <input
                type="range"
                min={round.minimumYear}
                max={round.maximumYear}
                value={selectedYear}
                disabled={Boolean(result)}
                onChange={(event) =>
                  setSelectedYear(Number(event.target.value))
                }
                style={styles.range}
              />

              <div style={styles.rangeLabels}>
                <span>{round.minimumYear}</span>
                <span>{round.maximumYear}</span>
              </div>
            </div>
          )}

          {!result ? (
            <button
              type="button"
              style={{
                ...styles.primaryButton,
                ...(!guess ? styles.disabledButton : {}),
              }}
              disabled={!guess}
              onClick={lockAnswer}
            >
              Lock answer
            </button>
          ) : (
            <>
              <div style={styles.resultBox}>
                <div style={styles.answerLabel}>
                  ANSWER
                </div>

                <h2 style={styles.resultTitle}>
                  {round.answer}
                </h2>

                <span style={styles.resultLocation}>
                  {round.location}
                  {round.historical
                    ? ` · ${round.year}`
                    : ""}
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
                      LOCATION SCORE
                    </span>

                    <span style={styles.metricValue}>
                      +{result.locationPoints.toLocaleString()}
                    </span>
                  </div>

                  {round.historical && (
                    <div style={styles.resultMetric}>
                      <span style={styles.metricLabel}>
                        YEAR SCORE
                      </span>

                      <span style={styles.metricValue}>
                        +{result.yearPoints.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div style={styles.resultMetric}>
                    <span style={styles.metricLabel}>
                      ROUND SCORE
                    </span>

                    <span style={styles.metricValue}>
                      +{result.roundPoints.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                style={styles.primaryButton}
                onClick={nextRound}
              >
                {roundIndex === rounds.length - 1
                  ? "Finish game"
                  : "Next question"}{" "}
                →
              </button>
            </>
          )}
        </section>
      </div>

      {showLeaderboard && (
        <Leaderboard
          leaders={leaders}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </main>
  );
}