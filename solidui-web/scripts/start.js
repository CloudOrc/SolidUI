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


const path = require('path');
const url = require("url");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const dotenv = require('dotenv');
const { checkFileExist, exitProcess, ResolveCommand, Logger, clearConsole, verifyEnv } = require("./utils")
const pathConfigs = require("../config/paths")
const envVariate = require('../config/env')
const { name: appName, version: appVersion } = require('../package.json');

// app version
process.env.APP_VERSION = appVersion;
// app name
process.env.APP_NAME = appName;

const { contextDir } = pathConfigs
const configDir = path.join(contextDir, './config')
const envConfig = {
    "production": {
        "needVariable": envVariate.production, // need environment variable
        "envFile": path.join(contextDir, '.env.prod'), // environment file
        "webpackConfigFile": path.join(configDir, 'webpack.prod.js'), // webpack config file
        "webpackAnalysisConfigFile": path.join(configDir, 'webpack.analysis.js') // webpack analysis config file
    },
    "development": {
        "needVariable": envVariate.development, // need environment variable
        "envFile": path.join(contextDir, '.env.dev'), // environment file
        "webpackConfigFile": path.join(configDir, 'webpack.dev.js'), // webpack config file
    }
}

new ResolveCommand({
    commandls: [
        { command: "production", options: ["analyse"] },
        { command: "development", options: [] }
    ]
}, (hitCommand, hitOptions, _rc) => {
    const envModel = hitCommand.command
    const config = { options: hitOptions }
    if (envModel === "development") {
        config.isDev = true
    } else {
        config.isDev = false
        config.enableAnalyse = _rc.hasOption("analyse")
    }
    main(envModel, config)
})

function main(envMode, config) {
    // log .env file
    loadEnvFile(envMode)
    // pre check file
    preCheck()
    // get config then create compiler
    const webpackConfig = getWebpackConfig(envMode, config);
    const compiler = createCompiler(webpackConfig)

    if (config.isDev) {
        // run serve
        webpackServe(compiler, webpackConfig, envMode, config)
    } else {
        // run build
        webpackBuild(compiler, webpackConfig, envMode, config)
    }
}

/**
 * log env file
 * @param {*} envMode
 * @returns
 */
function loadEnvFile(envMode) {
    const envFile = envConfig[envMode].envFile;
    const needVariable = envConfig[envMode].needVariable;
    // load
    dotenv.config({ path: envFile, processEnv: process.env })
    if (!checkFileExist([envFile]).status) Logger.logWarn(envFile + " does not exist,  will Use default value \r\n more info please see https://github.com/CloudOrc/SolidUI/blob/dev/solidui-web/README.md")
    function fillDefaultValue(envObject) {
        for (let i = 0; i < needVariable.length; i++) {
            const variable = needVariable[i];
            if (envObject[variable.name] === void 0) {
                envObject[variable.name] = variable.default
            }
        }
    }
    fillDefaultValue(process.env)
    const missVariable = verifyEnv(needVariable.map(v => v.name), process.env)
    if (missVariable.length) exitProcess(`please check it ${envFile}, ${missVariable.join(',')} miss`)
}

/**
 * build pre check
 */
function preCheck() {
    const { status, missFile } = checkFileExist([
        pathConfigs.appDir,
        pathConfigs.appSrcDir,
        pathConfigs.appMainJs,
        pathConfigs.appHtml,
        pathConfigs.staticAssetsDir,
    ])
    if (!status) exitProcess(missFile.join(',') + "not find")
}


/**
 * get webpack config
 * @param {*} envMode
 * @returns
 */
function getWebpackConfig(envMode, config) {
    let webpackConfigFile = envConfig[envMode].webpackConfigFile
    if (!config.isDev && config.enableAnalyse) {
        webpackConfigFile = envConfig[envMode].webpackAnalysisConfigFile
    }
    const { status } = checkFileExist([webpackConfigFile])
    if (!status) exitProcess(`${webpackConfigFile}  webpack config file not found`)
    return require(webpackConfigFile)
}
/**
 * Compiler create
 * @param {*} webpackConfig
 * @returns
 */
