"use client";

import { useState, useEffect } from "react";
import ReadingCard from "@/components/ReadingCard";
import ListeningCard from "@/components/ListeningCard";
import WritingCard from "@/components/WritingCard";
import SpeakingCard from "@/components/SpeakingCard";

interface Word {
  id: number;
  term: string;
  translation: string;
  definition: string;
  exampleSentence: string;
  audioUrl: string | null;
  examType: string;
  difficulty: string;
  progressStatus: string;
}

export default function PracticePage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSkill, setActiveSkill] = useState<"reading" | "listening" | "writing" | "speaking">("reading");

  useEffect(() => {
    fetchDailyWords();
  }, []);

  async function fetchDailyWords() {
    try {
      setLoading(true);
      const response = await fetch("/api/daily");
      const data = await response.json();
      
      if (data.success) {
        // Combine new and review words
        const allWords = [
          ...(data.data.newWords || []),
          ...(data.data.reviewWords || []),
        ];
        setWords(allWords);
      }
    } catch (error) {
      console.error("Failed to fetch words:", error);
    } finally {
      setLoading(false);
    }
  }

  const currentWord = words[currentIndex];

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📚</div>
          <p className="text-2xl font-bold text-gray-700">Loading your daily words...</p>
        </div>
      </div>
    );
  }

  if (!words.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">No Words Found</h2>
          <p className="text-lg text-gray-600 mb-6">
            Please run the database seeding script first:
          </p>
          <code className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-mono">
            npm run db:seed
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Daily Practice
          </h1>
          <p className="text-2xl text-gray-600">
            Word {currentIndex + 1} of {words.length}
          </p>
        </div>

        {/* Skill Selector */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {[
            { skill: "reading" as const, icon: "📖", label: "Reading" },
            { skill: "listening" as const, icon: "🎧", label: "Listening" },
            { skill: "writing" as const, icon: "✍️", label: "Writing" },
            { skill: "speaking" as const, icon: "🎤", label: "Speaking" },
          ].map(({ skill, icon, label }) => (
            <button
              key={skill}
              onClick={() => setActiveSkill(skill)}
              className={`px-8 py-4 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 ${
                activeSkill === skill
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl"
                  : "bg-white text-gray-700 shadow-lg hover:shadow-xl"
              }`}
            >
              <span className="text-2xl mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Skill Components */}
        <div className="mb-12">
          {activeSkill === "reading" && <ReadingCard word={currentWord} />}
          {activeSkill === "listening" && <ListeningCard word={currentWord} />}
          {activeSkill === "writing" && <WritingCard word={currentWord} />}
          {activeSkill === "speaking" && <SpeakingCard word={currentWord} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-8 py-4 bg-white text-gray-700 rounded-2xl text-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-full h-4 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
