import { getStats } from '@/server/actions/leaderboard';

export async function GET() {
  try {
    const stats = await getStats();
    return Response.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}