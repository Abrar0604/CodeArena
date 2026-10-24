import Link from 'next/link';
import { Swords, Zap, Trophy, Cpu, Clock, Terminal, ArrowRight, Play } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative bg-[#050507] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-emerald-400" />
          <span>CODEARENA_V1 // 1V1 COMPETITIVE PROGRAMMING ENGINE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto uppercase leading-[1.05]">
          THE COMPETITIVE CODING BATTLEGROUND
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Match with programmers in real time. Race to solve algorithmic challenges evaluated by{' '}
          <strong className="text-zinc-200">Execution Velocity</strong>,{' '}
          <strong className="text-zinc-200">Runtime Complexity</strong>, and{' '}
          <strong className="text-zinc-200">Memory Efficiency</strong>.
        </p>

        {/* CTA Blocks */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
          <Link
            href="/lobby"
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-100 hover:bg-white text-zinc-950 font-black tracking-widest uppercase border border-zinc-200 transition active:translate-y-[1px] flex items-center justify-center gap-2.5"
          >
            <Swords className="w-4 h-4 stroke-[2.5]" />
            <span>[ ENTER BATTLE LOBBY ]</span>
          </Link>

          <Link
            href="/leaderboard"
            className="w-full sm:w-auto px-7 py-3.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-bold tracking-widest uppercase transition flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4 text-zinc-400" />
            <span>[ GLOBAL RANKINGS ]</span>
          </Link>
        </div>

        {/* Tactical Terminal Preview */}
        <div className="pt-10 max-w-5xl mx-auto font-mono">
          <div className="border border-zinc-800 bg-zinc-950 text-left overflow-hidden">
            {/* Terminal Window Bar */}
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-800 bg-zinc-900 text-xs">
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[11px] uppercase tracking-wider font-bold">
                  LIVE_ARENA // MATCH_ID: #8492 // SPEC: TWO_SUM
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-bold tabular-nums">
                <span className="w-2 h-2 bg-emerald-400" />
                <span>SYS_TIME: 12:45 REMAINING</span>
              </div>
            </div>

            {/* Split Arena Interface */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800 text-xs">
              {/* Problem Statement Preview */}
              <div className="md:col-span-5 p-4 space-y-3 bg-zinc-950">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <span className="font-bold text-zinc-100 uppercase tracking-wider">01: TWO SUM</span>
                  <span className="text-[10px] px-1.5 py-0.2 border border-emerald-800 text-emerald-400 font-bold uppercase">
                    [EASY]
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px] font-sans">
                  Given an array of integers <code className="text-zinc-200">nums</code> and an integer <code className="text-zinc-200">target</code>, return indices of the two numbers such that they add up to target.
                </p>
                <div className="p-2 bg-[#050507] border border-zinc-800 font-mono text-[11px] text-zinc-300">
                  $ input: [2, 7, 11, 15], target = 9<br />
                  $ output: 0 1
                </div>
              </div>

              {/* Code & Telemetry Preview */}
              <div className="md:col-span-7 p-4 space-y-3 bg-[#050507]">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                    PYTHON 3.10 // PISTON SANDBOX ENGINE
                  </span>
                  <span className="text-emerald-400 text-[11px] font-bold">
                    ✓ [5/5 SUITE PASSED]
                  </span>
                </div>

                <pre className="text-[11px] text-zinc-300 bg-zinc-950 p-3 border border-zinc-800 overflow-x-auto leading-relaxed">
{`def solve(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return f"{seen[diff]} {i}"
        seen[num] = i`}
                </pre>

                {/* Score Metric Monoliths */}
                <div className="grid grid-cols-3 gap-2 text-center tabular-nums">
                  <div className="p-2 bg-zinc-950 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">CORRECTNESS</div>
                    <div className="font-bold text-emerald-400 text-sm">50 / 50</div>
                  </div>
                  <div className="p-2 bg-zinc-950 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SPEED BONUS</div>
                    <div className="font-bold text-cyan-400 text-sm">22.4 / 25</div>
                  </div>
                  <div className="p-2 bg-zinc-950 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">EFFICIENCY</div>
                    <div className="font-bold text-zinc-200 text-sm">23.1 / 25</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="text-left space-y-2 mb-10 font-mono">
          <div className="text-xs text-zinc-500 uppercase tracking-widest">// SYSTEM_ARCHITECTURE</div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            ENGINEERED FOR RIGOROUS CODE EVALUATION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-5 bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="text-zinc-500 text-[10px] tracking-widest uppercase">01 // MATCHMAKING</div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">REALTIME PAIRING</h3>
            <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
              Sub-second queue latency matching coders within ±250 ELO brackets with deterministic bot sparring fallback.
            </p>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="text-zinc-500 text-[10px] tracking-widest uppercase">02 // SCORING ENGINE</div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">TRI-METRIC COMPOSITE</h3>
            <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
              50% Correctness, 25% Speed velocity, and 25% Algorithmic Efficiency benchmarked against language-optimal space-time profiles.
            </p>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="text-zinc-500 text-[10px] tracking-widest uppercase">03 // SKILL SYSTEM</div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">RANKED ELO ENGINE</h3>
            <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
              Standard competitive programming rating with dynamic K-factors scaling from Bronze (1200) to Grandmaster (2200+).
            </p>
          </div>
        </div>
      </section>

      {/* Technical Footer */}
      <footer className="border-t border-zinc-800 py-6 px-4 text-center font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
        <p>CODEARENA SYSTEM // 2026 // MONACO EDITOR + PISTON SANDBOX ENGINE</p>
      </footer>
    </div>
  );
}
