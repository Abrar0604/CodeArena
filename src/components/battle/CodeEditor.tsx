'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import { LanguageKey } from '@/types';
import { Play, Send, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  language: LanguageKey;
  onLanguageChange: (lang: LanguageKey) => void;
  onRunTests: () => void;
  onSubmitSolution: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  onResetStarter: () => void;
}

export function CodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onRunTests,
  onSubmitSolution,
  isRunning,
  isSubmitting,
  onResetStarter,
}: CodeEditorProps) {
  const [fontSize, setFontSize] = useState<number>(14);

  const currentLangConfig = SUPPORTED_LANGUAGES[language];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        if (!isSubmitting) onSubmitSolution();
      } else {
        if (!isRunning) onRunTests();
      }
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-none overflow-hidden"
      onKeyDown={handleKeyDown}
    >
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/70 font-mono text-xs">
        {/* Language selector & reset */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as LanguageKey)}
            className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-zinc-100 rounded-none focus:outline-none focus:border-zinc-400 cursor-pointer uppercase"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([key, config]) => (
              <option key={key} value={key}>
                {config.name.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={onResetStarter}
            title="Reset to starter code"
            className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-100 rounded-none transition"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Font size & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 mr-2">
            <span>FONT:</span>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 rounded-none font-mono"
            >
              <option value={12}>12PX</option>
              <option value={14}>14PX</option>
              <option value={16}>16PX</option>
            </select>
          </div>

          {/* Run Tests Button */}
          <button
            onClick={onRunTests}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-100 text-xs font-mono font-bold border border-zinc-700 rounded-none transition active:translate-y-[1px]"
          >
            <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span>{isRunning ? 'TESTING...' : 'RUN TESTS'}</span>
            <kbd className="hidden md:inline text-[9px] px-1 py-0.2 bg-[#050507] text-zinc-400 border border-zinc-800 font-mono">
              ⌘↵
            </kbd>
          </button>

          {/* Submit Button */}
          <button
            onClick={onSubmitSolution}
            disabled={isSubmitting || isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1 bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-950 text-xs font-mono font-black tracking-wider uppercase border border-zinc-200 rounded-none transition active:translate-y-[1px]"
          >
            <Send className="w-3 h-3" />
            <span>{isSubmitting ? 'JUDGING...' : 'SUBMIT'}</span>
            <kbd className="hidden md:inline text-[9px] px-1 py-0.2 bg-zinc-900 text-zinc-100 border border-zinc-700 font-mono">
              ⇧⌘↵
            </kbd>
          </button>
        </div>
      </div>

      {/* Editor Area with safe flex constraints */}
      <div className="flex-1 w-full relative min-h-0 overflow-hidden bg-zinc-950">
        <Editor
          height="100%"
          language={currentLangConfig.monacoLang}
          value={code}
          onChange={(val) => onChange(val || '')}
          theme="vs-dark"
          loading={
            <div className="h-full flex items-center justify-center text-zinc-500 font-mono text-xs">
              INITIALIZING ENGINE...
            </div>
          }
          options={{
            fontSize,
            fontFamily: "'Geist Mono', 'Fira Code', 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            automaticLayout: true,
            tabSize: 4,
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}
