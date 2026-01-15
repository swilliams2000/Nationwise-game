import { useEffect, useState } from "react";
import countries from "../data/countries.json";

function Hints({ wrongCount = 0, hintData }) {
  const [initialReveal, setInitialReveal] = useState(false);

  const hintLabels = [
    "CONTINENT",
    "FUN FACT 1",
    "POPULATION",
    "FUN FACT 2",
    "CAPITAL CITY",
  ];
  const hintEmojis = ["🌍", "✨", "👥", "📜", "🏛️"];
  const hintValues = hintData
    ? [
        hintData.continent,
        hintData.funFact1,
        hintData.population,
        hintData.funFact2,
        hintData.capital,
      ]
    : ["", "", "", "", ""];

  useEffect(() => {
    const timer = setTimeout(() => setInitialReveal(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalRevealed = initialReveal
    ? Math.min(hintLabels.length, 1 + wrongCount)
    : 0;

  return (
    <div className="Hints">
      {hintLabels.map((label, i) => (
        <div
          key={i}
          className={`hint-card ${i < totalRevealed ? "revealed" : ""}`}
        >
          <div className="hint-inner">
            <div className="hint-front">{label}</div>
            <div className="hint-back">
              <span className="hint-emoji">{hintEmojis[i]}</span>
              {hintValues[i]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
function GuessSystem({
  onIncorrect,
  onCorrect,
  onFail,
  disabled = false,
  correctCountry,
}) {
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const submitGuess = () => {
    if (disabled || !input.trim() || guesses.length >= 5) return;

    const isCorrect =
      input.trim().toLowerCase() === correctCountry.toLowerCase();

    const match =
      selectedCountry ||
      countries.find(
        (c) => c.name.toLowerCase() === input.trim().toLowerCase()
      );
    const nextGuesses = [
      ...guesses,
      { text: input, correct: isCorrect, flagUrl: match?.flagUrl },
    ];
    setGuesses(nextGuesses);
    if (!isCorrect) {
      if (typeof onIncorrect === "function") {
        onIncorrect();
      }
      if (nextGuesses.length >= 5 && typeof onFail === "function") {
        onFail(correctCountry);
      }
    } else if (typeof onCorrect === "function") {
      onCorrect(nextGuesses.length);
    }
    setInput("");
    setSelectedCountry(null);
  };

  const normalizedInput = input.trim().toLowerCase();
  const suggestions = normalizedInput
    ? countries
        .filter((c) => c.name.toLowerCase().startsWith(normalizedInput))
        .slice(0, 8)
    : [];
  const showSuggestions = isFocused && suggestions.length > 0 && !disabled;

  const handleSelect = (country) => {
    setInput(country.name);
    setSelectedCountry(country);
    setIsFocused(false);
  };

  return (
    <>
      <div className="guess-area">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`guess-bar ${
              guesses[i]?.correct === true
                ? "right"
                : guesses[i]?.correct === false
                ? "wrong"
                : ""
            }`}
          >
            {guesses[i]?.flagUrl ? (
              <img className="guess-flag" src={guesses[i].flagUrl} alt="" />
            ) : null}
            {guesses[i]?.text || ""}
          </div>
        ))}
      </div>

      <div className="input-zone">
        <input
          className="guess-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSelectedCountry(null);
          }}
          placeholder="Pick a Country!"
          onKeyDown={(e) => e.key === "Enter" && submitGuess()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
        />
        {showSuggestions ? (
          <div className="autocomplete-list">
            {suggestions.map((country) => (
              <button
                key={country.name}
                type="button"
                className="autocomplete-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(country);
                }}
              >
                <img
                  className="autocomplete-flag"
                  src={country.flagUrl}
                  alt=""
                />
                <span className="autocomplete-name">{country.name}</span>
              </button>
            ))}
          </div>
        ) : null}
        <button
          className="submit-btn"
          onClick={submitGuess}
          disabled={disabled}
        >
          Guess
        </button>
      </div>
    </>
  );
}

export default Hints;
export { GuessSystem };
