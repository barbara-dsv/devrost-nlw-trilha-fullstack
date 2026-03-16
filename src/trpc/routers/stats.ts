import { baseProcedure, createTRPCRouter } from '../init';
import { getStats } from '@/server/actions/leaderboard';

export const statsRouter = createTRPCRouter({
  getStats: baseProcedure.query(async () => {
    const stats = await getStats();
    return stats;
  }),
});
