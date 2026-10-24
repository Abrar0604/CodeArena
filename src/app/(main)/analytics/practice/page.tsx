import { redirect } from 'next/navigation';

export default function PracticeAnalyticsPage() {
  redirect('/analytics?tab=practice');
}
