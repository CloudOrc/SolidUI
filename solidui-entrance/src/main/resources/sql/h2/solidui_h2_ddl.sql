/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
SET MODE MySQL;

DROP TABLE IF EXISTS solidui_datasource;

CREATE TABLE solidui_datasource (
                                    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                    datasource_name varchar(255) NOT NULL,
                                    datasource_desc varchar(255) DEFAULT NULL,
                                    datasource_type_id int(11) NOT NULL,
                                    create_identify varchar(255) DEFAULT NULL,
                                    parameter varchar(255) DEFAULT NULL,
                                    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
                                    create_user varchar(255) DEFAULT NULL,
                                    labels varchar(255) DEFAULT NULL,
                                    expire tinyint(1) DEFAULT '0'
);

DROP TABLE IF EXISTS solidui_datasource_type;

CREATE TABLE solidui_datasource_type (
                                         id int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         name varchar(32) NOT NULL DEFAULT '',
                                         description varchar(255) NOT NULL DEFAULT '',
                                         option varchar(32) NOT NULL DEFAULT '',
                                         classifier varchar(32) NOT NULL DEFAULT '',
                                         icon varchar(255) NOT NULL DEFAULT '',
                                         layers int(11) NOT NULL
);

DROP TABLE IF EXISTS solidui_datasource_type_key;

CREATE TABLE solidui_datasource_type_key (
                                             id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                             data_source_type_id int(11) NOT NULL,
                                             key varchar(32) NOT NULL,
                                             name varchar(32) NOT NULL,
                                             name_en varchar(32) NOT NULL,
                                             default_value varchar(50) DEFAULT NULL,
                                             value_type varchar(50) NOT NULL,
                                             scope varchar(50) DEFAULT NULL,
                                             require tinyint(1) DEFAULT '0',
                                             description varchar(200) DEFAULT NULL,
                                             description_en varchar(200) DEFAULT NULL,
                                             value_regex varchar(200) DEFAULT NULL,
                                             update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                             create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS solidui_job_element;

CREATE TABLE solidui_job_element (
                                     id int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                     project_id int(11) NOT NULL,
                                     name varchar(255) NOT NULL DEFAULT '',
                                     data text NOT NULL,
                                     data_type varchar(255) NOT NULL DEFAULT '',
                                     create_time timestamp NOT NULL,
                                     update_time timestamp NOT NULL
);

DROP TABLE IF EXISTS solidui_job_element_page;

CREATE TABLE solidui_job_element_page (
                                          id int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                          job_page_id int(11) NOT NULL,
                                          job_element_id int(11) NOT NULL,
                                          position varchar(255) NOT NULL DEFAULT '',
                                          create_time timestamp NOT NULL,
                                          update_time timestamp NOT NULL
);

DROP TABLE IF EXISTS solidui_job_page;

CREATE TABLE solidui_job_page (
                                  id int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                  project_id int(11) NOT NULL,
                                  name varchar(255) NOT NULL DEFAULT '',
                                  parent_id int(11) DEFAULT NULL,
                                  layout int(11) NOT NULL,
                                  orders int(11) NOT NULL,
                                  create_time timestamp NOT NULL,
                                  update_time timestamp NOT NULL
);

DROP TABLE IF EXISTS solidui_project;

CREATE TABLE solidui_project (
                                 id int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                 user_name varchar(100) NOT NULL DEFAULT '',
                                 project_name varchar(255) NOT NULL DEFAULT '',
                                 image varchar(255) DEFAULT NULL,
                                 description varchar(255) DEFAULT NULL,
                                 create_time timestamp DEFAULT NULL,
                                 update_time timestamp DEFAULT NULL,
                                 status int(11) NOT NULL DEFAULT '0'
);

DROP TABLE IF EXISTS solidui_user;

CREATE TABLE solidui_user (
                              id int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
                              user_name varchar(20) NOT NULL DEFAULT '',
                              user_password varchar(255) NOT NULL DEFAULT '',
                              create_time timestamp NOT NULL,
                              update_time timestamp NOT NULL,
                              queue varchar(20) DEFAULT NULL
);
