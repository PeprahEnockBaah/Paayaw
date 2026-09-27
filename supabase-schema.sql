-- ============================================================
-- GPM Events — Supabase setup
-- Run this once in your Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- 1. Events table
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  event_date  date not null,
  title       text not null,
  location    text,
  time        text,
  description text,
  tag         text,
  image_url   text
);

-- Lock down direct access from the public (anon) key.
-- The website talks to this table only through the server-side
-- service-role key, which bypasses row-level security.
alter table public.events enable row level security;

-- 2. Public storage bucket for event photos / flyers
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

-- ============================================================
-- Homepage image slider
-- Safe to run again: it only creates what is missing and only
-- seeds the built-in slides when the table is empty.
-- ============================================================

-- 3. Slides table (lower position = shown first)
create table if not exists public.slides (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  image_url   text not null,
  alt         text not null default '',
  banner      boolean not null default false,
  position    integer not null default 0
);

alter table public.slides enable row level security;

-- 4. Public storage bucket for uploaded slider images
insert into storage.buckets (id, name, public)
values ('slider-images', 'slider-images', true)
on conflict (id) do nothing;

-- 5. Start with the slides that ship with the website
insert into public.slides (image_url, alt, banner, position)
select * from (values
  ('/images/hd/prophets-prophecy-banner.jpg', 'Prophets, Prophecy, and Prophetism by Gideon Peprah', true, 1),
  ('/images/hd/V_10.jpg',  'Gideon Peprah Ministries', false, 2),
  ('/images/hd/V_13.jpg',  'Ministry service',         false, 3),
  ('/images/hd/V_23.jpg',  'Worship gathering',        false, 4),
  ('/images/hd/V_44.jpg',  'Church fellowship',        false, 5),
  ('/images/hd/V_45.jpg',  'Ministry gathering',       false, 6),
  ('/images/hd/V_62.jpg',  'Church service',           false, 7),
  ('/images/hd/V_132.jpg', 'Ministry outreach',        false, 8),
  ('/images/hd/V_143.jpg', 'Church gathering',         false, 9),
  ('/images/hd/V_165.jpg', 'Ministry event',           false, 10),
  ('/images/hd/V_188.jpg', 'Gospel outreach',          false, 11),
  ('/images/hd/V_199.jpg', 'Kingdom service',          false, 12),
  ('/images/hd/V_203.jpg', 'Interpreting Destinies',   false, 13),
  ('/images/hd/V_204.jpg', 'Ministry in action',       false, 14)
) as seed(image_url, alt, banner, position)
where not exists (select 1 from public.slides);

-- ============================================================
-- Resources page: audio sermons and books
-- Safe to run again, like the sections above.
-- ============================================================

-- 6. Audio sermons (Audiomack links; the site builds the player from them)
create table if not exists public.sermons (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  title          text not null,
  audiomack_url  text not null,
  position       integer not null default 0
);

alter table public.sermons enable row level security;

insert into public.sermons (title, audiomack_url, position)
select 'Prophets, Prophecy, and Prophetism',
       'https://audiomack.com/gideonpeprah-6a05e0687cb25/song/prophets-prophecy-and-prophetism',
       1
where not exists (select 1 from public.sermons);

-- 7. Books & devotionals
create table if not exists public.books (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text not null,
  category     text not null default 'Books',
  description  text not null default '',
  image_url    text not null,
  link_url     text,
  position     integer not null default 0
);

alter table public.books enable row level security;

-- Public storage bucket for uploaded book covers
insert into storage.buckets (id, name, public)
values ('book-images', 'book-images', true)
on conflict (id) do nothing;

insert into public.books (title, category, description, image_url, position)
select * from (values
  ('Positioned for His Return', 'Books', 'A powerful teaching on how the Body of Christ can be prepared for the second coming of Jesus.', '/images/V_177.jpg', 1),
  ('The Fire of Revival', 'Books', 'Stirring your heart for a fresh move of God in your life, family, and nation.', '/images/V_194.jpg', 2),
  ('Kingdom Partnerships', 'Books', 'Unlocking the power of covenant relationships in ministry and in the Kingdom of God.', '/images/V_183.jpg', 3),
  ('Daily Strength Devotional', 'Devotionals', '365 days of Spirit-filled devotions to fuel your walk with God every single day.', '/images/V_202.jpg', 4)
) as seed(title, category, description, image_url, position)
where not exists (select 1 from public.books);

-- ============================================================
-- Admin login protection
-- Failed logins are recorded here (as a hash of the visitor's IP,
-- never the IP itself). After 5 failures in 15 minutes that
-- visitor is locked out for 15 minutes. Old rows are pruned
-- automatically by the website.
-- ============================================================

-- 8. Failed admin login attempts
create table if not exists public.login_attempts (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  ip_hash     text not null
);

create index if not exists login_attempts_ip_time on public.login_attempts (ip_hash, created_at);

alter table public.login_attempts enable row level security;
