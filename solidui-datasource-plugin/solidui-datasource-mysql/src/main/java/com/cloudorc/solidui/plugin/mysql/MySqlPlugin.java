package com.cloudorc.solidui.plugin.mysql;

import com.cloudorc.solidui.spi.Plugin;
import com.cloudorc.solidui.spi.connector.ConnectorFactory;

public class MySqlPlugin implements Plugin {

    @Override
    public Iterable<ConnectorFactory> getConnectorFactoryList() {
        return null;
    }
}
