'use client';

import React, { useState } from 'react';
import { TestResult } from '@/types';
import { Check, X, Clock, HardDrive, Terminal } from 'lucide-react';

interface TestResultsProps {
  results: TestResult[] | null;
  isRunning: boolean;
  activeCustomInput: string;
  onCustomInputChange: (val: string) => void;
  customOutput?: string | null;
  onRunCustom: () => void;
}

export function TestResults({
  results,
  isRunning,
  activeCustomInput,
  onCustomInputChange,
  customOutput,
  onRunCustom,
}: TestResultsProps) {
  const [activeTab, setActiveTab] = useState<'tests' | 'custom'>('tests');
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState<number>(0);

  const selectedResult = results && results.length > 0 ? results[selectedTestCaseIdx] : null;
  const allPassed = results && results.length > 0 && results.every((r) => r.passed);

  return (
    <div className="h-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-none overflow-hidden font-mono text-xs">
      {/* Segmented Tab Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'tests'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            TEST_CASES {results && `(${results.filter((r) => r.passed).length}/${results.length})`}
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'custom'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            CUSTOM_STDIN
          </button>
        </div>

        {results && results.length > 0 && activeTab === 'tests' && (
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
            {allPassed ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> [ALL TESTS PASSED]
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400">
                <X className="w-3.5 h-3.5 stroke-[3]" /> [TESTS FAILED]
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {isRunning ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-400">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 bg-emerald-400 animate-ping" />
              <span>EXECUTING_SANDBOX_RUNTIME...</span>
            </div>
          </div>
        ) : activeTab === 'custom' ? (
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex-1 flex flex-col">
              <label className="text-[10px] uppercase text-zinc-500 mb-1">
                // INPUT_STDIN
              </label>
              <textarea
                value={activeCustomInput}
                onChange={(e) => onCustomInputChange(e.target.value)}
                placeholder="Enter input parameters..."
                className="w-full flex-1 p-2 bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-none focus:outline-none focus:border-zinc-500 resize-none font-mono"
              />
            </div>
            <button
              onClick={onRunCustom}
              className="px-3 py-1.5 self-start bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 active:translate-y-[1px]"
            >
              <Terminal className="w-3 h-3" /> [RUN CUSTOM INPUT]
            </button>
            {customOutput !== undefined && (
              <div className="flex-1 flex flex-col">
                <label className="text-[10px] uppercase text-zinc-500 mb-1">
                  // OUTPUT_STDOUT
                </label>
                <pre className="w-full flex-1 p-2 bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 overflow-auto font-mono">
                  {customOutput || '(Empty output)'}
                </pre>
              </div>
            )}
          </div>
        ) : !results || results.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-1.5">
            <Terminal className="w-6 h-6 text-zinc-600" />
            <p className="tracking-wider uppercase text-[11px]">// RUN TESTS TO EVALUATE EXECUTION TELEMETRY</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Case selector tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {results.map((r, idx) => (
                <button
                  key={r.test_case_id}
                  onClick={() => setSelectedTestCaseIdx(idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 border text-[11px] font-bold uppercase tracking-wider transition ${
                    selectedTestCaseIdx === idx
                      ? 'border-zinc-500 bg-zinc-900 text-zinc-100'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {r.passed ? (
                    <span className="text-emerald-400 font-black">✓</span>
                  ) : (
                    <span className="text-rose-400 font-black">✗</span>
                  )}
                  <span>CASE_{idx + 1}</span>
                </button>
              ))}
            </div>

            {selectedResult && (
              <div className="space-y-2.5 bg-zinc-900 border border-zinc-800 p-3">
                {/* Metrics header */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-3 tabular-nums">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {selectedResult.execution_time_ms ?? 0}ms
                    </span>
                    <span className="text-zinc-700">|</span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-cyan-400" />
                      {selectedResult.memory_used_kb ?? 0}KB
                    </span>
                  </div>
                  <span
                    className={`font-bold uppercase tracking-wider ${
                      selectedResult.passed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    [{selectedResult.status_description}]
                  </span>
                </div>

                {/* Input */}
                <div>
                  <div className="text-[10px] uppercase text-zinc-500 mb-0.5">INPUT:</div>
                  <pre className="p-1.5 bg-[#050507] border border-zinc-800 text-zinc-300 overflow-x-auto text-xs">
                    {selectedResult.input}
                  </pre>
                </div>

                {/* Expected vs Actual Output */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] uppercase text-zinc-500 mb-0.5">EXPECTED:</div>
                    <pre className="p-1.5 bg-[#050507] border border-zinc-800 text-cyan-400 overflow-x-auto text-xs">
                      {selectedResult.expected_output}
                    </pre>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-zinc-500 mb-0.5">ACTUAL_OUTPUT:</div>
                    <pre
                      className={`p-1.5 bg-[#050507] border border-zinc-800 overflow-x-auto text-xs ${
                        selectedResult.passed ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {selectedResult.actual_output || '(No output)'}
                    </pre>
                  </div>
                </div>

                {selectedResult.error && (
                  <div>
                    <div className="text-[10px] uppercase text-rose-400 mb-0.5">// ERROR_DIAGNOSTIC:</div>
                    <pre className="p-2 bg-rose-950/20 border border-rose-900/60 text-rose-300 overflow-x-auto whitespace-pre-wrap text-xs">
                      {selectedResult.error}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
