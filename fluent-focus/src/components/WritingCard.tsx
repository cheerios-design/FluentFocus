"use client";

import { useState, useEffect } from "react";

interface Word {
  id: number;
  term: string;
  translation: string;
  definition: string;
  exampleSentence: string;
}

interface WritingCardProps {
  word: Word;
}

export default function WritingCard({ word }: WritingCardProps) {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [userText, setUserText] = useState("");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setUserText("");
    setTimeLeft(120);
  };

  const handleSave = () => {
    // Save to localStorage for now
    const savedEssays = JSON.parse(localStorage.getItem("essays") || "[]");
    savedEssays.push({
      word: word.term,
      text: userText,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("essays", JSON.stringify(savedEssays));
    alert("Essay saved! ✅");
  };

  const wordCount = userText.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-8xl mb-6">✍️</div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">
          Timed Writing Exercise
        </h2>
        <p className="text-xl text-gray-600">
          Write a sentence or paragraph using this word
        </p>
      </div>

      {/* Word Display */}
      <div className="mb-8 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <h3 className="text-5xl font-black text-center text-gray-900 mb-4">
          {word.term}
        </h3>
        <p className="text-xl text-center text-gray-600 mb-2">{word.translation}</p>
        
        <button
          onClick={() => setShowHint(!showHint)}
          className="block mx-auto mt-4 px-6 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          {showHint ? "Hide" : "Show"} Hint
        </button>
        
        {showHint && (
          <div className="mt-4 p-4 bg-white rounded-xl">
            <p className="text-lg text-gray-700">{word.definition}</p>
            <p className="text-md text-gray-500 italic mt-2">Example: "{word.exampleSentence}"</p>
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="text-center mb-8">
        <div
          className={`text-6xl font-black mb-4 ${
            timeLeft < 30 ? "text-red-500 animate-pulse" : "text-gray-900"
          }`}
        >
          {formatTime(timeLeft)}
        </div>
        {!isActive && timeLeft === 120 && (
          <button
            onClick={handleStart}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-2xl font-bold hover:shadow-xl transition-all transform hover:scale-105"
          >
            Start Timer
          </button>
        )}
      </div>

      {/* Text Area */}
      <div className="mb-6">
        <textarea
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder="Start writing here... Use the word in a meaningful sentence or short paragraph."
          className="w-full h-64 px-6 py-4 text-xl border-4 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none resize-none"
          disabled={!isActive && timeLeft === 120}
        />
        <div className="flex justify-between items-center mt-3 px-2">
          <span className="text-lg text-gray-600">
            Word count: <span className="font-bold">{wordCount}</span>
          </span>
          {userText.toLowerCase().includes(word.term.toLowerCase()) && (
            <span className="text-green-600 font-bold">✓ Word used!</span>
          )}
        </div>
      </div>

      {/* Actions */}
      {(isActive || timeLeft === 0) && userText.trim() && (
        <div className="text-center">
          <button
            onClick={handleSave}
            className="px-12 py-4 bg-green-600 text-white rounded-2xl text-2xl font-bold hover:bg-green-700 transition-all shadow-xl"
          >
            💾 Save Essay
          </button>
        </div>
      )}

      {timeLeft === 0 && (
        <div className="mt-6 p-6 bg-amber-50 rounded-2xl border-2 border-amber-200 text-center">
          <p className="text-2xl font-bold text-amber-900">⏰ Time's up!</p>
          <p className="text-lg text-amber-700 mt-2">
            Great job! Review your writing and save it if you're happy with it.
          </p>
        </div>
      )}
    </div>
  );
}
