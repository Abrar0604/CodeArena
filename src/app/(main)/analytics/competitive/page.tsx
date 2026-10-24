import { redirect } from 'next/navigation';

export default function CompetitiveAnalyticsPage() {
  redirect('/analytics?tab=competitive');
}
