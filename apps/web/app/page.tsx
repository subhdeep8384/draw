"use client";

import { useRouter } from "next/navigation";
import NavBar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NavBar />
      <LandingPage />
    </div>
  );
}

import { redirect } from "next/navigation";
function LandingPage() {
  const router = useRouter()
  return (
    <main className="bg-black text-white min-h-screen min-w-screen">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Draw Together. In Real-Time.
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl">
          Create rooms, chat instantly, and sketch anything with infinite zoom and live preview.
          A faster, smoother alternative to Excalidraw.
        </p>
        <div className="mt-8 flex gap-4">
          <button 
            onClick={() => router.push("/dashboard")}
          className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200">
            Create Room
          </button>
          <button className="border border-gray-600 px-6 py-3 rounded-xl hover:bg-gray-800">
            Join Room
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Built for Real-Time Collaboration
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Live Drawing",
              desc: "See strokes instantly as others draw. No refresh, no delay.",
            },
            {
              title: "Infinite Canvas",
              desc: "Zoom, pan, and explore without limits using smooth controls.",
            },
            {
              title: "Rooms & Chat",
              desc: "Create private rooms and chat while collaborating.",
            },
            {
              title: "Shapes & Free Draw",
              desc: "Draw rectangles, circles, lines, or sketch freely.",
            },
            {
              title: "Grab & Zoom",
              desc: "Smooth panning and zooming like professional tools.",
            },
            {
              title: "Live Preview",
              desc: "Preview shapes in real-time before placing them.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="border border-gray-800 rounded-2xl p-6 hover:bg-gray-900 transition"
            >
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Create a Room</h3>
              <p className="text-gray-400">
                Start a session and share the room link with your team.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">2. Collaborate</h3>
              <p className="text-gray-400">
                Draw, chat, and interact in real-time on the same canvas.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">3. Build Ideas</h3>
              <p className="text-gray-400">
                Turn sketches into ideas faster with seamless interaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-4xl font-bold">
          Start Drawing Now
        </h2>
        <p className="mt-4 text-gray-400">
          No setup. Just create a room and share the link.
        </p>

        <button className="mt-8 bg-white text-black px-8 py-4 rounded-xl font-medium hover:bg-gray-200">
          Launch App
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Draw App. All rights reserved.
      </footer>
    </main>
  )
}
