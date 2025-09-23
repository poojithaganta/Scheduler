create table if not exists employees (
    id bigserial primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    phone varchar(100) not null,
    address text not null,
    office_location varchar(100) not null,
    resume_file varchar(512)
);


