# ⚔️ CodeArena — 1v1 Competitive Coding Battle Platform

**CodeArena** is a real-time, 1v1 competitive coding battle platform engineered with a high-status tactical terminal aesthetic. Competitors match in real time, race against an active digital chronometer, and solve algorithmic challenges scored on **Speed**, **Time Complexity ($O(N)$)**, and **Space Complexity ($O(1)$)**.

---

## ⚡ Key Architecture & Features

- **Monolithic Terminal Design System:** Void `#050507` baseline, 1px hairline zinc borders, razor-sharp geometric corners (`rounded-none`), monospace tabular figures, zero party confetti.
- **Dynamic 1v1 Matchmaking:** Range-based ELO queue ($\pm 250$ window) with geometric radar sweep and instant bot fallback.
- **Multi-Factor Scoring Engine:** Correctness (50%), Submission Speed (25%), and Time/Memory Efficiency (25%).
- **Piston v2 Execution Engine:** Secure, sandboxed execution with CPU limits, memory quotas, and standard stream (`stdin`/`stdout`) evaluation across Python 3, JavaScript, C++, Java, and Go.
- **Master Problem Studio (`/admin/problems`):** Ingest problems via 1-click templates, interactive Piston pre-flight verification, or **Bulk JSON Import**.

---

## 📋 Problem Schema & JSON Import Format

The Master Problem Studio accepts a **single problem object** or an **array of problem objects** (`.json`). You can upload or paste this format directly into the **`[JSON BATCH IMPORT]`** tab at `/admin/problems`.

### Example JSON Payload (`problems.json`)

```json
[
  {
    "title": "Valid Palindrome",
    "slug": "valid-palindrome",
    "difficulty": "easy",
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\n### Input Format\n- A single line containing the string `s`.\n\n### Output Format\n- Print `true` or `false`.\n\n### Example 1\n```\nInput: A man, a plan, a canal: Panama\nOutput: true\n```",
    "constraints": {
      "time_limit_ms": 1000,
      "memory_limit_kb": 64000
    },
    "sample_test_cases": [
      {
        "id": 1,
        "input": "A man, a plan, a canal: Panama",
        "expected_output": "true"
      },
      {
        "id": 2,
        "input": "race a car",
        "expected_output": "false"
      }
    ],
    "hidden_test_cases": [
      {
        "id": 101,
        "input": " ",
        "expected_output": "true"
      },
      {
        "id": 102,
        "input": "0P",
        "expected_output": "false"
      },
      {
        "id": 103,
        "input": "ab_a",
        "expected_output": "true"
      }
    ],
    "starter_code": {
      "python": "import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    clean = [c.lower() for c in s if c.isalnum()]\n    print('true' if clean == clean[::-1] else 'false')\n\nif __name__ == '__main__':\n    solve()\n",
      "javascript": "const fs = require('fs');\n\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    console.log(clean === clean.split('').reverse().join('') ? 'true' : 'false');\n}\n\nsolve();\n"
    },
    "optimal_benchmarks": {
      "python": { "optimal_time_ms": 25, "optimal_memory_kb": 4500 },
      "javascript": { "optimal_time_ms": 28, "optimal_memory_kb": 5000 }
    }
  },
  {
    "title": "Merge Intervals",
    "slug": "merge-intervals",
    "difficulty": "medium",
    "description": "Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of non-overlapping intervals.\n\n### Input Format\n- First line contains `N`, the number of intervals.\n- Next `N` lines each contain two space-separated integers `start end`.\n\n### Output Format\n- Print each merged interval `start end` on a new line.",
    "constraints": {
      "time_limit_ms": 1000,
      "memory_limit_kb": 64000
    },
    "sample_test_cases": [
      {
        "id": 1,
        "input": "4\n1 3\n2 6\n8 10\n15 18",
        "expected_output": "1 6\n8 10\n15 18"
      },
      {
        "id": 2,
        "input": "2\n1 4\n4 5",
        "expected_output": "1 5"
      }
    ],
    "hidden_test_cases": [
      {
        "id": 101,
        "input": "1\n1 4",
        "expected_output": "1 4"
      },
      {
        "id": 102,
        "input": "3\n1 4\n0 2\n3 5",
        "expected_output": "0 5"
      }
    ]
  }
]
```

### JSON Field Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | **Yes** | Human-readable problem name (e.g. `"Merge Intervals"`). |
| `slug` | `string` | Optional | Unique URL identifier (`"merge-intervals"`). Auto-derived if omitted. |
| `difficulty` | `"easy"` \| `"medium"` \| `"hard"` | **Yes** | Rating band and matchmaking filter tier. |
| `description` | `string` (Markdown) | **Yes** | Statement, input specifications, and output requirements. |
| `constraints` | `object` | Optional | Execution quotas: `{ "time_limit_ms": 1000, "memory_limit_kb": 64000 }`. |
| `sample_test_cases` | `array` | **Yes** | Public test cases displayed in the competitor's problem drawer. |
| `hidden_test_cases` | `array` | Optional | Anti-cheat / edge cases evaluated silently during full submission. |
| `starter_code` | `object` | Optional | Boilerplate code mapping for languages (`python`, `javascript`, `cpp`, `java`, `go`). |
| `optimal_benchmarks`| `object` | Optional | Optimal runtime target in `ms` and memory in `KB` for scoring curves. |

---

## 🛠️ Quickstart (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/codearena.git
cd codearena
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# Piston Sandbox URL (Defaults to EMKC or your self-hosted Docker URL)
PISTON_API_URL=https://emkc.org/api/v2/piston/execute
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view CodeArena.

---

## 🚀 100% Free Deployment ($0/mo)

1. **Database:** Create a free project at [supabase.com](https://supabase.com). Run `supabase/migrations/001_schema.sql` in the Supabase SQL editor.
2. **Realtime:** In Supabase, enable replication on `battles`, `matchmaking_queue`, and `submissions`.
3. **Web Hosting:** Deploy the repository to [Vercel](https://vercel.com) (Hobby tier). Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Vercel Environment Variables.
4. **Code Execution:** Uses the built-in Piston execution adapter with zero external API fees.

---

## 🛡️ Master Admin Endpoints

- **Problem Studio UI:** `/admin/problems`
- **A/B Testing Analytics:** `/admin/experiments`
- **List / Batch Import Problems API:** `POST /api/admin/problems`
- **Pre-flight Piston Verifier API:** `POST /api/admin/problems/verify`
