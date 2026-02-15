"use client";

import { useState } from "react";

interface Word {
  id: number;
  term: string;
  translation: string;
  definition: string;
  exampleSentence: string;
  examType: string;
  difficulty: string;
}

interface ReadingCardProps {
  word: Word;
}

export default function ReadingCard({ word }: ReadingCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto">
      {/* Word Header */}
      <div className="text-center mb-8">
        <h2 className="text-6xl font-black text-gray-900 mb-4">{word.term}</h2>
        <div className="flex justify-center gap-4 mb-6">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            {word.examType}
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
            {word.difficulty}
          </span>
        </div>
      </div>

      {/* Definition */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4">📚 Definition</h3>
        <p className="text-xl text-gray-800 leading-relaxed bg-gray-50 p-6 rounded-2xl">
          {word.definition}
        </p>
      </div>

      {/* Example Sentence */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4">💬 Example</h3>
        <p className="text-2xl text-gray-800 leading-relaxed bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
          {word.exampleSentence}
        </p>
      </div>

      {/* Translation Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-xl font-bold hover:shadow-xl transition-all transform hover:scale-105"
        >
          {showTranslation ? "Hide" : "Show"} Turkish Translation
        </button>
        
        {showTranslation && (
          <div className="mt-6 p-6 bg-amber-50 rounded-2xl border-2 border-amber-200">
            <p className="text-3xl font-bold text-amber-900">{word.translation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
