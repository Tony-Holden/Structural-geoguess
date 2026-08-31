import { useEffect, useMemo, useState } from "react";
import WorldMap from "./WorldMap";
import QuizImage from "./QuizImage";
import { loadWeeklyQuiz } from "./quizLoader";
import {
  getLeaderboard,
  submitScore,
} from "./leaderboardService";

const MAX_LOCATION_POINTS = 1000;
const MAX_YEAR_POINTS = 1000;

const starterLeaders = [];

function calculateDistance(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
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
}

function calculateLocationPoints(distance) {
  return Math.round(
    MAX_LOCATION_POINTS *
      Math.exp(-distance / 500)
  );
}

function calculateYearPoints(
  guessedYear,
  correctYear
) {
  return Math.round(
    MAX_YEAR_POINTS *
      Math.exp(
        -Math.abs(guessedYear - correctYear) / 35
      )
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "24px",
    color: "white",
    background:
      "radial-gradient(circle at top, #123453 0%, #081b2f 48%, #040d17 100%)",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  container: {
    width: "100%",
    maxWidth: "1080px",
    margin: "0 auto",
  },

  centredCard: {
    width: "calc(100% - 40px)",
    maxWidth: "680px",
    margin: "12vh auto 0",
    padding: "38px 28px",
    boxSizing: "border-box",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "28px",
    background: "rgba(15,23,42,0.96)",
    textAlign: "center",
    boxShadow: "0 25px 70px rgba(0,0,0,0.4)",
  },

  spinner: {
    marginBottom: "18px",
    fontSize: "55px",
  },

  errorIcon: {
    marginBottom: "16px",
    fontSize: "55px",
  },

  errorTitle: {
    margin: "0 0 12px",
    fontSize: "28px",
    fontWeight: "900",
  },

  errorMessage: {
    padding: "14px",
    borderRadius: "14px",
    background: "#450a0a",
    color: "#fecaca",
    fontFamily: "monospace",
    fontSize: "13px",
    lineHeight: 1.5,
    textAlign: "left",
    overflowWrap: "anywhere",
  },

  retryButton: {
    marginTop: "20px",
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background: "#8cc63f",
    color: "#10200b",
    fontSize: "16px",
    fontWeight: "900",
    cursor: "pointer",
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

  logo: {
    display: "block",
    width: "auto",
    maxWidth: "290px",
    height: "76px",
    marginBottom: "14px",
    objectFit: "contain",
  },

  eyebrow: {
  display: "inline-block",
  margin: "0 0 10px",
  color: "#8cc63f",
  fontSize: "17px",
  fontWeight: "900",
  letterSpacing: "0.19em",
  lineHeight: 1.2,
},

  title: {
    margin: 0,
    fontSize: "clamp(27px, 5vw, 44px)",
    lineHeight: 1,
    fontWeight: "900",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: "14px",
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
      "linear-gradient(90deg, #5f8f2f, #a7d54f)",
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

  sectionHeader: {
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
    background: "#8cc63f",
    color: "#10200b",
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
    color: "#a7d54f",
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
    background: "#8cc63f",
    color: "#10200b",
    fontWeight: "900",
    cursor: "pointer",
  },

  savedMessage: {
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

  finalPrimaryButton: {
    padding: "14px 21px",
    border: "none",
    borderRadius: "14px",
    background: "#8cc63f",
    color: "#10200b",
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
    boxSizing: "border-box",
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
    padding: 0,
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
    background: "#a7d54f",
    color: "#10200b",
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

function Leaderboard({ leaders, onClose }) {
  const rankedLeaders = useMemo(
    () =>
      [...leaders].sort(
        (firstLeader, secondLeader) =>
          secondLeader.score - firstLeader.score
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
          {leaders.length === 0 && (
  <div
    style={{
      padding: "25px",
      borderRadius: "14px",
      background: "#1e293b",
      color: "#cbd5e1",
      textAlign: "center",
    }}
  >
    No scores submitted yet. Be the first on
    this week&apos;s leaderboard.
  </div>
)}
          {rankedLeaders.map((leader, index) => (
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
          ))}
        </div>

        <p style={styles.localNotice}>
          Shared leaderboard for the current weekly
Structural GeoGuess challenge.
        </p>
      </section>
    </div>
  );
}

export default function App() {
  const [quiz, setQuiz] = useState(null);
  const [loadingError, setLoadingError] =
    useState("");
  const [loadingAttempt, setLoadingAttempt] =
    useState(0);

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
const [leaderboardLoading, setLeaderboardLoading] =
  useState(false);

const [leaderboardError, setLeaderboardError] =
  useState("");

const [scoreSubmitting, setScoreSubmitting] =
  useState(false);

  useEffect(() => {
    let componentIsActive = true;

    async function getQuiz() {
      setQuiz(null);
      setLoadingError("");

      try {
        const weeklyQuiz =
          await loadWeeklyQuiz();

        if (componentIsActive) {
          setQuiz(weeklyQuiz);
        }
      } catch (error) {
        if (componentIsActive) {
          setLoadingError(
            error instanceof Error
              ? error.message
              : "The weekly quiz could not be loaded."
          );
        }
      }
    }

    getQuiz();

    return () => {
      componentIsActive = false;
    };
  }, [loadingAttempt]);
  async function refreshLeaderboard() {
    if (!quiz?.quizId) {
      return;
    }

    setLeaderboardLoading(true);
    setLeaderboardError("");

    try {
      const databaseScores =
        await getLeaderboard(quiz.quizId);

      const formattedScores =
        databaseScores.map((databaseScore) => ({
          id: databaseScore.id,
          name: databaseScore.player_name,
          score: databaseScore.score,
          submittedAt:
            databaseScore.submitted_at,
        }));

      setLeaders(formattedScores);
    } catch (error) {
      setLeaderboardError(
        error instanceof Error
          ? error.message
          : "The leaderboard could not be loaded."
      );
    } finally {
      setLeaderboardLoading(false);
    }
  }

  useEffect(() => {
    if (quiz?.quizId) {
      refreshLeaderboard();
    }
  }, [quiz]);

  if (loadingError) {
    return (
      <main style={styles.app}>
        <section style={styles.centredCard}>
          <div style={styles.errorIcon}>⚠️</div>

          <h1 style={styles.errorTitle}>
            The weekly quiz could not be loaded
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.5,
            }}
          >
            Check the formatting and filenames in
            the public quiz files.
          </p>

          <div style={styles.errorMessage}>
            {loadingError}
          </div>

          <button
            type="button"
            style={styles.retryButton}
            onClick={() =>
              setLoadingAttempt(
                (currentAttempt) =>
                  currentAttempt + 1
              )
            }
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  if (!quiz) {
    return (
      <main style={styles.app}>
        <section style={styles.centredCard}>
          <div style={styles.spinner}>🌍</div>

          <h1 style={styles.errorTitle}>
            Loading this week&apos;s quiz
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Preparing four structural mysteries...
          </p>
        </section>
      </main>
    );
  }

  const rounds = quiz.questions;
  const round = rounds[roundIndex];

  const progress =
    ((roundIndex + 1) / rounds.length) * 100;

  const maximumGameScore = rounds.reduce(
    (total, currentRound) =>
      total +
      MAX_LOCATION_POINTS +
      (currentRound.historical
        ? MAX_YEAR_POINTS
        : 0),
    0
  );

  const selectedMinimumYear =
    round.minimumYear ?? 1750;

  const selectedMaximumYear =
    round.maximumYear ?? 2026;

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

    const nextRoundIndex = roundIndex + 1;
    const nextRound = rounds[nextRoundIndex];

    setRoundIndex(nextRoundIndex);
    setGuess(null);
    setResult(null);

    setSelectedYear(
      nextRound.historical
        ? nextRound.minimumYear ?? 1900
        : 1900
    );
  }

  function restartGame() {
    setRoundIndex(0);
    setScore(0);
    setGuess(null);
    setResult(null);
    setFinished(false);
    setPlayerName("");
    setScoreSaved(false);
    setShowLeaderboard(false);

    setSelectedYear(
      rounds[0].historical
        ? rounds[0].minimumYear ?? 1900
        : 1900
    );
  }

  async function saveScore() {
    const cleanName = playerName.trim();

    if (
      !cleanName ||
      scoreSaved ||
      scoreSubmitting
    ) {
      return;
    }

    if (!quiz.quizId) {
      setLeaderboardError(
        "This quiz needs a quizId in quiz.json before scores can be submitted."
      );

      return;
    }

    setScoreSubmitting(true);
    setLeaderboardError("");

    try {
      await submitScore({
        playerName: cleanName,
        score,
        quizId: quiz.quizId,
        quizTitle:
          quiz.quizSubtitle ||
          quiz.quizTitle ||
          "Structural GeoGuess",
      });

      setScoreSaved(true);

      await refreshLeaderboard();

      setShowLeaderboard(true);
    } catch (error) {
      setLeaderboardError(
        error instanceof Error
          ? error.message
          : "Your score could not be submitted."
      );
    } finally {
      setScoreSubmitting(false);
    }
  }

  if (finished) {
    const percentage = Math.round(
      (score / maximumGameScore) * 100
    );

    let finalMessage =
      "A solid effort. Practice makes perfect.";

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
            {quiz.quizTitle ||
              "Structural GeoGuess"}
          </h1>

          <p style={styles.subtitle}>
            {quiz.quizSubtitle}
          </p>

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
    ...(
      !playerName.trim() ||
      scoreSubmitting
        ? styles.disabledButton
        : {}
    ),
  }}
  disabled={
    !playerName.trim() ||
    scoreSubmitting
  }
  onClick={saveScore}
>
  {scoreSubmitting
    ? "Submitting..."
    : "Add score"}
</button>
              
              </div>
              {leaderboardError && (
  <div
    style={{
      marginTop: "12px",
      padding: "11px",
      borderRadius: "11px",
      background: "#450a0a",
      color: "#fecaca",
      fontSize: "13px",
    }}
  >
    {leaderboardError}
  </div>
)}

            </div>
          ) : (
            <div style={styles.savedMessage}>
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
              style={styles.finalPrimaryButton}
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
            <img
              src="/images/logo.png"
              alt="Structural Discipline logo"
              style={styles.logo}
            />

            <p style={styles.eyebrow}>
              TECHNICAL COMMUNITIES
            </p>

            <h1 style={styles.title}>
              {quiz.quizTitle ||
                "Structural GeoGuess"}
            </h1>

            {quiz.quizSubtitle && (
              <p style={styles.subtitle}>
                {quiz.quizSubtitle}
              </p>
            )}
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
              onClick={() =>
                setShowLeaderboard(true)
              }
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
            Question {roundIndex + 1} of{" "}
            {rounds.length}
          </span>

          <span>
            Up to{" "}
            {(
              MAX_LOCATION_POINTS +
              (round.historical
                ? MAX_YEAR_POINTS
                : 0)
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
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Identify the structure
            </h2>

            <span style={styles.sectionNote}>
              Study the image, then place your pin
            </span>
          </div>

          <QuizImage
            key={round.image}
            image={round.image}
            name={round.name}
            location={round.location}
            revealAnswer={Boolean(result)}
          />

          {round.clue && (
            <div style={styles.clueBox}>
              <strong>Structural clue: </strong>
              {round.clue}
            </div>
          )}
        </section>

        <section style={styles.card}>
          <div style={styles.sectionHeader}>
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
                min={selectedMinimumYear}
                max={selectedMaximumYear}
                value={selectedYear}
                disabled={Boolean(result)}
                onChange={(event) =>
                  setSelectedYear(
                    Number(event.target.value)
                  )
                }
                style={styles.range}
              />

              <div style={styles.rangeLabels}>
                <span>{selectedMinimumYear}</span>
                <span>{selectedMaximumYear}</span>
              </div>
            </div>
          )}

          {!result ? (
            <button
              type="button"
              style={{
                ...styles.primaryButton,
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
                <div style={styles.answerLabel}>
                  ANSWER
                </div>

                <h2 style={styles.resultTitle}>
                  {round.name}
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
                      +
                      {result.locationPoints.toLocaleString()}
                    </span>
                  </div>

                  {round.historical && (
                    <div style={styles.resultMetric}>
                      <span style={styles.metricLabel}>
                        YEAR SCORE
                      </span>

                      <span style={styles.metricValue}>
                        +
                        {result.yearPoints.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div style={styles.resultMetric}>
                    <span style={styles.metricLabel}>
                      ROUND SCORE
                    </span>

                    <span style={styles.metricValue}>
                      +
                      {result.roundPoints.toLocaleString()}
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
          onClose={() =>
            setShowLeaderboard(false)
          }
        />
      )}
    </main>
  );
}