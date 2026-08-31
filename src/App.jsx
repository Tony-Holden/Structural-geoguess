import { useState } from "react";

const questions = [
  {
    structure: "Sydney Opera House",
    clue: "A performing arts complex famous for its distinctive shell-shaped roof.",
    options: [
      "Sydney, Australia",
      "Auckland, New Zealand",
      "Singapore",
      "Cape Town, South Africa",
    ],
    correctAnswer: "Sydney, Australia",
    icon: "🎭",
  },
  {
    structure: "Golden Gate Bridge",
    clue: "An iconic orange-red suspension bridge spanning a major coastal strait.",
    options: [
      "Vancouver, Canada",
      "San Francisco, USA",
      "Lisbon, Portugal",
      "Tokyo, Japan",
    ],
    correctAnswer: "San Francisco, USA",
    icon: "🌉",
  },
  {
    structure: "Millau Viaduct",
    clue: "A multi-span cable-stayed bridge crossing a deep valley in southern Europe.",
    options: [
      "Millau, France",
      "Madrid, Spain",
      "Milan, Italy",
      "Munich, Germany",
    ],
    correctAnswer: "Millau, France",
    icon: "🏗️",
  },
  {
    structure: "Brooklyn Bridge",
    clue: "A historic hybrid cable-stayed and suspension bridge completed in 1883.",
    options: [
      "Boston, USA",
      "Chicago, USA",
      "New York City, USA",
      "Washington, D.C., USA",
    ],
    correctAnswer: "New York City, USA",
    icon: "🌁",
  },
];

const styles = {
  app: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #163b65 0%, #07111f 48%, #030914 100%)",
    color: "white",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "24px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "920px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "24px",
  },

  eyebrow: {
    color: "#fb923c",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.22em",
    margin: "0 0 5px",
  },

  title: {
    margin: 0,
    fontSize: "clamp(28px, 5vw, 46px)",
    lineHeight: 1,
    fontWeight: "900",
  },

  scoreBox: {
    minWidth: "120px",
    padding: "12px 18px",
    borderRadius: "16px",
    background: "rgba(15, 23, 42, 0.86)",
    border: "1px solid rgba(255,255,255,0.12)",
    textAlign: "right",
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
  },

  scoreNumber: {
    display: "block",
    fontSize: "23px",
    fontWeight: "900",
  },

  scoreLabel: {
    color: "#94a3b8",
    fontSize: "12px",
  },

  progressTrack: {
    height: "8px",
    borderRadius: "999px",
    background: "#1e293b",
    overflow: "hidden",
    marginBottom: "18px",
  },

  progressBar: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #f97316, #facc15)",
    transition: "width 0.35s ease",
  },

  questionMeta: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "9px",
  },

  card: {
    overflow: "hidden",
    borderRadius: "28px",
    background: "rgba(15, 23, 42, 0.94)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
  },

  hero: {
    minHeight: "275px",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: "35px 24px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 48%, #312e81 100%)",
    position: "relative",
  },

  heroPattern: {
    position: "absolute",
    inset: 0,
    opacity: 0.12,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
    backgroundSize: "42px 42px",
  },

  icon: {
    position: "relative",
    fontSize: "76px",
    lineHeight: 1,
    marginBottom: "14px",
    filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.25))",
  },

  structureName: {
    position: "relative",
    margin: 0,
    fontSize: "clamp(30px, 6vw, 54px)",
    lineHeight: 1.05,
    fontWeight: "900",
    textShadow: "0 5px 18px rgba(0,0,0,0.3)",
  },

  questionBody: {
    padding: "26px",
  },

  prompt: {
    margin: "0 0 7px",
    fontSize: "22px",
    fontWeight: "900",
  },

  clue: {
    margin: "0 0 22px",
    color: "#cbd5e1",
    lineHeight: 1.55,
  },

  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "12px",
  },

  optionButton: {
    width: "100%",
    minHeight: "66px",
    border: "1px solid #334155",
    borderRadius: "16px",
    background: "#1e293b",
    color: "white",
    padding: "14px 17px",
    fontSize: "16px",
    fontWeight: "800",
    textAlign: "left",
    cursor: "pointer",
    transition: "transform 0.15s ease, background 0.15s ease",
  },

  correctButton: {
    background: "#15803d",
    border: "1px solid #4ade80",
  },

  incorrectButton: {
    background: "#b91c1c",
    border: "1px solid #f87171",
  },

  fadedButton: {
    opacity: 0.52,
  },

  feedback: {
    marginTop: "20px",
    borderRadius: "18px",
    padding: "18px",
    background: "#052e2b",
    border: "1px solid rgba(52, 211, 153, 0.35)",
  },

  feedbackTitle: {
    display: "block",
    color: "#6ee7b7",
    fontSize: "20px",
    fontWeight: "900",
    marginBottom: "5px",
  },

  feedbackText: {
    color: "#d1fae5",
    margin: 0,
  },

  nextButton: {
    width: "100%",
    marginTop: "15px",
    border: "none",
    borderRadius: "16px",
    background: "#f97316",
    color: "#07111f",
    padding: "16px",
    fontSize: "17px",
    fontWeight: "900",
    cursor: "pointer",
  },

  resultsCard: {
    marginTop: "12vh",
    padding: "45px 28px",
    borderRadius: "30px",
    background: "rgba(15, 23, 42, 0.96)",
    border: "1px solid rgba(255,255,255,0.11)",
    textAlign: "center",
    boxShadow: "0 25px 70px rgba(0,0,0,0.4)",
  },

  trophy: {
    fontSize: "74px",
    marginBottom: "12px",
  },

  resultScore: {
    margin: "12px 0 0",
    fontSize: "clamp(55px, 12vw, 90px)",
    lineHeight: 1,
    fontWeight: "900",
    color: "#facc15",
  },

  resultLabel: {
    marginTop: "7px",
    color: "#94a3b8",
  },

  restartButton: {
    marginTop: "28px",
    border: "none",
    borderRadius: "16px",
    background: "#f97316",
    color: "#07111f",
    padding: "15px 28px",
    fontSize: "17px",
    fontWeight: "900",
    cursor: "pointer",
  },
};

