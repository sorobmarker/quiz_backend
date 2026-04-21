import QuizSettings from "../models/QuizSettings.js";

export const defaultQuizSettings = {
  questionsPerQuiz: 10,
  secondsPerQuestion: 30
};

export const getOrCreateQuizSettings = async () => {
  let settings = await QuizSettings.findOne();

  if (!settings) {
    settings = await QuizSettings.create(defaultQuizSettings);
  }

  return settings;
};
