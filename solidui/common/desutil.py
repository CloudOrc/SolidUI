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

import base64
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding


def encrypt(data: bytes, key: bytes) -> bytes:
    if len(key) < 8:
        key += b'X' * (8 - len(key))

    cipher = Cipher(algorithms.DES(key), modes.ECB(), backend=default_backend())
    encryptor = cipher.encryptor()
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(data) + padder.finalize()
    return encryptor.update(padded_data) + encryptor.finalize()


def decrypt(data: bytes, key: bytes) -> bytes:
    if len(key) < 8:
        key += b'X' * (8 - len(key))

    cipher = Cipher(algorithms.DES(key), modes.ECB(), backend=default_backend())
    decryptor = cipher.decryptor()
    unpadder = padding.PKCS7(128).unpadder()
    decrypted = decryptor.update(data) + decryptor.finalize()
    return unpadder.update(decrypted) + unpadder.finalize()


def encrypt_str(data: str, key: str) -> str:
    data_bytes = data.encode('utf8')
    key_bytes = key.encode('utf8')
    encrypted_bytes = encrypt(data_bytes, key_bytes)
    return base64.b64encode(encrypted_bytes).decode('utf8')


def decrypt_str(data: str, key: str) -> str:
    data_bytes = base64.b64decode(data)
    key_bytes = key.encode('utf8')
    decrypted_bytes = decrypt(data_bytes, key_bytes)
    return decrypted_bytes.decode('utf8')