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

interface SpeakingCardProps {
  word: Word;
}

export default function SpeakingCard({ word }: SpeakingCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const nativeAudioRef = useRef<HTMLAudioElement>(null);
  const userAudioRef = useRef<HTMLAudioElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to use this feature.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playNative = () => {
    if (word.audioUrl && nativeAudioRef.current) {
      nativeAudioRef.current.play();
    } else {
      // Fallback to TTS
      const utterance = new SpeechSynthesisUtterance(word.exampleSentence);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const playRecording = () => {
    if (userAudioRef.current) {
      userAudioRef.current.play();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto">
      {/* Native Audio */}
      {word.audioUrl && (
        <audio ref={nativeAudioRef} src={word.audioUrl} />
      )}
      
      {/* User Recording */}
      {audioURL && (
        <audio ref={userAudioRef} src={audioURL} />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-8xl mb-6">🎤</div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">
          Speaking Practice
        </h2>
        <p className="text-xl text-gray-600">
          Listen, practice, and compare your pronunciation
        </p>
      </div>

      {/* Sentence to Read */}
      <div className="mb-8 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Read this sentence:
        </h3>
        <p className="text-3xl text-gray-900 leading-relaxed text-center font-semibold">
          {word.exampleSentence}
        </p>
        <div className="mt-6 text-center">
          <p className="text-xl text-gray-600 mb-2">
            <span className="font-bold">{word.term}</span> • {word.translation}
          </p>
          <p className="text-lg text-gray-500 italic">{word.definition}</p>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Native Speaker */}
        <div className="p-6 bg-blue-50 rounded-2xl text-center">
          <div className="text-4xl mb-3">🔊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Native Speaker
          </h3>
          <button
            onClick={playNative}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg"
          >
            Play Original
          </button>
          <p className="text-sm text-gray-500 mt-3">
            {word.audioUrl ? "Audio available" : "Text-to-speech"}
          </p>
        </div>

        {/* User Recording */}
        <div className="p-6 bg-purple-50 rounded-2xl text-center">
          <div className="text-4xl mb-3">🎙️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Your Recording
          </h3>
          {!isRecording && !audioURL && (
            <button
              onClick={startRecording}
              className="px-8 py-4 bg-purple-600 text-white rounded-xl text-lg font-bold hover:bg-purple-700 transition-all shadow-lg"
            >
              Start Recording
            </button>
          )}
          {isRecording && (
            <button
              onClick={stopRecording}
              className="px-8 py-4 bg-red-600 text-white rounded-xl text-lg font-bold hover:bg-red-700 transition-all shadow-lg animate-pulse"
            >
              🔴 Stop Recording
            </button>
          )}
          {audioURL && !isRecording && (
            <div>
              <button
                onClick={playRecording}
                className="px-8 py-4 bg-green-600 text-white rounded-xl text-lg font-bold hover:bg-green-700 transition-all shadow-lg mb-3"
              >
                Play My Recording
              </button>
              <button
                onClick={() => {
                  setAudioURL("");
                  setAudioBlob(null);
                }}
                className="block mx-auto text-sm text-gray-600 hover:text-gray-900 font-semibold"
              >
                Record Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-200">
        <h3 className="text-xl font-bold text-amber-900 mb-3">💡 Tips:</h3>
        <ul className="space-y-2 text-lg text-amber-800">
          <li>• Listen to the native speaker first</li>
          <li>• Pay attention to pronunciation and intonation</li>
          <li>• Record yourself reading the sentence</li>
          <li>• Compare your recording with the original</li>
          <li>• Practice multiple times until you're satisfied</li>
        </ul>
      </div>
    </div>
  );
}
