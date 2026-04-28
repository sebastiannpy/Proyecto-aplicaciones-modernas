create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  type text not null check (
    type in (
      'registration_success',
      'purchase_confirmed',
      'purchase_in_transit',
      'purchase_delivered'
    )
  ),
  message text not null,
  is_read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx
  on public.notifications(user_id, created_at desc);

create index if not exists notifications_user_unread_idx
  on public.notifications(user_id, is_read);
