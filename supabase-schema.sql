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

-- Optional button on a slide (e.g. "Order Now" on a book banner); shown only when button_url is set.
alter table public.slides add column if not exists button_label text;
alter table public.slides add column if not exists button_url   text;

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
-- Homepage "Stay Updated": news & updates
-- Safe to run again, like the sections above. The homepage shows
-- the first 4 (lower position = first); /news shows them all.
-- ============================================================

create table if not exists public.news (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  news_date   date not null,
  image_url   text not null,
  body        text not null default '',
  link_url    text,
  position    integer not null default 0
);

alter table public.news enable row level security;

-- Public storage bucket for uploaded news images
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;


-- ============================================================
-- About Us: Leadership
-- Edited from /admin. The Leadership tab and menu link show
-- only when there is at least one leader.
-- ============================================================

create table if not exists public.leaders (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  role        text not null,
  image_url   text not null,
  position    integer not null default 0
);

alter table public.leaders enable row level security;

-- Public storage bucket for uploaded leader photos
insert into storage.buckets (id, name, public)
values ('leader-images', 'leader-images', true)
on conflict (id) do nothing;

-- Leadership (left side) or Staff (right side) on the About Us page.
alter table public.leaders add column if not exists team text not null default 'Leadership'
  check (team in ('Leadership', 'Staff'));

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

-- Price in pesewas (GHS × 100). Books with a price can be ordered on the website's /order page.
alter table public.books add column if not exists price_minor integer check (price_minor > 0);

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

-- ============================================================
-- Online giving (Paystack)
-- Each gift is recorded as 'pending' when the donor is sent to
-- Paystack, then updated from Paystack's confirmation.
-- ============================================================

-- 9. Donations
-- amount_minor / currency: what Paystack actually charged (smallest unit: pesewas or cents).
-- donor_amount_minor / donor_currency: what the donor chose (e.g. EUR, which Paystack
-- can't charge, so it is converted at fx_rate).
create table if not exists public.donations (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  reference           text not null unique,
  amount_minor        integer not null check (amount_minor > 0),
  currency            text not null default 'GHS',
  donor_amount_minor  integer,
  donor_currency      text,
  fx_rate             numeric,
  giving_type         text not null,
  name                text not null,
  email               text not null,
  phone               text,
  message             text,
  status              text not null default 'pending',
  channel             text,
  paid_at             timestamptz
);

create index if not exists donations_created_at on public.donations (created_at desc);

alter table public.donations enable row level security;

-- ============================================================
-- Book orders (Paystack)
-- Recorded as 'pending' when the buyer is sent to Paystack, then
-- updated from Paystack's confirmation. fulfilled_at is set from
-- the admin page once the book is sent or collected.
-- ============================================================

create table if not exists public.book_orders (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  reference           text not null unique,
  book_id             uuid references public.books (id) on delete set null,
  book_title          text not null,
  unit_price_minor    integer not null check (unit_price_minor > 0),
  quantity            integer not null check (quantity > 0),
  delivery_fee_minor  integer not null default 0,
  amount_minor        integer not null check (amount_minor > 0),
  currency            text not null default 'GHS',
  name                text not null,
  email               text not null,
  phone               text not null,
  fulfilment          text not null check (fulfilment in ('delivery', 'pickup')),
  address             text,
  note                text,
  status              text not null default 'pending',
  channel             text,
  paid_at             timestamptz,
  fulfilled_at        timestamptz
);

create index if not exists book_orders_created_at on public.book_orders (created_at desc);

alter table public.book_orders enable row level security;

-- ============================================================
-- Email receipts
-- Set when the receipt / Prophet notice has been sent, so the
-- webhook and thank-you page never send the same email twice.
-- ============================================================

alter table public.donations   add column if not exists emailed_at timestamptz;
alter table public.book_orders add column if not exists emailed_at timestamptz;

-- ============================================================
-- Prophetic Insight requests (Paystack)
-- Counselling / destiny requests, recorded as 'pending' when the
-- person is sent to Paystack to sow their seed. The request is
-- emailed to the Prophet only once the payment is confirmed.
-- responded_at is set from the admin page once it's answered.
-- ============================================================

create table if not exists public.insight_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  reference     text not null unique,
  request_type  text not null,
  amount_minor  integer not null check (amount_minor > 0),
  currency      text not null default 'GHS',
  name          text not null,
  email         text not null,
  phone         text not null,
  country       text,
  details       text not null,
  status        text not null default 'pending',
  channel       text,
  paid_at       timestamptz,
  responded_at  timestamptz,
  emailed_at    timestamptz
);

create index if not exists insight_requests_created_at on public.insight_requests (created_at desc);

-- The form now asks for an anticipated date instead of a written request.
alter table public.insight_requests add column if not exists preferred_date date;
alter table public.insight_requests alter column details drop not null;

-- The seed can be given in any of the Give page's currencies. What the person chose is kept
-- here; amount_minor / currency are what Paystack charged (converted if needed).
alter table public.insight_requests add column if not exists chosen_amount_minor integer;
alter table public.insight_requests add column if not exists chosen_currency     text;

alter table public.insight_requests enable row level security;

-- ============================================================
-- Website settings edited from /admin
-- One row per setting (e.g. contact_phone). Missing rows mean
-- the website uses its built-in value.
-- ============================================================

-- 10. Site settings (the Contact page's address, phone, email and office hours)
create table if not exists public.site_settings (
  key         text primary key,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- ============================================================
-- About Us: Tenets of Faith
-- Edited from /admin. The built-in tenets are copied in once
-- (remembered in site_settings), so running this file again
-- never brings back tenets the admin has removed.
-- ============================================================

create table if not exists public.tenets (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  body        text not null,
  position    integer not null default 0
);

alter table public.tenets enable row level security;

insert into public.tenets (title, body, position)
select * from (values
  ('The Bible',       'We believe the Holy Bible is the inspired, infallible Word of God and the supreme authority in all matters of faith and conduct.', 1),
  ('The Trinity',     'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.', 2),
  ('Jesus Christ',    'We believe in the deity of our Lord Jesus Christ, His virgin birth, sinless life, atoning death, bodily resurrection, and His imminent return.', 3),
  ('Salvation',       'We believe that salvation is by grace through faith in Jesus Christ alone, and that all who repent and believe shall receive eternal life.', 4),
  ('The Holy Spirit', 'We believe in the present ministry of the Holy Spirit, who empowers believers for life and service.', 5),
  ('The Church',      'We believe in the universal Church, the Body of Christ, and the importance of Christian fellowship, worship, and discipleship.', 6)
) as seed(title, body, position)
where not exists (select 1 from public.site_settings where key = 'tenets_seeded')
  and not exists (select 1 from public.tenets);

insert into public.site_settings (key, value) values ('tenets_seeded', '1') on conflict (key) do nothing;
