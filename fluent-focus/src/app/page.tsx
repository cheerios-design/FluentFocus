import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tight">
            FluentFocus
          </h1>
          <p className="text-2xl md:text-4xl font-bold mb-4 text-blue-50">
            Master TOEFL & IELTS Vocabulary
          </p>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
            Daily practice for Turkish speakers • Reading, Listening, Writing & Speaking
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/practice"
              className="bg-white text-purple-600 px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl"
            >
              Start Learning
            </Link>
            <Link
              href="/about"
              className="border-4 border-white text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-white/10 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black text-center mb-20 text-gray-900">
            Four Skills, One Platform
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Reading */}
            <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-6xl mb-6">📖</div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Reading</h3>
              <p className="text-lg text-gray-600">
                Learn words in context with real example sentences
              </p>
            </div>

            {/* Listening */}
            <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-6xl mb-6">🎧</div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Listening</h3>
              <p className="text-lg text-gray-600">
                Practice pronunciation with native audio recordings
              </p>
            </div>

            {/* Writing */}
            <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-6xl mb-6">✍️</div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Writing</h3>
              <p className="text-lg text-gray-600">
                Timed exercises to use new vocabulary actively
              </p>
            </div>

            {/* Speaking */}
            <div className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-6xl mb-6">🎤</div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Speaking</h3>
              <p className="text-lg text-gray-600">
                Record yourself and compare with native speakers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-6xl font-black text-blue-400 mb-4">1200+</div>
              <div className="text-2xl font-semibold">IELTS Words</div>
            </div>
            <div>
              <div className="text-6xl font-black text-purple-400 mb-4">5000+</div>
              <div className="text-2xl font-semibold">TOEFL Terms</div>
            </div>
            <div>
              <div className="text-6xl font-black text-pink-400 mb-4">Daily</div>
              <div className="text-2xl font-semibold">New Practice</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
