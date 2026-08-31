import { useState } from "react";

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "16 / 9",
    overflow: "hidden",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, #38bdf8 0%, #1d4ed8 55%, #0f172a 100%)",
  },

  image: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(2,6,23,0.78), transparent 45%)",
    pointerEvents: "none",
  },

  label: {
    position: "absolute",
    left: "18px",
    right: "18px",
    bottom: "18px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "15px",
    pointerEvents: "none",
  },

  mysteryLabel: {
    display: "inline-block",
    padding: "9px 13px",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "999px",
    background: "rgba(2,6,23,0.68)",
    color: "white",
    fontSize: "13px",
    fontWeight: "800",
    backdropFilter: "blur(8px)",
  },

  answerPanel: {
    maxWidth: "75%",
    padding: "11px 15px",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "14px",
    background: "rgba(2,6,23,0.76)",
    color: "white",
    backdropFilter: "blur(8px)",
  },

  answerName: {
    display: "block",
    marginBottom: "3px",
    fontSize: "18px",
    fontWeight: "900",
  },

  answerLocation: {
    display: "block",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "700",
  },

  errorPanel: {
    position: "absolute",
    inset: 0,
    display: "grid",
    padding: "25px",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #334155, #0f172a)",
    color: "white",
    textAlign: "center",
  },

  errorIcon: {
    display: "block",
    marginBottom: "12px",
    fontSize: "50px",
  },

  errorTitle: {
    display: "block",
    marginBottom: "7px",
    fontSize: "19px",
    fontWeight: "900",
  },

  errorText: {
    display: "block",
    color: "#cbd5e1",
    fontSize: "13px",
    lineHeight: 1.5,
  },
};

export default function QuizImage({
  image,
  name,
  location,
  revealAnswer = false,
}) {
  const [imageFailed, setImageFailed] =
    useState(false);

  return (
    <div style={styles.wrapper}>
      {!imageFailed ? (
        <img
          src={image}
          alt={
            revealAnswer
              ? `${name}, ${location}`
              : "Mystery structure"
          }
          style={styles.image}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div style={styles.errorPanel}>
          <div>
            <span style={styles.errorIcon}>
              the image filename in
              quiz.json exactly matches the file in
              public/images.
            </span>
          </div>
        </div>
      )}

      {!imageFailed && (
        <>
          <div style={styles.overlay} />

          <div style={styles.label}>
            {revealAnswer ? (
              <div style={styles.answerPanel}>
                <span style={styles.answerName}>
                  {name}
                </span>

                <span style={styles.answerLocation}>
                  {location}
                </span>
              </div>
            ) : (
              <span style={styles.mysteryLabel}>
                Where in the world is this structure?
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
