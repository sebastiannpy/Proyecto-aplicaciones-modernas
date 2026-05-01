-- Estructura minima para carrito y columnas usadas por el frontend/backend

create table if not exists public.cart (
  id bigserial primary key,
  user_id uuid not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id bigserial primary key,
  cart_id bigint not null references public.cart(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

-- Asegura columnas opcionales usadas en vistas y admin
alter table public.products
  add column if not exists description text;

alter table public.products
  add column if not exists image_url text;

