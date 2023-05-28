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

package com.cloudorc.solidui.common.constants;

public final class Constants {
    /**
     * http X-Forwarded-For
     */
    public static final String HTTP_X_FORWARDED_FOR = "X-Forwarded-For";

    /**
     * http X-Real-IP
     */
    public static final String HTTP_X_REAL_IP = "X-Real-IP";


    /**
     * http header
     */
    public static final String HTTP_HEADER_UNKNOWN = "unKnown";

    public static final String COMMA = ",";

    public static final String CRYPTKEY = "solidui-for-server";

    public static final String TICKETHEADER = "bfs_";


    public static final String SESSION_TICKETID_KEY = "solidui_user_session_ticket_id_v1";

    public static final long SESSION_TIMEOUT = 2 * 60 * 60 * 1000L;

    public static final String ADMIN_NAME = "admin";


    public static final Integer JOB_PAGE_LAYOUT_ONE = 1;

    public static final Integer JOB_PAGE_LAYOUT_TWO = 2;


    public final static long CLEAN_PERIOD = 12 * 60 * 60 * 1000;

}
