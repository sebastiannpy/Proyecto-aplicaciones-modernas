create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  product_id bigint not null,
  reviewer_name text not null default 'Comprador',
  rating smallint not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists reviews_user_product_unique
  on public.reviews(user_id, product_id);

create index if not exists reviews_product_created_idx
  on public.reviews(product_id, created_at desc);
