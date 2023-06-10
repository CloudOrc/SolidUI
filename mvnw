#!/bin/sh
# ----------------------------------------------------------------------------
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
# ----------------------------------------------------------------------------

# A Maven Wrapper script for SolidU
# Based on the SolidUI project's mvnw script

# Set the default Maven version
DEFAULT_MAVEN_VERSION="3.8.1"

# Determine the project directory
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "${DIR}"

# Determine the Maven version to use
MAVEN_VERSION=${MAVEN_VERSION:-${DEFAULT_MAVEN_VERSION}}

# Determine the Maven home directory
MAVEN_HOME="${DIR}/.mvn/wrapper/maven-${MAVEN_VERSION}"

# Download Maven if it is not already cached
if [ ! -d "${MAVEN_HOME}" ]; then
    echo "Downloading Maven ${MAVEN_VERSION}..."
    mkdir -p "${MAVEN_HOME}"
    curl -L "https://downloads.apache.org/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" | tar -xz -C "${MAVEN_HOME}" --strip-components=1
fi

# Run Maven with the provided arguments
exec "${MAVEN_HOME}/bin/mvn" "$@"