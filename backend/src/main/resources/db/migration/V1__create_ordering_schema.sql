create table menu_categories (
    id varchar(40) primary key,
    name varchar(80) not null,
    eyebrow varchar(80) not null,
    description varchar(240) not null,
    sort_order int not null default 0,
    active boolean not null default true
);

create table menu_items (
    id varchar(60) primary key,
    category_id varchar(40) not null references menu_categories(id),
    name varchar(100) not null,
    description varchar(240) not null,
    price_fen int not null check (price_fen >= 0),
    emoji varchar(16) not null default '',
    tone varchar(20) not null default '#f1dcc6',
    badge varchar(32) not null default '',
    sort_order int not null default 0,
    active boolean not null default true
);

create index idx_menu_items_category on menu_items(category_id, sort_order);

create table customer_orders (
    id uuid primary key,
    order_no varchar(32) not null unique,
    client_request_id varchar(64) not null unique,
    table_no varchar(12) not null,
    order_type varchar(16) not null,
    status varchar(24) not null,
    remark varchar(120) not null default '',
    total_quantity int not null check (total_quantity > 0),
    total_fen int not null check (total_fen >= 0),
    created_at timestamptz not null
);

create index idx_customer_orders_table_time
    on customer_orders(table_no, created_at desc);

create table order_items (
    id bigserial primary key,
    order_id uuid not null references customer_orders(id) on delete cascade,
    menu_item_id varchar(60) not null,
    item_name varchar(100) not null,
    unit_price_fen int not null check (unit_price_fen >= 0),
    quantity int not null check (quantity > 0),
    line_total_fen int not null check (line_total_fen >= 0)
);

create index idx_order_items_order on order_items(order_id);

