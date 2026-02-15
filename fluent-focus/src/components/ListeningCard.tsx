"use client";

import { useState, useRef } from "react";

interface Word {
  id: number;
  term: string;
  translation: string;
  definition: string;
  exampleSentence: string;
  audioUrl: string | null;
}

interface ListeningCardProps {
  word: Word;
}

export default function ListeningCard({ word }: ListeningCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (word.audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(word.term);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleCheck = () => {
    setShowResult(true);
  };

  const isCorrect = userAnswer.toLowerCase().trim() === word.term.toLowerCase();

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto">
      {/* Audio */}
      {word.audioUrl && (
        <audio
          ref={audioRef}
          src={word.audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-8xl mb-6">🎧</div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">
          Listen & Type
        </h2>
        <p className="text-xl text-gray-600">
          Listen to the pronunciation and type what you hear
        </p>
      </div>

      {/* Play Button */}
      <div className="text-center mb-12">
        <button
          onClick={playAudio}
          className={`px-16 py-8 text-3xl font-bold rounded-3xl shadow-xl transition-all transform hover:scale-105 ${
            isPlaying
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          }`}
        >
          {isPlaying ? "🔊 Playing..." : "▶️ Play Audio"}
        </button>
        <p className="text-sm text-gray-500 mt-4">
          {word.audioUrl ? "Native speaker audio" : "Browser text-to-speech"}
        </p>
      </div>

      {/* Input */}
      <div className="mb-8">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type the word you heard..."
          className="w-full px-8 py-6 text-3xl text-center border-4 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none"
          disabled={showResult}
        />
      </div>

      {/* Check Button */}
      {!showResult && (
        <div className="text-center">
          <button
            onClick={handleCheck}
            disabled={!userAnswer.trim()}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-2xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div
          className={`p-8 rounded-2xl text-center ${
            isCorrect
              ? "bg-green-100 border-4 border-green-300"
              : "bg-red-100 border-4 border-red-300"
          }`}
        >
          <div className="text-6xl mb-4">{isCorrect ? "✅" : "❌"}</div>
          <p className="text-3xl font-bold mb-4">
            {isCorrect ? "Correct!" : "Not quite right"}
          </p>
          {!isCorrect && (
            <div>
              <p className="text-xl text-gray-700 mb-2">The correct answer is:</p>
              <p className="text-4xl font-black text-gray-900 mb-4">{word.term}</p>
            </div>
          )}
          <div className="mt-6 p-6 bg-white rounded-2xl">
            <p className="text-xl text-gray-700 mb-2">{word.definition}</p>
            <p className="text-lg text-gray-600 italic mt-4">"{word.exampleSentence}"</p>
            <p className="text-2xl font-bold text-amber-700 mt-4">{word.translation}</p>
          </div>
          <button
            onClick={() => {
              setShowResult(false);
              setUserAnswer("");
            }}
            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
