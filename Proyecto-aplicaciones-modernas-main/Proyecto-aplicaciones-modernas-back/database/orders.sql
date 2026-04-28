create table if not exists public.orders (
  id bigint generated always as identity primary key,
  order_number text not null unique,
  user_id uuid not null,
  status text not null default 'pendiente' check (status in ('pendiente', 'enviado', 'entregado')),
  total_amount numeric(12,2) not null default 0,
  payment_method text,
  delivery_city text,
  delivery_address text,
  delivery_reference text,
  estimated_delivery_at timestamptz,
  items_snapshot jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_created_idx
  on public.orders(user_id, created_at desc);
