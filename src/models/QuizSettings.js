import mongoose from "mongoose";

const quizSettingsSchema = new mongoose.Schema(
  {
    questionsPerQuiz: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
      default: 10
    },
    secondsPerQuestion: {
      type: Number,
      required: true,
      min: 5,
      max: 300,
      default: 30
    }
  },
  { timestamps: true }
);

const QuizSettings = mongoose.model("QuizSettings", quizSettingsSchema);

export default QuizSettings;
