import { getLeaderboard } from '@/server/actions/leaderboard';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const limitNum = limit ? parseInt(limit, 10) : 10;

    const leaderboard = await getLeaderboard(limitNum);
    return Response.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}