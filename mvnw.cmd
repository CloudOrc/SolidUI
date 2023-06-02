@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@echo off

:: A Maven Wrapper script for SolidU
:: Based on the SolidUI project's mvnw.cmd script

setlocal

:: Determine the project directory
set "DIR=%~dp0"
cd /d "%DIR%"

:: Determine the Maven version to use
set "MAVEN_VERSION=3.6.3"

:: Determine the Maven home directory
set "MAVEN_HOME=%DIR%\.mvn\wrapper\maven-%MAVEN_VERSION%"

:: Download Maven if it is not already cached
if not exist "%MAVEN_HOME%" (
  echo Downloading Maven %MAVEN_VERSION%...
  mkdir "%MAVEN_HOME%"
  powershell -Command "& {(New-Object System.Net.WebClient).DownloadFile('https://apache.osuosl.org/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.tar.gz','%DIR%\.mvn\wrapper\apache-maven-%MAVEN_VERSION%-bin.tar.gz')}"
  tar -xzf "%MAVEN_HOME%\..\apache-maven-%MAVEN_VERSION%-bin.tar.gz" -C "%MAVEN_HOME%\.."
  move "%MAVEN_HOME%\..\apache-maven-%MAVEN_VERSION%" "%MAVEN_HOME%"
  del "%MAVEN_HOME%\..\apache-maven-%MAVEN_VERSION%-bin.tar.gz"
)

:: Run Maven with the provided arguments
"%MAVEN_HOME%\bin\mvn" %*