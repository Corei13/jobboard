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
  linkedin varchar(128) default null,

  location varchar(128) default null,
  citizenship JSON,
  
  remote tinyint(1) default null,

  status JSON,

  created_at timestamp not null default current_timestamp,
  updated_at timestamp null default null on update current_timestamp
);

create table employers (
  user_id int primary key not null,

  created_at timestamp not null default current_timestamp,
  updated_at timestamp null default null on update current_timestamp
);

create table companies (
  id int primary key auto_increment,

  name varchar(128) default null,
  
  size varchar(32) default null,
  url varchar(32) default null,
  logo varchar(64) default null,
  about text default null,  

  created_by int not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp null default null on update current_timestamp,
  foreign key fk_companies_created_by (created_by) references employers (user_id)
);

create table jobs (
  id int primary key auto_increment,
  company_id int not null,

  available tinyint(1) default 0,
  location varchar(128) default null,
  remote varchar(32) default null,
  responsibilities text default null,
  min_experience int default null,
  education varchar(32) default null,
  min_salary int default null,
  max_salary int default null,

  description text default null,

  status JSON,

  created_by int not null,
  created_at timestamp not null default current_timestamp,

  foreign key fk_jobs_company_id (company_id) references companies (id),
  foreign key fk_jobs_created_by (created_by) references employers (user_id)
);

create table affiliations (
  id int primary key auto_increment,
  user_id int not null,
  company_id int not null,

  created_at timestamp not null default current_timestamp,

  foreign key fk_affiliations_user_id (user_id) references employers (user_id),
  foreign key fk_affiliations_company_id (company_id) references companies (id),
  unique key (user_id, company_id)
);

create table applications (
  id int primary key auto_increment,
  user_id int not null,
  job_id int not null,

  details JSON,

  created_at timestamp not null default current_timestamp,

  foreign key fk_applications_user_id (user_id) references candidates (user_id),
  foreign key fk_applications_job_id (job_id) references jobs (id),
  unique key (user_id, job_id)
);