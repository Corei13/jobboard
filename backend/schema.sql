create table users (
  id int primary key auto_increment,
  role varchar(16) not null,
  first_name varchar(32) not null,
  last_name varchar(32) not null,
  email varchar(32) not null,
  password varchar(64) default null,

  created_at timestamp not null default current_timestamp,
  -- verified_at timestamp null default null,
  updated_at timestamp null default null on update current_timestamp,

  unique key email (email),
  key role (role)
);

create table candidates (
  user_id int primary key not null,
  experience JSON
);

create table employer (
  user_id int primary key not null,
);

create table companies (
  id int primary key auto_increment,

  created_at timestamp not null default current_timestamp,
  updated_at timestamp null default null on update current_timestamp,
);

create table jobs (
  id int primary key auto_increment,
  company_id int not null,

  created_at timestamp not null default current_timestamp,

  foreign key company_id (company_id) references companies (id),
  foreign key added_by (user_id) references users (id),
);

create table affiliations (
  id int primary key auto_increment,
  user_id int not null,
  company_id int not null,

  created_at timestamp not null default current_timestamp,

  foreign key fk_affiliations_user_id (user_id) references employer (user_id),
  foreign key fk_affiliations_company_id (company_id) references companies (id),
  unique key (user_id, company_id)
);

create table applications (
  id int primary key auto_increment,
  user_id int not null,
  company_id int not null,

  created_at timestamp not null default current_timestamp,

  foreign key fk_applications_user_id (user_id) references candidates (user_id),
  foreign key fk_applications_company_id (company_id) references companies (id),
  unique key (user_id, company_id)
);