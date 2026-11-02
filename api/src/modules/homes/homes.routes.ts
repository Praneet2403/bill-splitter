import { Hono } from 'hono'
import { readBody } from '../../lib/body'
import type { AppEnv } from '../../lib/types'
import { insertHome, insertMember, listMembers, requireHome } from './homes.repo'
import { nameSchema } from './homes.schema'

export const homesRoutes = new Hono<AppEnv>()

homesRoutes.post('/homes', async (c) => {
  const { name } = await readBody(c, nameSchema)
  return c.json(await insertHome(c.env.DB, name), 201)
})

homesRoutes.get('/homes/:homeId', async (c) => {
  const home = await requireHome(c.env.DB, c.req.param('homeId'))
  const members = await listMembers(c.env.DB, home.id)
  return c.json({ ...home, members })
})

homesRoutes.post('/homes/:homeId/members', async (c) => {
  const home = await requireHome(c.env.DB, c.req.param('homeId'))
  const { name } = await readBody(c, nameSchema)
  return c.json(await insertMember(c.env.DB, home.id, name), 201)
})
