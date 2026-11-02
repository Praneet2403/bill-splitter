import { Hono } from 'hono'
import { onError, onNotFound } from './lib/errors'
import type { AppEnv } from './lib/types'
import { balancesRoutes } from './modules/balances/balances.routes'
import { billsRoutes } from './modules/bills/bills.routes'
import { homesRoutes } from './modules/homes/homes.routes'
import { paymentsRoutes } from './modules/payments/payments.routes'

const app = new Hono<AppEnv>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.route('/api', homesRoutes)
app.route('/api', billsRoutes)
app.route('/api', paymentsRoutes)
app.route('/api', balancesRoutes)

app.onError(onError)
app.notFound(onNotFound)

export default app
