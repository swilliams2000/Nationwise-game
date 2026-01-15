import { useState } from "react";
import Header from "../components/Header";
import Hints, { GuessSystem } from "../components/Hints";
import hintData from "../data/hints.json";

function GamePage() {
  const [wrongCount, setWrongCount] = useState(0);
  const [winTries, setWinTries] = useState(null);
  const [failAnswer, setFailAnswer] = useState(null);
  const [gameId, setGameId] = useState(0);
  const [hintIndex, setHintIndex] = useState(() => {
    if (!hintData.length) return null;
    return Math.floor(Math.random() * hintData.length);
  });
  const currentHint =
    hintIndex === null ? null : hintData[hintIndex] || null;
  const hasWon = winTries !== null;
  const hasFailed = failAnswer !== null;

  const resetGame = () => {
    setWrongCount(0);
    setWinTries(null);
    setFailAnswer(null);
    setHintIndex(() => {
      if (!hintData.length) return null;
      return Math.floor(Math.random() * hintData.length);
    });
    setGameId((id) => id + 1);
  };

  return (
    <div className="app-wrapper">
      <Header />
      <Hints
        key={`hints-${gameId}`}
        wrongCount={wrongCount}
        hintData={currentHint}
      />
      <GuessSystem
        key={`guesses-${gameId}`}
        disabled={hasWon || hasFailed}
        onIncorrect={() => setWrongCount((c) => c + 1)}
        onCorrect={(tries) => {
          setWinTries(tries);
        }}
        onFail={(answer) => setFailAnswer(answer)}
        correctCountry={currentHint ? currentHint.country : ""}
      />
      {hasWon ? (
        <div className="win-overlay">
          <div className="win-card">
            <div className="win-title">Good Job!</div>
            <div className="win-subtitle">Tries: {winTries}</div>
            <button className="play-again-btn" onClick={resetGame}>
              Play again
            </button>
          </div>
        </div>
      ) : null}
      {hasFailed ? (
        <div className="win-overlay">
          <div className="fail-card">
            <div className="fail-title">You aren't Cultured</div>
            <div className="fail-subtitle">Answer: {failAnswer}</div>
            <button className="play-again-btn" onClick={resetGame}>
              Play again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default GamePage;
