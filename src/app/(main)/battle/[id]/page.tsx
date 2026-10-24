import { Suspense } from 'react';
import { BattleArena } from '@/components/battle/BattleArena';

interface BattlePageProps {
  params: Promise<{ id: string }>;
}

async function BattleContent({ params }: BattlePageProps) {
  const { id } = await params;
  return <BattleArena battleId={id} />;
}

export default function BattleArenaPage({ params }: BattlePageProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-[#050507] text-zinc-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin" />
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">SYS_INITIALIZING_ARENA...</span>
          </div>
        </div>
      }
    >
      <BattleContent params={params} />
    </Suspense>
  );
}
