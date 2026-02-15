export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            About FluentFocus
          </h1>
          <p className="text-2xl text-gray-600">
            Your daily companion for TOEFL & IELTS success
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">🎯 Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            FluentFocus is designed specifically for Turkish speakers preparing for TOEFL and IELTS exams. 
            We understand the challenges of learning academic English vocabulary, and we've built a platform 
            that makes daily practice engaging, effective, and enjoyable.
          </p>
          <p className="text-xl text-gray-700 leading-relaxed">
            Our approach focuses on the four essential language skills: Reading, Listening, Writing, and Speaking. 
            Each word you learn is reinforced through multiple contexts and practice methods, ensuring deep 
            understanding and long-term retention.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">✨ Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-2xl">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Rich Content</h3>
              <p className="text-lg text-gray-700">
                1200+ IELTS words and 5000+ TOEFL terms with definitions, examples, and Turkish translations
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-2xl">
              <div className="text-4xl mb-3">🔊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Native Audio</h3>
              <p className="text-lg text-gray-700">
                High-quality pronunciation audio from native speakers for accurate listening practice
              </p>
            </div>
            <div className="p-6 bg-pink-50 rounded-2xl">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Spaced Repetition</h3>
              <p className="text-lg text-gray-700">
                Smart algorithm ensures you review words at optimal intervals for maximum retention
              </p>
            </div>
            <div className="p-6 bg-amber-50 rounded-2xl">
              <div className="text-4xl mb-3">🎤</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Active Practice</h3>
              <p className="text-lg text-gray-700">
                Record yourself, write essays, and engage with words actively, not just passively
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">🚀 How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl font-black text-blue-600">1</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Daily Word Selection</h3>
                <p className="text-lg text-gray-700">
                  Each day, you receive a curated set of words based on your level and progress. 
                  New words are mixed with review words to reinforce learning.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl font-black text-purple-600">2</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Four-Skill Practice</h3>
                <p className="text-lg text-gray-700">
                  Practice each word through Reading (context), Listening (pronunciation), 
                  Writing (active use), and Speaking (production).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl font-black text-pink-600">3</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-lg text-gray-700">
                  Monitor your learning journey with detailed statistics. See which words you've mastered 
                  and which ones need more practice.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl font-black text-amber-600">4</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Maintain Streak</h3>
                <p className="text-lg text-gray-700">
                  Build a daily learning habit and watch your streak grow. Consistency is key to language mastery!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-8">⚙️ Built With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">⚛️</div>
              <p className="font-bold">Next.js 14</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📘</div>
              <p className="font-bold">TypeScript</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🗄️</div>
              <p className="font-bold">PostgreSQL</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎨</div>
              <p className="font-bold">Tailwind CSS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
