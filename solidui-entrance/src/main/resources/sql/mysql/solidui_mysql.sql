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

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS solidui;

CREATE DATABASE solidui DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;

USE solidui;

DROP TABLE IF EXISTS `solidui_datasource`;

CREATE TABLE `solidui_datasource` (
                                      `id` int(11) NOT NULL AUTO_INCREMENT,
                                      `datasource_name` varchar(255) COLLATE utf8_bin NOT NULL,
                                      `datasource_desc` varchar(255) COLLATE utf8_bin DEFAULT NULL,
                                      `datasource_type_id` int(11) NOT NULL,
                                      `create_identify` varchar(255) COLLATE utf8_bin DEFAULT NULL,
                                      `parameter` varchar(255) COLLATE utf8_bin DEFAULT NULL,
                                      `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
                                      `create_user` varchar(255) COLLATE utf8_bin DEFAULT NULL,
                                      `labels` varchar(255) COLLATE utf8_bin DEFAULT NULL,
                                      `expire` tinyint(1) DEFAULT '0',
                                      PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


DROP TABLE IF EXISTS `solidui_datasource_type`;

CREATE TABLE `solidui_datasource_type` (
                                           `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                                           `name` varchar(32) NOT NULL DEFAULT '',
                                           `description` varchar(255) NOT NULL DEFAULT '',
                                           `option` varchar(32) NOT NULL DEFAULT '',
                                           `classifier` varchar(32) NOT NULL DEFAULT '',
                                           `icon` varchar(255) NOT NULL DEFAULT '',
                                           `layers` int(11) NOT NULL,
                                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `solidui_datasource_type_key`;

CREATE TABLE `solidui_datasource_type_key` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `data_source_type_id` int(11) NOT NULL,
    `key` varchar(32) COLLATE utf8_bin NOT NULL,
    `name` varchar(32) COLLATE utf8_bin NOT NULL,
    `name_en` varchar(32) COLLATE utf8_bin NOT NULL,
    `default_value` varchar(50) COLLATE utf8_bin DEFAULT NULL,
    `value_type` varchar(50) COLLATE utf8_bin NOT NULL,
    `scope` varchar(50) COLLATE utf8_bin DEFAULT NULL,
    `require` tinyint(1) DEFAULT '0',
    `description` varchar(200) COLLATE utf8_bin DEFAULT NULL,
    `description_en` varchar(200) COLLATE utf8_bin DEFAULT NULL,
    `value_regex` varchar(200) COLLATE utf8_bin DEFAULT NULL,
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

DROP TABLE IF EXISTS `solidui_job_element`;

CREATE TABLE `solidui_job_element` (
                                       `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                                       `project_id` int(11) NOT NULL,
                                       `name` varchar(255) NOT NULL DEFAULT '',
                                       `data` longtext NOT NULL,
                                       `data_type` varchar(255) NOT NULL DEFAULT '',
                                       `create_time` datetime NOT NULL,
                                       `update_time` datetime NOT NULL,
                                       PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='storage of various elements';

DROP TABLE IF EXISTS `solidui_job_element_page`;

CREATE TABLE `solidui_job_element_page` (
                                            `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                                            `job_page_id` int(11) NOT NULL,
                                            `job_element_id` int(11) NOT NULL,
                                            `position` varchar(255) NOT NULL DEFAULT '',
                                            `create_time` datetime NOT NULL,
                                            `update_time` datetime NOT NULL,
                                            PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='store between page and element';



DROP TABLE IF EXISTS `solidui_job_page`;

CREATE TABLE `solidui_job_page` (
                                    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                                    `project_id` int(11) NOT NULL,
                                    `name` varchar(255) NOT NULL DEFAULT '',
                                    `parent_id` int(11) DEFAULT NULL,
                                    `layout` int(11) NOT NULL,
                                    `orders` int(11) NOT NULL,
                                    `create_time` datetime NOT NULL,
                                    `update_time` datetime NOT NULL,
                                    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Store page information';


DROP TABLE IF EXISTS `solidui_project`;

CREATE TABLE `solidui_project` (
                                   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                                   `user_name` varchar(100) NOT NULL DEFAULT '',
                                   `project_name` varchar(255) NOT NULL DEFAULT '',
                                   `image` varchar(255) DEFAULT NULL,
                                   `description` varchar(255) DEFAULT NULL,
                                   `create_time` datetime DEFAULT NULL,
                                   `update_time` datetime DEFAULT NULL,
                                   `status` int(11) NOT NULL DEFAULT '0',
                                   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `solidui_user`;

CREATE TABLE `solidui_user` (
                                `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                                `user_name` varchar(20) NOT NULL DEFAULT '',
                                `user_password` varchar(255) NOT NULL DEFAULT '',
                                `create_time` datetime NOT NULL,
                                `update_time` datetime NOT NULL,
                                `queue` varchar(20) DEFAULT NULL,
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `solidui_model_type`;

CREATE TABLE `solidui_model_type` (
                                      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                                      `name` varchar(255) DEFAULT NULL,
                                      `code` varchar(255) DEFAULT NULL,
                                      `type_name` varchar(255) DEFAULT NULL,
                                      `prompt` text DEFAULT NULL,
                                      `token` varchar(255) DEFAULT NULL,
                                      `baseurl` varchar(255) DEFAULT NULL,
                                      PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `solidui_user` (`id`, `user_name`, `user_password`, `create_time`, `update_time`, `queue`)
VALUES
(1,'admin','21232f297a57a5a743894a0e4a801fc3','2023-05-01 00:00:00','2023-05-01 00:00:00',NULL);


INSERT INTO `solidui_datasource_type_key` (`id`, `data_source_type_id`, `key`, `name`, `name_en`, `default_value`, `value_type`, `scope`, `require`, `description`, `description_en`, `value_regex`, `update_time`, `create_time`)
VALUES
(1,1,'host','主机名(Host)','Host',NULL,'TEXT',NULL,1,'主机名(Host)','Host',NULL,'2023-05-23 09:57:24','2023-05-23 09:57:24'),
(2,1,'port','端口号(Port)','Port',NULL,'TEXT',NULL,1,'端口号(Port)','Port',NULL,'2023-05-23 09:57:24','2023-05-23 09:57:24'),
(3,1,'driverClassName','驱动类名(Driver class name)','Driver class name','com.mysql.jdbc.Driver','TEXT',NULL,0,'驱动类名(Driver class name)','Driver class name',NULL,'2023-05-23 09:57:25','2023-05-23 09:57:25'),
(4,1,'params','连接参数(Connection params)','Connection params',NULL,'TEXT',NULL,0,'输入JSON格式(Input JSON format): {"param":"value"}','Input JSON format: {"param":"value"}',NULL,'2023-05-23 09:57:25','2023-05-23 09:57:25'),
(5,1,'username','用户名(Username)','Username',NULL,'TEXT',NULL,1,'用户名(Username)','Username','^[0-9A-Za-z_-]+$','2023-05-23 09:57:25','2023-05-23 09:57:25'),
(6,1,'password','密码(Password)','Password',NULL,'PASSWORD',NULL,1,'密码(Password)','Password','','2023-05-23 09:57:25','2023-05-23 09:57:25'),
(7,1,'databaseName','数据库名(Database name)','Database name',NULL,'TEXT',NULL,0,'数据库名(Database name)','Database name',NULL,'2023-05-23 09:57:25','2023-05-23 09:57:25');


INSERT INTO `solidui_datasource_type` (`id`, `name`, `description`, `option`, `classifier`, `icon`, `layers`)
VALUES
(1,'mysql','mysql','mysql','mysql','mysql',3);

