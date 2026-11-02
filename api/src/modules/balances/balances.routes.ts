import { Hono } from 'hono'
import type { AppEnv } from '../../lib/types'
import { requireHome } from '../homes/homes.repo'
import { listBalances } from './balances.repo'

export const balancesRoutes = new Hono<AppEnv>()

balancesRoutes.get('/homes/:homeId/balances', async (c) => {
  const home = await requireHome(c.env.DB, c.req.param('homeId'))
  return c.json({ balances: await listBalances(c.env.DB, home.id) })
})
