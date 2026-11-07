-- Potvrdio Target Stores & Outreach Database Schema
-- Lightweight SQLite schema for managing WooCommerce pilot candidate stores and communication history

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    website TEXT NOT NULL UNIQUE,
    sector TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    legal_entity TEXT,
    priority TEXT CHECK(priority IN ('p1_verified', 'p2_unverified', 'disqualified')) DEFAULT 'p1_verified',
    status TEXT CHECK(status IN ('not_contacted', 'email_sent', 'waiting_reply', 'replied', 'call_scheduled', 'closed_beta', 'rejected', 'on_hold')) DEFAULT 'not_contacted',
    hook_note TEXT,
    growth_opportunities TEXT,
    tech_stack TEXT,
    contact_person TEXT,
    notes TEXT,
    follow_up_due DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS communications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    channel TEXT CHECK(channel IN ('email', 'phone', 'viber', 'sms', 'in_person', 'note')) DEFAULT 'email',
    direction TEXT CHECK(direction IN ('outbound', 'inbound', 'internal')) DEFAULT 'outbound',
    subject TEXT,
    content TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    follow_up_due DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_priority ON stores(priority);
CREATE INDEX IF NOT EXISTS idx_stores_follow_up ON stores(follow_up_due);
CREATE INDEX IF NOT EXISTS idx_communications_store_id ON communications(store_id);
CREATE INDEX IF NOT EXISTS idx_communications_timestamp ON communications(timestamp);
