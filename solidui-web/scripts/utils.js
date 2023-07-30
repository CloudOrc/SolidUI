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


const fs = require('fs');

/**
 * exit process
 * @param {*} message 
 */
function exitProcess(message) {
    Logger.logError(new Error(message));
    process.exit(1)
}

/**
 * command resolve
 */
class ResolveCommand {
    config = {};
    nodePath = '';
    scriptPath = '';
    command = '';
    options = [];

    constructor(config, callback = () => { }) {
        this.config = config;
        const line = [...process.argv]
        this.nodePath = line.shift()
        this.scriptPath = line.shift()
        // 命令
        const findCommand = line.find(item => /^[a-zA-Z0-9]+$/g.test(item))
        // 选项
        const findOptions = line.map(item => {
            const regExpExecArray = /^--([a-zA-Z0-9]+)$/g.exec(item);
            return regExpExecArray && regExpExecArray[1]
        }).filter(Boolean)
        if (findCommand === void 0) exitProcess("Specify the command to execute")

        const hitCommand = config.commandls.find(item => item.command === findCommand)
        if (!hitCommand) exitProcess(findCommand + " Command not defined")

        const hitOptions = findOptions.filter((option) => hitCommand.options.includes(option))
        this.command = hitCommand
        this.options = hitOptions
        callback(hitCommand, hitOptions, this)
    }
    hasOption(option) {
        return this.options.includes(option)
    }
}
/**
 * check file
 * @param {*} files 
 * @returns 
 */
function checkFileExist(files = []) {
    let notFindList = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!fs.existsSync(file)) notFindList.push(file)
    }
    return {
        status: notFindList.length === 0,
        missFile: notFindList
    }
}

/**
 * logger
 */
class Logger {
    static generatorStyle(style = []) {
        return style.join(";")
    }
    static changeStyle = (input, style) => `\x1b[${this.generatorStyle(style)}m${input}\x1b[0m`
    static bColorMap = {
        black: "40",
        red: "41",
        green: "42",
        yellow: "43",
        blue: "44",
        magenta: "45",
        cyan: "46",
        white: "47",
    }
    static fColorMap = {
        black: "30",
        red: "31",
        green: "32",
        yellow: "33",
        blue: "34",
        magenta: "35",
        cyan: "36",
        white: "37",
    }
    static red(text, f = false) {
        return this.changeStyle(text, f ? [this.fColorMap.red] : [this.fColorMap.white, this.bColorMap.red])
    }
    static green(text, f = false) {
        return this.changeStyle(text, f ? [this.fColorMap.green] : [this.fColorMap.white, this.bColorMap.green])
    }
    static yellow(text, f = false) {
        return this.changeStyle(text, f ? [this.fColorMap.yellow] : [this.fColorMap.white, this.bColorMap.yellow])
    }
    static blue(text, f = false) {
        return this.changeStyle(text, f ? [this.fColorMap.blue] : [this.fColorMap.white, this.bColorMap.blue])
    }
    static logError(...args) {
        console.error(`${this.red("Error: ")}`, ...args)
    }
    static logWarn(...args) {
        console.warn(`${this.yellow("Warning: ")}`, ...args)
    }
    static logInfo(...args) {
        console.info(`${this.blue("Info: ")}`, ...args)
    }
    static logSuccess(...args) {
        console.log(`${this.green("Success: ")}`, ...args)
    }
    static log(...arg) {
        console.log(...arg)
    }
    static table(...arg) {
        console.table(...arg)
    }
}
/**
 * environment variable
 * @param {*} schema 
 * @param {*} envConfig 
 * @returns 
 */
function verifyEnv(schema = [], envConfig = {}) {
    return schema.filter(item => envConfig[item] === void 0);
}
/**
 * clear console
 */
function clearConsole() {
    process.stdout.write(
        process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
    );
}
module.exports.checkFileExist = checkFileExist
module.exports.exitProcess = exitProcess
module.exports.ResolveCommand = ResolveCommand
module.exports.Logger = Logger
module.exports.verifyEnv = verifyEnv
module.exports.clearConsole = clearConsole

