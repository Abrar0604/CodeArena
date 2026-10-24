import { SEED_PROBLEMS } from './data';
import { Problem } from '@/types';

export function getAllAvailableProblems(): Problem[] {
  let custom: Problem[] = [];

  // Only read from file system on server side
  if (typeof window === 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path');
      const file = path.join(process.cwd(), 'src/lib/problems/custom_problems.json');
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, 'utf-8');
        custom = JSON.parse(raw);
      }
    } catch {}
  } else {
    // In browser client, check if stored in localStorage
    try {
      const raw = localStorage.getItem('codearena_custom_problems');
      if (raw) {
        custom = JSON.parse(raw);
      }
    } catch {}
  }

  if (Array.isArray(custom) && custom.length > 0) {
    const customSlugs = new Set(custom.map((p) => p.slug));
    const nonDuplicateSeed = SEED_PROBLEMS.filter((p) => !customSlugs.has(p.slug));
    return [...custom, ...nonDuplicateSeed];
  }

  return SEED_PROBLEMS;
}

export function getProblemBySlugOrId(idOrSlug: string): Problem | undefined {
  const all = getAllAvailableProblems();
  return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}
