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

INSERT INTO `solidui_model_type` (`id`, `name`, `code`, `type_name`, `prompt`, `token`, `baseurl`)
VALUES
(1,'gpt-3.5-turbo', 'python', 'gpt','First, here is a history of what I asked you to do earlier. The actual prompt follows after ENDOFHISTORY. History:\n\n{}ENDOFHISTORY.\n\nWrite Python code that does the following: \n\n{}\n\nNote, the code is going to be executed in a Jupyter Python kernel.\n\nLast instruction, and this is the most important, just return code. No other outputs, as your full response will directly be executed in the kernel. \n\nTeacher mode: if you want to give a download link, just print it as <a href=''/solidui/models/download?file=INSERT_FILENAME_HERE''>Download file</a>. Replace INSERT_FILENAME_HERE with the actual filename. So just print that HTML to stdout. No actual downloading of files!',NULL,NULL),
(2,'gpt-4','python', 'gpt','First, here is a history of what I asked you to do earlier. The actual prompt follows after ENDOFHISTORY. History:\n\n{}ENDOFHISTORY.\n\nWrite Python code that does the following: \n\n{}\n\nNote, the code is going to be executed in a Jupyter Python kernel.\n\nLast instruction, and this is the most important, just return code. No other outputs, as your full response will directly be executed in the kernel. \n\nTeacher mode: if you want to give a download link, just print it as <a href=''/solidui/models/download?file=INSERT_FILENAME_HERE''>Download file</a>. Replace INSERT_FILENAME_HERE with the actual filename. So just print that HTML to stdout. No actual downloading of files!',NULL,NULL),
(3,'chatglm_lite','python', 'chatglm','首先，这是我之前要求您做的事情的历史记录。实际的提示将在历史结束后呈现。历史:\n\n{}历史结束。\n\n编写以下Python代码：\n\n{}\n\n注意，代码将在Jupyter Python内核中执行。\n\n最后一条指令，这是最重要的，只返回代码。不要输出其他内容，因为您的完整响应将直接在内核中执行。\n\n教师模式：如果您想提供一个下载链接，只需将其打印为 <a href=''/solidui/models/download?file=INSERT_FILENAME_HERE''>下载文件</a >。用实际的文件名替换INSERT_FILENAME_HERE。所以只需将该HTML打印到标准输出。无需实际下载文件！',NULL,NULL),
(4,'gpt-3.5-turbo','html', 'gpt', 'First, here is a history of what I asked you to do earlier. The actual prompt follows after ENDOFHISTORY. History:\n\n{}ENDOFHISTORY.\n\nYour task is to generate an HTML code snippet using the specified JavaScript library (such as D3, echartjs, three.js, etc.) based on the following requirements:\n\n{}\n\nPlease note that:\n1. The HTML code will be executed in a Chrome web browser.\n2. Only return the HTML content without any additional explanatory or descriptive text.\n3. If there''s a need to provide a download link within the HTML content, format it as follows: <a href=''/solidui/models/download?file=INSERT_FILENAME_HERE''>Download file</a>, replacing INSERT_FILENAME_HERE with the actual filename.\n4. Ensure to include the necessary `<script>` tags for incorporating the JavaScript library you are using.
\n\nEnsure that the response contains only HTML content to be directly executed in the kernel, with no other outputs.',NULL,NULL),
(5,'chatglm_lite','html', 'chatglm','首先，这是我之前要求你做的事情的历史记录。实际的提示在“ENDOFHISTORY”之后。历史记录：\n\n{}ENDOFHISTORY。\n\n你的任务是根据以下要求使用指定的JavaScript库（如D3、echartjs、three.js等）生成一个HTML代码片段：\n\n{}\n\n请注意：\n\n1.HTML代码将在Chrome浏览器中执行。\n 2.只返回HTML内容，不包括任何额外的解释或描述文本。\n3.如果需要在HTML内容中提供下载链接，请按照以下格式编写：<a href=''/solidui/models/download?file=INSERT_FILENAME_HERE''>下载文件</a>，并将INSERT_FILENAME_HERE替换为实际的文件名。\n4.确保包含必要的<script>标签来引入你正在使用的JavaScript库。\n\n确保响应仅包含直接在内核中执行的HTML内容，不包含其他输出。',NULL,NULL),
(6,'gpt-4','html', 'gpt','First, here is a history of what I asked you to do earlier. The actual prompt follows after ENDOFHISTORY. History:\n\n{}ENDOFHISTORY.\n\nYour task is to generate an HTML code snippet using the specified JavaScript library (such as D3, echartjs, three.js, etc.) based on the following requirements:\n\n{}\n\nPlease note that:\n1. The HTML code will be executed in a Chrome web browser.\n2. Only return the HTML content without any additional explanatory or descriptive text.\n3. If there''s a need to provide a download link within the HTML content, format it as follows: <a href=''/solidui/models/download?file=INSERT_FILENAME_HERE''>Download file</a>, replacing INSERT_FILENAME_HERE with the actual filename.\n4. Ensure to include the necessary `<script>` tags for incorporating the JavaScript library you are using.
\n\nEnsure that the response contains only HTML content to be directly executed in the kernel, with no other outputs.',NULL,NULL);
