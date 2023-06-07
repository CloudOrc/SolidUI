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


INSERT INTO solidui_user (id, user_name, user_password, create_time, update_time, queue)
VALUES
(1, 'admin', '21232f297a57a5a743894a0e4eaa8f61-4a83-441b-a567-8abe7e1d318e', '2021-01-01 00:00:00', '2021-01-01 00:00:00', NULL);

INSERT INTO solidui_project (id, user_name, project_name, image, description, create_time, update_time, status)
VALUES
(1, 'admin', 'SolidUI', 'images/project/project_1.png', 'SolidUI demo project', '2021-01-01 00:00:00', '2021-01-01 00:00:00', 0);

INSERT INTO solidui_job_page (id, project_id, name, parent_id, layout, orders, create_time, update_time)
VALUES
(1, 1, 'Dashboard', NULL, 0, 0, '2021-01-01 00:00:00', '2021-01-01 00:00:00');

INSERT INTO solidui_job_element (id, project_id, name, data, data_type, create_time, update_time)
VALUES
(1, 1, 'UI Button', '{"type": "button", "text": "Click me"}', 'ui', '2021-01-01 00:00:00', '2021-01-01 00:00:00');

INSERT INTO solidui_job_element_page (id, job_page_id, job_element_id, position, create_time, update_time)
VALUES
(1, 1, 1, '{"x": 100, "y": 100}', '2021-01-01 00:00:00', '2021-01-01 00:00:00');