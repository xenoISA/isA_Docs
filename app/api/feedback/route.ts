import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/isa_docs'

// Lazy singleton connection pool with graceful degradation
let pool: Pool | null = null
let pgAvailable = true
let tableCreated = false

function getPool(): Pool | null {
  if (!pgAvailable) return null
  if (pool) return pool

  try {
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 30000,
    })
    pool.on('error', () => {
      pgAvailable = false
      pool?.end().catch(() => {})
      pool = null
    })
    return pool
  } catch {
    pgAvailable = false
    return null
  }
}

async function ensureTable(client: Pool): Promise<void> {
  if (tableCreated) return
  await client.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL,
      page TEXT,
      helpful BOOLEAN,
      comment TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  tableCreated = true
}

export async function POST(request: NextRequest) {
  try {
    const { page, rating, comment } = await request.json()

    if (!page || !rating || !['helpful', 'not-helpful'].includes(rating)) {
      return NextResponse.json({ error: 'Invalid feedback' }, { status: 400 })
    }

    const entry = {
      page,
      helpful: rating === 'helpful',
      comment: comment?.slice(0, 1000) || '',
    }

    const db = getPool()
    if (db) {
      try {
        await ensureTable(db)
        await db.query(
          'INSERT INTO feedback (page, helpful, comment) VALUES ($1, $2, $3)',
          [entry.page, entry.helpful, entry.comment]
        )
      } catch (err) {
        // DB write failed — fall back to console.log
        console.error('Feedback DB write failed, logging to console:', err)
        console.log('FEEDBACK:', JSON.stringify({ ...entry, timestamp: new Date().toISOString() }))
      }
    } else {
      // No DB available — log to console
      console.log('FEEDBACK:', JSON.stringify({ ...entry, timestamp: new Date().toISOString() }))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ success: true }) // Don't fail the UX
  }
}
