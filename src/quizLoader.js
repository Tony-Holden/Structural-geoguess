export async function loadWeeklyQuiz() {
  const response = await fetch("/quiz.json", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Could not load quiz.json. Server returned ${response.status}.`
    );
  }

  const quiz = await response.json();

  validateQuiz(quiz);

  return quiz;
}

function validateQuiz(quiz) {
  if (!quiz || typeof quiz !== "object") {
    throw new Error("quiz.json does not contain a valid quiz.");
  }

  if (
    !Array.isArray(quiz.questions) ||
    quiz.questions.length !== 4
  ) {
    throw new Error(
      "quiz.json must contain exactly four questions."
    );
  }

  quiz.questions.forEach((question, index) => {
    const questionNumber = index + 1;

    if (!question.name) {
      throw new Error(
        `Question ${questionNumber} needs a name.`
      );
    }

    if (!question.location) {
      throw new Error(
        `Question ${questionNumber} needs a location.`
      );
    }

    if (
      typeof question.latitude !== "number" ||
      question.latitude < -90 ||
      question.latitude > 90
    ) {
      throw new Error(
        `Question ${questionNumber} has an invalid latitude.`
      );
    }

    if (
      typeof question.longitude !== "number" ||
      question.longitude < -180 ||
      question.longitude > 180
    ) {
      throw new Error(
        `Question ${questionNumber} has an invalid longitude.`
      );
    }

    if (!question.image) {
      throw new Error(
        `Question ${questionNumber} needs an image path.`
      );
    }

    if (
      question.historical &&
      typeof question.year !== "number"
    ) {
      throw new Error(
        `Historical question ${questionNumber} needs a construction year.`
      );
    }
  });
}