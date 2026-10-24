import { LanguageConfig, LanguageKey } from '@/types';

export const SUPPORTED_LANGUAGES: Record<LanguageKey, LanguageConfig> = {
  python: {
    id: 71, // Python (3.8.1)
    name: 'Python 3',
    monacoLang: 'python',
    extension: 'py',
    defaultCode: `import sys\n\ndef solve():\n    # Read input from stdin\n    lines = sys.stdin.read().splitlines()\n    if not lines:\n        return\n    # Your solution here\n\nif __name__ == '__main__':\n    solve()\n`,
  },
  javascript: {
    id: 63, // JavaScript (Node.js 12.14.0)
    name: 'JavaScript',
    monacoLang: 'javascript',
    extension: 'js',
    defaultCode: `const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n    // Your solution here\n}\n\nsolve();\n`,
  },
  cpp: {
    id: 54, // C++ (GCC 9.2.0)
    name: 'C++',
    monacoLang: 'cpp',
    extension: 'cpp',
    defaultCode: `#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Your solution here\n    return 0;\n}\n`,
  },
  java: {
    id: 62, // Java (OpenJDK 13.0.1)
    name: 'Java',
    monacoLang: 'java',
    extension: 'java',
    defaultCode: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your solution here\n    }\n}\n`,
  },
  go: {
    id: 60, // Go (1.13.5)
    name: 'Go',
    monacoLang: 'go',
    extension: 'go',
    defaultCode: `package main\n\nimport (\n\t"bufio"\n\t"fmt"\n\t"os"\n)\n\nfunc main() {\n\t// Your solution here\n\t_ = bufio.NewScanner(os.Stdin)\n}\n`,
  },
};

export const DEFAULT_LANGUAGE: LanguageKey = 'python';

export const RATING_TIERS = [
  { name: 'Grandmaster', minRating: 2200, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { name: 'Master', minRating: 2000, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { name: 'Diamond', minRating: 1800, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { name: 'Platinum', minRating: 1600, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { name: 'Gold', minRating: 1400, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { name: 'Silver', minRating: 1200, color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
  { name: 'Bronze', minRating: 0, color: 'text-amber-700', bg: 'bg-amber-700/10', border: 'border-amber-700/30' },
];

export function getRatingTier(rating: number) {
  for (const tier of RATING_TIERS) {
    if (rating >= tier.minRating) return tier;
  }
  return RATING_TIERS[RATING_TIERS.length - 1];
}

export const BATTLE_CONFIG = {
  DEFAULT_TIME_LIMIT_SECONDS: 900, // 15 minutes
  MATCHMAKING_RATING_WINDOW: 250,  // ±250 ELO initial search window
  MATCHMAKING_TIMEOUT_SECONDS: 60, // 1 minute max wait
  MAX_SUBMISSION_PER_MINUTE: 10,
};
