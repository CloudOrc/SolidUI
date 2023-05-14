package com.cloudorc.solidui.plugin.jdbc.connector;

import com.cloudorc.solidui.spi.connector.Connector;

import java.sql.Connection;
import java.util.List;

public class JdbcConnector implements Connector {


    public JdbcConnector() {
    }

    @Override
    public List<String> getDatabases(Connection connection) {

        return null;
    }

    @Override
    public void close() throws Exception {

    }
}
