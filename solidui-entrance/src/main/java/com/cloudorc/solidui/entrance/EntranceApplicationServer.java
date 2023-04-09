package com.cloudorc.solidui.entrance;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;

@ServletComponentScan
@SpringBootApplication
@ComponentScan("com.cloudorc.solidui")
public class EntranceApplicationServer {
    private final Logger logger = LoggerFactory.getLogger(EntranceApplicationServer.class);

    public static void main(String[] args) {
        SpringApplication.run(EntranceApplicationServer.class);
    }
}