function createCompiler(webpackConfig) {
    return webpack(webpackConfig)
}
/**
 * serve
 * @param {*} webpackConfig
 * @param {*} envMode
 * @param {*} config
 */
function webpackServe(compiler, webpackConfig) {
    const devServer = new WebpackDevServer(webpackConfig.devServer, compiler);
    devServer.startCallback(() => {
        Logger.logInfo('Start server');
    });
    compiler.hooks.done.tap('done', async stats => {
        clearConsole();
        const statsData = stats.toJson({
            all: false,
            warnings: true,
            errors: true,
        });
        // 协议
        const protocol = devServer.options.server.type;
        // 映射的静态目录
        const staticDir = devServer.options.static.map((item) => item.directory).join();
        // port
        const { port } = devServer.server.address()
        const prettyPrintURL = (newHostname) => url.format({ protocol, hostname: newHostname, port, pathname: "/" });

        const isSuccessful = !statsData.errors.length && !statsData.warnings.length;
        if (isSuccessful) {
            Logger.logSuccess(`Compile Success`)
            Logger.log();
            Logger.log(`You can now view ${Logger.blue(appName + "@" + appVersion)} in the browser.`);
            Logger.log();

            Logger.log("LOCAL:               " + Logger.blue(`${prettyPrintURL("localhost")}`, true));
            Logger.log("LAN:                 " + Logger.blue(`${prettyPrintURL(WebpackDevServer.internalIPSync("v4"))}`, true));
            Logger.log("LOCAL STATIC DIR:    " + Logger.blue(`${staticDir}`, true));
            Logger.log();

            Logger.logInfo(`Proxy Table:`)
            console.table(devServer.options.proxy, ['context', 'target', 'pathRewrite'])
            Logger.log();
        }

    });
}
/**
 * build
 * @param {*} webpackConfig
 * @param {*} envMode
 * @param {*} config
 */
function webpackBuild(compiler, webpackConfig) {
    compiler.run((err, stats) => {
        if (err) {
            Logger.logError(err.stack || err);
            if (err.details) {
                Logger.logError(err.details);
            }
            return;
        }

        const statsData = stats.toJson({
            preset: 'normal',
        });

        const isSuccessful = !statsData.errors.length && !statsData.warnings.length;

        if (isSuccessful) {
            // successfully
            Logger.log(`${Logger.blue(appName)} Build Successfully`);
            Logger.log("----------------------------------------------------------------")
            // app version
            Logger.log(Logger.green("app version:      ", true), appVersion)
            // webpack 版本
            Logger.log(Logger.green("webpack version:  ", true), statsData.version)
            // 执行时间
            Logger.log(Logger.green("take time:        ", true), statsData.time, "ms")
            // 输出路径信息
            Logger.log(Logger.green("output path:      ", true), statsData.outputPath)
            // 生成资源的信息
            Logger.log(Logger.green("generate assets:  ", true), statsData.assets.length)
            // chunk 数量
            Logger.log(Logger.green("generate chunks:  ", true), statsData.chunks.length)
            // 处理过的module数量
            Logger.log(Logger.green("filter modules:   ", true), statsData.modules.length)
            Logger.log("----------------------------------------------------------------")
        } else {
            if (stats.hasErrors()) {
                statsData.errors.forEach((error) => {
                    Logger.logWarn(error.message);
                })
            }

            if (stats.hasWarnings()) {
                statsData.warnings.forEach((warn) => {
                    Logger.logWarn(warn.message);
                })
            }
        }

        compiler.close((closeErr) => {
            if (closeErr) {
                Logger.logError(closeErr)
            } else {
                Logger.logInfo("Compiler Close");
            }
        });
    })
}
