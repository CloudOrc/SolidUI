# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

from Crypto.Cipher import DES
from Crypto.Random import get_random_bytes
import base64

class DESUtil:
    DES = "DES"
    XBYTE = "X"

    @staticmethod
    def pad_key(key):
        """Pad the key if it is less than 8 characters."""
        while len(key) < 8:
            key += DESUtil.XBYTE
        return key[:8]

    @staticmethod
    def encrypt(data, key):
        """Encrypt data using DES encryption."""
        key = DESUtil.pad_key(key)
        cipher = DES.new(key.encode('utf-8'), DES.MODE_EAX)
        nonce = cipher.nonce
        ciphertext, tag = cipher.encrypt_and_digest(data.encode('utf-8'))
        return base64.b64encode(nonce + tag + ciphertext).decode('utf-8')

    @staticmethod
    def decrypt(data, key):
        """Decrypt data using DES encryption."""
        key = DESUtil.pad_key(key)
        raw = base64.b64decode(data)
        nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
        cipher = DES.new(key.encode('utf-8'), DES.MODE_EAX, nonce)
        return cipher.decrypt_and_verify(ciphertext, tag).decode('utf-8')


