"use client";

import { useEffect, useState } from "react";

export default function ProgressPage() {
  const [savedEssays, setSavedEssays] = useState<any[]>([]);

  useEffect(() => {
    // Load saved essays from localStorage
    const essays = JSON.parse(localStorage.getItem("essays") || "[]");
    setSavedEssays(essays);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Your Progress
          </h1>
          <p className="text-2xl text-gray-600">
            Track your learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <div className="text-6xl mb-4">🔥</div>
            <div className="text-5xl font-black text-orange-500 mb-2">0</div>
            <div className="text-xl font-semibold text-gray-700">Day Streak</div>
            <p className="text-sm text-gray-500 mt-2">Keep practicing daily!</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <div className="text-6xl mb-4">📚</div>
            <div className="text-5xl font-black text-blue-500 mb-2">0</div>
            <div className="text-xl font-semibold text-gray-700">Words Learned</div>
            <p className="text-sm text-gray-500 mt-2">Start your journey</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <div className="text-6xl mb-4">✅</div>
            <div className="text-5xl font-black text-green-500 mb-2">0</div>
            <div className="text-xl font-semibold text-gray-700">Words Mastered</div>
            <p className="text-sm text-gray-500 mt-2">Practice makes perfect</p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">🚧 Coming Soon</h2>
          <div className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">📊 Detailed Analytics</h3>
              <p className="text-lg text-gray-600">
                View your progress charts, learning patterns, and detailed word-by-word statistics
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">🎯 Personalized Goals</h3>
              <p className="text-lg text-gray-600">
                Set custom daily goals and track your progress toward exam readiness
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">🏆 Achievements</h3>
              <p className="text-lg text-gray-600">
                Earn badges and rewards as you hit milestones in your learning journey
              </p>
            </div>
          </div>
        </div>

        {/* Saved Essays */}
        {savedEssays.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">📝 Your Writing Practice</h2>
            <div className="space-y-6">
              {savedEssays.map((essay, index) => (
                <div key={index} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Word: <span className="text-purple-600">{essay.word}</span>
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(essay.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {essay.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {savedEssays.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-6">✍️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Writing Practice Yet</h2>
            <p className="text-xl text-gray-600 mb-8">
              Complete writing exercises in the Practice section to see them here
            </p>
            <a
              href="/practice"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-xl font-bold hover:shadow-xl transition-all"
            >
              Start Practicing
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
