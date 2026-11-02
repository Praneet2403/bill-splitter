import { Hono } from 'hono'
import { readBody } from '../../lib/body'
import { ApiError } from '../../lib/errors'
import type { AppEnv } from '../../lib/types'
import { listMembers, requireHome } from '../homes/homes.repo'
import { insertBill, listBills } from './bills.repo'
import { createBillSchema } from './bills.schema'

export const billsRoutes = new Hono<AppEnv>()

billsRoutes.post('/homes/:homeId/bills', async (c) => {
  const home = await requireHome(c.env.DB, c.req.param('homeId'))
  const { title, totalCents } = await readBody(c, createBillSchema)

  const members = await listMembers(c.env.DB, home.id)
  if (members.length === 0) throw new ApiError(422, 'Add a member before adding a bill')

  const bill = await insertBill(c.env.DB, { homeId: home.id, title, totalCents, members })
  return c.json(bill, 201)
})

billsRoutes.get('/homes/:homeId/bills', async (c) => {
  const home = await requireHome(c.env.DB, c.req.param('homeId'))
  return c.json({ bills: await listBills(c.env.DB, home.id) })
})
