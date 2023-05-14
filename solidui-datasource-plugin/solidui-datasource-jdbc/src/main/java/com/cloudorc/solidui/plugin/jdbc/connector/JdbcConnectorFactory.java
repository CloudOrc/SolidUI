package com.cloudorc.solidui.plugin.jdbc.connector;

import com.cloudorc.solidui.spi.connector.Connector;
import com.cloudorc.solidui.spi.connector.ConnectorFactory;


import java.util.Map;

public class JdbcConnectorFactory implements ConnectorFactory {

    private final String name;

    public JdbcConnectorFactory(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public Connector create(Map<String, String> config) {
        return new JdbcConnector();
    }
}
