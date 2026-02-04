create table if not exists rsvp_submissions (
  id integer primary key autoincrement,
  invite_id text not null,
  message text not null,
  phone text not null,
  created_at text not null default (datetime('now'))
);
