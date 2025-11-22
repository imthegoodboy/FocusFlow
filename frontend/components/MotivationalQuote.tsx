'use client';

const quotes = [
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
];

export default function MotivationalQuote() {
  const today = new Date().getDate();
  const quote = quotes[today % quotes.length];

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
      <p className="text-lg font-semibold mb-2">💪 Daily Motivation</p>
      <p className="text-xl font-bold italic mb-2">"{quote.text}"</p>
      <p className="text-sm opacity-90">— {quote.author}</p>
    </div>
  );
}

