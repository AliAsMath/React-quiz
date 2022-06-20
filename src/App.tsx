import { useState } from "react";
import { Difficulty, fetchQuizQuestions, QuestionState } from "./API";
import { GlobalStyle, Wrapper } from "./App.styles";
import { QuestionCart } from "./component/QuestionCart";

const TOTAL_QUESTION = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    const fetchedQuestions = await fetchQuizQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY
    );
    setQuestions(fetchedQuestions);
    setScore(0);
    setNumber(0);
    setUserAnswers([]);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (gameOver) return;

    const choise = e.currentTarget.value;
    const correct = choise === questions[number].correct_answer;
    correct && setScore((prev) => prev + 1);

    setUserAnswers((prev) => [
      ...prev,
      {
        question: questions[number].question,
        answer: choise,
        correct,
        correctAnswer: questions[number].correct_answer,
      },
    ]);
  };

  const nextQuestion = () => {
    if (number === TOTAL_QUESTION - 1) return setGameOver(true);
    setNumber((prev) => prev + 1);
  };
  return (
    <>
      <GlobalStyle />
      <Wrapper className="App">
        <h1>React Quiz</h1>
        {(gameOver || userAnswers.length === TOTAL_QUESTION) && (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        )}
        {!gameOver && <p className="score">Score: {score}</p>}
        {loading && <p>Loading Questions...</p>}
        {!loading && !gameOver && (
          <QuestionCart
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTION}
            question={questions[number]?.question}
            answers={questions[number]?.answers}
            userAnswer={userAnswers[number]}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTION - 1 && (
            <button className="next" onClick={nextQuestion}>
              Next Question
            </button>
          )}
      </Wrapper>
    </>
  );
}

export default App;
