import { notFound } from '../../lib/errors'
import type { Home, Member } from '../../lib/types'

export async function insertHome(db: D1Database, name: string): Promise<Home> {
  const home = { id: crypto.randomUUID(), name }
  await db.prepare('INSERT INTO homes (id, name) VALUES (?, ?)').bind(home.id, name).run()
  return home
}

/** Loads a home or throws 404. */
export async function requireHome(db: D1Database, id: string): Promise<Home> {
  const home = await db.prepare('SELECT id, name FROM homes WHERE id = ?').bind(id).first<Home>()
  if (!home) throw notFound('Home')
  return home
}

/** Next position is computed inside the same statement, so two inserts can't get the same one. */
export async function insertMember(db: D1Database, homeId: string, name: string): Promise<Member> {
  const member = { id: crypto.randomUUID(), homeId, name }
  await db
    .prepare(
      `INSERT INTO members (id, home_id, name, position)
       SELECT ?1, ?2, ?3, COALESCE(MAX(position), 0) + 1 FROM members WHERE home_id = ?2`,
    )
    .bind(member.id, homeId, name)
    .run()
  return member
}

/** Members in the order they joined the home. */
export async function listMembers(db: D1Database, homeId: string): Promise<Member[]> {
  const { results } = await db
    .prepare('SELECT id, home_id AS homeId, name FROM members WHERE home_id = ? ORDER BY position')
    .bind(homeId)
    .all<Member>()
  return results
}
