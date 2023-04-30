package com.cloudorc.solidui.dao;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableAutoConfiguration
@MapperScan("com.cloudorc.solidui.dao.mapper")
public class DaoConfiguration {
}
