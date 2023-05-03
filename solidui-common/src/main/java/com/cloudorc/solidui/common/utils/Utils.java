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

import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class Utils {

    public static ThreadFactory threadFactory(String threadName, boolean isDaemon) {
        return new ThreadFactory() {
            private final AtomicInteger num = new AtomicInteger(0);

            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r);
                t.setDaemon(isDaemon);
                t.setName(threadName + num.incrementAndGet());
                return t;
            }
        };
    }

    public static ScheduledThreadPoolExecutor defaultScheduler() {
        ScheduledThreadPoolExecutor scheduler = new ScheduledThreadPoolExecutor(20, threadFactory("SolidUI-Default-Scheduler-Thread-", true));
        scheduler.setMaximumPoolSize(20);
        scheduler.setKeepAliveTime(5, TimeUnit.MINUTES);
        return scheduler;
    }


}
