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
package com.cloudorc.solidui.common.utils;

import com.cloudorc.solidui.common.constants.Constants;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;


import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class LoginUtils {

    private static final Logger logger = LoggerFactory.getLogger(LoginUtils.class);

    public static Map<String, Long> userTicketIdToLastAccessTime = new ConcurrentHashMap<>();

    static {

        Utils.defaultScheduler().scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                try {
                    long currentTime = System.currentTimeMillis();
                    userTicketIdToLastAccessTime.entrySet().stream().filter(entry -> currentTime - entry.getValue() > Constants.SESSION_TIMEOUT).forEach(entry -> {
                        String key = entry.getKey();
                        Long value = entry.getValue();
                        if (userTicketIdToLastAccessTime.containsKey(entry.getKey()) && System.currentTimeMillis() - userTicketIdToLastAccessTime.get(key) > Constants.SESSION_TIMEOUT) {
                            logger.info("remove timeout userTicket {}, since the last access time is {}.", key, DateFormatUtils.format(value, "yyyy-MM-dd HH:mm:ss"));
                            userTicketIdToLastAccessTime.remove(key);
                        }
                    });
                }catch (Exception e) {
                    logger.error("Failed to remove timeout user ticket id.", e);
                }

            }
            },  Constants.SESSION_TIMEOUT, Constants.SESSION_TIMEOUT / 10, TimeUnit.MILLISECONDS);

    }

    private static String getUserTicketId(String username){
        String timeoutUser = username + "," + System.currentTimeMillis();
        try {
            return DESUtil.encrypt(Constants.TICKETHEADER + timeoutUser, Constants.CRYPTKEY);
        }catch (Exception e) {
            logger.info("Failed to encrypt user ticket id, username: {}", username);
            return null;
        }

    }

    public static Cookie setLoginUser(String userName) {
        if(StringUtils.isNotBlank(userName)) {
            String userTicketId = getUserTicketId(userName);
            if(StringUtils.isNotBlank(userTicketId)) {
                userTicketIdToLastAccessTime.put(userTicketId, System.currentTimeMillis());
                Cookie cookie = new Cookie(Constants.SESSION_TICKETID_KEY, userTicketId);
                cookie.setMaxAge(-1);
                cookie.setPath("/");
                return cookie;
            }
        }
        return null;
    }

    public static void removeLoginUser(Cookie[] cookies){
        if(cookies != null && cookies.length > 0){
            for(Cookie cookie : cookies) {
                if(Constants.SESSION_TICKETID_KEY.equals(cookie.getName())) {
                    String userTicketId = cookie.getValue();
                    if(StringUtils.isNotBlank(userTicketId)) {
                        userTicketIdToLastAccessTime.remove(userTicketId);
                    }
                    cookie.setValue(null);
                    cookie.setMaxAge(0);
                }
            }
        }
    }

    public static String getLoginUser(HttpServletRequest request){
         Cookie[] cookies = request.getCookies();
         if(cookies != null){
             for (Cookie cookie : cookies) {
                 if(Constants.SESSION_TICKETID_KEY.equals(cookie.getName())) {
                     String userTicketId = cookie.getValue();
                     if(StringUtils.isNotBlank(userTicketId)) {
                         try {
                             String timeoutUser = DESUtil.decrypt(userTicketId, Constants.CRYPTKEY);
                             if(StringUtils.isNotBlank(timeoutUser) && timeoutUser.startsWith(Constants.TICKETHEADER)) {
                                 return timeoutUser.substring(Constants.TICKETHEADER.length(),timeoutUser.lastIndexOf(","));
                             }
                         }catch (Exception e) {
                             logger.info("Failed to decrypt user ticket id, userTicketId: {}", userTicketId);
                         }
                     }
                 }
             }
         }
        return Constants.ADMIN_NAME;
    }

}
