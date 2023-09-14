#!/bin/bash
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
# http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

wget -O models/first_stage_models/kl-f4/model.zip https://ommer-lab.com/files/latent-diffusion/kl-f4.zip
wget -O models/first_stage_models/kl-f8/model.zip https://ommer-lab.com/files/latent-diffusion/kl-f8.zip
wget -O models/first_stage_models/kl-f16/model.zip https://ommer-lab.com/files/latent-diffusion/kl-f16.zip
wget -O models/first_stage_models/kl-f32/model.zip https://ommer-lab.com/files/latent-diffusion/kl-f32.zip
wget -O models/first_stage_models/vq-f4/model.zip https://ommer-lab.com/files/latent-diffusion/vq-f4.zip
wget -O models/first_stage_models/vq-f4-noattn/model.zip https://ommer-lab.com/files/latent-diffusion/vq-f4-noattn.zip
wget -O models/first_stage_models/vq-f8/model.zip https://ommer-lab.com/files/latent-diffusion/vq-f8.zip
wget -O models/first_stage_models/vq-f8-n256/model.zip https://ommer-lab.com/files/latent-diffusion/vq-f8-n256.zip
wget -O models/first_stage_models/vq-f16/model.zip https://ommer-lab.com/files/latent-diffusion/vq-f16.zip



cd models/first_stage_models/kl-f4
unzip -o model.zip

cd ../kl-f8
unzip -o model.zip

cd ../kl-f16
unzip -o model.zip

cd ../kl-f32
unzip -o model.zip

cd ../vq-f4
unzip -o model.zip

cd ../vq-f4-noattn
unzip -o model.zip

cd ../vq-f8
unzip -o model.zip

cd ../vq-f8-n256
unzip -o model.zip

cd ../vq-f16
unzip -o model.zip

cd ../..