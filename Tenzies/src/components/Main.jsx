import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const Main = () => {
  const [dice, setDice] = React.useState(() => generateAllNewDice());
  const [rollCount, setRollCount] = React.useState(0);
  const [timer, setTimer] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);

  const gameWon = dice.every(
    (die) => die.isHeld && die.value === dice[0].value
  );

  function generateAllNewDice() {
    let arr = [];
    for (let i = 0; i < 10; i++) {
      const random = Math.floor(Math.random() * 6 + 1);
      arr.push({ value: random, isHeld: false, id: nanoid() });
    }
    return arr;
  }

  function hold(id) {
    setDice((prevDice) => {
      return prevDice.map((prevDie) => {
        return prevDie.id === id
          ? { ...prevDie, isHeld: !prevDie.isHeld }
          : prevDie;
      });
    });
  }

  function rollDice() {
    setDice((prevDice) => {
      return prevDice.map((prevDie) => {
        return prevDie.isHeld
          ? prevDie
          : {
              ...prevDie,
              value: Math.floor(Math.random() * 6 + 1),
            };
      });
    });
    setRollCount((prev) => prev + 1);
  }

  function rollOver() {
    setDice(generateAllNewDice());
  }

  const { width, height } = useWindowSize();
  const newGame = React.useRef(null);

  React.useEffect(() => {
    if (gameWon && newGame.current) {
      newGame.current.focus();
    }

    let interval;
    if (!gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => {
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameWon]);

  React.useEffect(() => {
    if (timer >= 60) {
      setMinutes((min) => min + 1);
      setTimer(0);
    }
  });

  return (
    <main>
      {gameWon && (
        <Confetti numberOfPieces={500} height={height} width={width} />
      )}
      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! you won! press "New Game" to start again.</p>
        )}
      </div>
      <div className="rounded-lg bg-white  max-h-[650px] max-w-[550px] flex justify-center items-center flex-col py-10">
        <div className="mb-6 mx-auto max-w-[80%]">
          <h1 className="text-center text-3xl font-bold mb-4">Tenzies</h1>
          <p className="text-center text-lg">
            Roll untill all dice are the same. Click each die to freeze it at
            its current value between rols.
          </p>
        </div>
        <div className="flex gap-8 flex-wrap px-12 justify-center items-center">
          {dice.map((die) => {
            return (
              <Die
                hold={() => hold(die.id)}
                key={die.id}
                isHeld={die.isHeld}
                value={die.value}
              />
            );
          })}
        </div>

        <button
          ref={newGame}
          onClick={gameWon ? rollOver : rollDice}
          className="bg-blue-700 px-10 py-2 rounded-md mt-10 text-white text-2xl cursor-pointer "
        >
          {gameWon ? "New Game" : "Roll"}
        </button>
        <p className="mt-4 text-3xl shadow-lg shadow-gray-500 rounded-xl px-5 py-3  font-bold">
          {gameWon ? 0 : rollCount}
        </p>
        <p className="mt-4 text-3xl shadow-lg shadow-gray-500 rounded-xl px-6 py-3  font-bold">
          {minutes < 10 ? `0${minutes}` : minutes} :{" "}
          {timer < 10 ? `0${timer}` : timer}
        </p>
      </div>
    </main>
  );
};

export default Main;