export default function App() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [finished, setFinished] = useState(false);

  const question = questions[questionIndex];
  const answerIsCorrect =
    selectedAnswer === question.correctAnswer;

  const progress =
    ((questionIndex + 1) / questions.length) * 100;

  function selectAnswer(answer) {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    if (answer === question.correctAnswer) {
      setScore((currentScore) => currentScore + 1000);
    }
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
  }

  function restartGame() {
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setFinished(false);
  }

  function getButtonStyle(option) {
    if (selectedAnswer === null) {
      return styles.optionButton;
    }

    if (option === question.correctAnswer) {
      return {
        ...styles.optionButton,
        ...styles.correctButton,
      };
    }

    if (option === selectedAnswer) {
      return {
        ...styles.optionButton,
        ...styles.incorrectButton,
      };
    }

    return {
      ...styles.optionButton,
      ...styles.fadedButton,
    };
  }

  if (finished) {
    const maximumScore = questions.length * 1000;
    const percentage = Math.round((score / maximumScore) * 100);

    let resultMessage = "A solid start. Time for another lap around the globe.";

    if (percentage === 100) {
      resultMessage = "Perfect score. The structures never stood a chance.";
    } else if (percentage >= 75) {
      resultMessage = "Impressive structural and geographic knowledge.";
    } else if (percentage >= 50) {
      resultMessage = "Good effort. A few landmarks nearly slipped past you.";
    }

    return (
      <main style={styles.app}>
        <div style={styles.container}>
          <section style={styles.resultsCard}>
            <div style={styles.trophy}>🏆</div>

            <p style={styles.eyebrow}>JOURNEY COMPLETE</p>

            <h1 style={styles.title}>Structural GeoGuess</h1>

            <div style={styles.resultScore}>
              {score.toLocaleString()}
            </div>

            <p style={styles.resultLabel}>
              points out of {maximumScore.toLocaleString()}
            </p>

            <p
              style={{
                color: "#e2e8f0",
                fontSize: "18px",
                marginTop: "23px",
              }}
            >
              {resultMessage}
            </p>

            <button
              type="button"
              style={styles.restartButton}
              onClick={restartGame}
            >
              Play again
            </button>
          </section>
        </div>
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
            Question {questionIndex + 1} of {questions.length}
          </span>

          <span>1,000 points available</span>
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
          <div style={styles.hero}>
            <div style={styles.heroPattern} />

            <div>
              <div style={styles.icon}>
                {question.icon}
              </div>

              <h2 style={styles.structureName}>
                {question.structure}
              </h2>
            </div>
          </div>

          <div style={styles.questionBody}>
            <h3 style={styles.prompt}>
              Where in the world is this structure?
            </h3>

            <p style={styles.clue}>
              {question.clue}
            </p>

            <div style={styles.optionsGrid}>
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  style={getButtonStyle(option)}
                  onClick={() => selectAnswer(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <>
                <div style={styles.feedback}>
                  <span style={styles.feedbackTitle}>
                    {answerIsCorrect
                      ? "Correct! +1,000 points"
                      : "Not quite"}
                  </span>

                  <p style={styles.feedbackText}>
                    The correct answer is{" "}
                    <strong>{question.correctAnswer}</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  style={styles.nextButton}
                  onClick={nextQuestion}
                >
                  {questionIndex === questions.length - 1
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