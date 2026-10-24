import { Suspense } from 'react';
import { BattleResults } from '@/components/battle/BattleResults';

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

async function ResultsContent({ params }: ResultsPageProps) {
  const { id } = await params;
  return <BattleResults battleId={id} />;
}

export default function BattleResultsPage({ params }: ResultsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050507] text-zinc-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin" />
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">SYS_CALCULATING_VERDICT...</span>
          </div>
        </div>
      }
    >
      <ResultsContent params={params} />
    </Suspense>
  );
}
