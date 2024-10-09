import React, { useState, useEffect } from "react";

const SDG6Game = () => {
  const [cityHealth, setCityHealth] = useState(50);
  const [resources, setResources] = useState(100);
  const [day, setDay] = useState(1);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [gameState, setGameState] = useState("intro"); // 'intro', 'playing', 'gameOver'

  const events = [
    {
      title: "Water Scarcity",
      description: "The city is facing a severe water shortage.",
      icon: "🏜️",
      options: [
        {
          text: "Implement water-saving technologies",
          resourceCost: 20,
          healthEffect: 15,
        },
        {
          text: "Increase water extraction from rivers",
          resourceCost: 10,
          healthEffect: -10,
        },
        { text: "Do nothing", resourceCost: 0, healthEffect: -20 },
      ],
    },
    {
      title: "Water Pollution",
      description: "Industrial waste is contaminating the city's water supply.",
      icon: "🏭",
      options: [
        {
          text: "Enforce stricter regulations",
          resourceCost: 30,
          healthEffect: 20,
        },
        {
          text: "Provide water filters to residents",
          resourceCost: 15,
          healthEffect: 5,
        },
        { text: "Ignore the problem", resourceCost: 0, healthEffect: -25 },
      ],
    },
    {
      title: "Sanitation Crisis",
      description: "A neighborhood lacks proper sanitation facilities.",
      icon: "🚽",
      options: [
        {
          text: "Build a local treatment plant",
          resourceCost: 40,
          healthEffect: 25,
        },
        {
          text: "Distribute portable toilets",
          resourceCost: 20,
          healthEffect: 10,
        },
        {
          text: "Advise residents to manage on their own",
          resourceCost: 0,
          healthEffect: -15,
        },
      ],
    },
    {
      title: "Ecosystem Threat",
      description: "The local wetland is in danger due to urban expansion.",
      icon: "🌿",
      options: [
        { text: "Create a protected area", resourceCost: 35, healthEffect: 20 },
        {
          text: "Limit expansion partially",
          resourceCost: 15,
          healthEffect: 5,
        },
        {
          text: "Continue urban development",
          resourceCost: -10,
          healthEffect: -20,
        },
      ],
    },
  ];

  useEffect(() => {
    if (gameState === "playing") {
      if (cityHealth <= 0 || resources <= 0) {
        setGameState("gameOver");
      } else if (!currentEvent) {
        setCurrentEvent(events[Math.floor(Math.random() * events.length)]);
      }
    }
  }, [gameState, cityHealth, resources, currentEvent]);

  const handleOption = (option) => {
    setCityHealth(Math.min(100, Math.max(0, cityHealth + option.healthEffect)));
    setResources(resources - option.resourceCost);
    setDay(day + 1);
    setCurrentEvent(null);
  };

  const startGame = () => {
    setCityHealth(50);
    setResources(100);
    setDay(1);
    setCurrentEvent(null);
    setGameState("playing");
  };

  const IntroScreen = () => (
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold mb-4">
        Welcome to Water City Manager!
      </h2>
      <p className="mb-4">
        As the city's water manager, you'll face various challenges related to
        clean water and sanitation. Make decisions wisely to keep your city
        healthy and sustainable!
      </p>
      <button
        onClick={startGame}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Game
      </button>
    </div>
  );

  const PlayingScreen = () => (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <div>Day: {day}</div>
        <div>Resources: {resources}</div>
      </div>
      <div className="mb-4">
        <div className="mb-2">City Health:</div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 rounded-full h-4"
            style={{ width: `${cityHealth}%` }}
          ></div>
        </div>
      </div>
      {currentEvent && (
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-bold mb-2">
            <span className="mr-2 text-3xl">{currentEvent.icon}</span>
            {currentEvent.title}
          </h3>
          <p className="mb-4">{currentEvent.description}</p>
          <div className="space-y-2">
            {currentEvent.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOption(option)}
                className="w-full bg-white hover:bg-blue-50 border border-blue-500 text-blue-700 font-semibold py-2 px-4 rounded flex justify-between items-center"
              >
                <span>{option.text}</span>
                <span>Cost: {option.resourceCost}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const GameOverScreen = () => (
    <div className="text-center p-6">
      <h3 className="text-2xl font-bold mb-4">Game Over</h3>
      <p className="mb-4">You managed the city for {day} days.</p>
      <p className="mb-4">
        {cityHealth > 80
          ? "Great job! Your city thrived under your management."
          : cityHealth > 50
          ? "Good effort! Your city survived, but there's room for improvement."
          : "Your city struggled. Keep learning about sustainable water management!"}
      </p>
      <p className="mb-4">
        Remember, sustainable water management is crucial for real cities too.
        Every decision impacts people's lives and the environment.
      </p>
      <button
        onClick={startGame}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Play Again
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-2xl font-bold text-center">
          Water City Manager: SDG 6 Challenge
        </h2>
      </div>
      <div>
        {gameState === "intro" && <IntroScreen />}
        {gameState === "playing" && <PlayingScreen />}
        {gameState === "gameOver" && <GameOverScreen />}
      </div>
    </div>
  );
};

export default SDG6Game;
