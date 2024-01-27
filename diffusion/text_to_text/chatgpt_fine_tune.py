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

from datetime import datetime
import os

import openai
import argparse

from colorama import init, Fore, Style

import json
import tiktoken

init(autoreset=True)


def format_jobs_output(jobs_data):
    # Extract the list of jobs from the data
    jobs = jobs_data["data"]

    # Initialize counters
    total_jobs = len(jobs)
    job_type_count = {}
    status_count = {}

    # Iterate over jobs to populate counters
    for job in jobs:
        # Count job types
        job_type = job["object"]
        job_type_count[job_type] = job_type_count.get(job_type, 0) + 1

        # Count job statuses
        status = job["status"]
        status_count[status] = status_count.get(status, 0) + 1

    # Start building the output
    output = []

    # Add total job count
    output.append(Fore.GREEN + f"There are {total_jobs} jobs in total.")

    # Add job type counts
    for job_type, count in job_type_count.items():
        output.append(Fore.YELLOW + f"{count} jobs of {job_type}.")

    # Add status counts
    for status, count in status_count.items():
        output.append(Fore.CYAN + f"{count} jobs {status}.")

    # Add individual job details
    output.append(Fore.MAGENTA + "\nList of jobs (ordered by creation date):")
    for job in sorted(jobs, key=lambda x: x["created_at"]):
        created_at = datetime.utcfromtimestamp(job["created_at"]).strftime('%Y-%m-%d %H:%M:%S')
        finished_at = datetime.utcfromtimestamp(job["finished_at"]).strftime('%Y-%m-%d %H:%M:%S') if job[
            "finished_at"] else None
        output.append(Fore.BLUE + f"""
- Job Type: {job["object"]}
  ID: {job["id"]}
  Model: {job["model"]}
  Created At: {created_at}
  Finished At: {finished_at}
  Fine Tuned Model: {job["fine_tuned_model"]}
  Status: {job["status"]}
  Training File: {job["training_file"]}
        """)

    return "\n".join(output)


class TrainGPT:
    def __init__(self, api_key=None, model_name="gpt-3.5-turbo"):
        if api_key is None:
            api_key = os.getenv("OPENAI_API_KEY")
            if api_key is None:
                raise ValueError("OPENAI_API_KEY environment variable is not set")

        openai.api_key = api_key
        self.model_name = model_name
        self.file_id = None
        self.job_id = None
        self.model_id = None
        self.file_path = None

    def create_file(self, file_path):
        self.file_path = file_path
        file = openai.File.create(
            file=open(file_path, "rb"),
            purpose='fine-tune'
        )
        self.file_id = file.id
        print(f"File ID: {self.file_id}")

    def list_files(self, field='bytes', direction='asc'):
        files = openai.File.list()
        file_data = files['data']

        if field:
            file_data = sorted(file_data, key=lambda x: x[field], reverse=(direction == 'desc'))

        print(f"{Fore.GREEN}{'ID':<30}{'Bytes (MB)':<20}{'Created At'}{Style.RESET_ALL}")
        for file in file_data:
            created_at = datetime.fromtimestamp(file['created_at']).strftime('%d/%m/%Y %H:%M')
            bytes_mb = file['bytes'] / (1024 * 1024)
            print(
                f"{Fore.CYAN}{file['id']:<30}{Fore.YELLOW}{bytes_mb:.2f} MB          {Fore.MAGENTA}{created_at}{Style.RESET_ALL}")

    def delete_file(self, file_id=None):
        if file_id is None:
            raise ValueError("File not set.")

        openai.File.delete(file_id)
        print(f"File ID: {file_id} deleted.")

    def get_file_details(self, file_id=None):
        if file_id is None:
            file_id = self.file_id

        if file_id is None:
            raise ValueError("File not uploaded. Call 'create_file' method first.")

        file = openai.File.retrieve(file_id)
        print(f"File: {file}")
        return file

    def start_training(self, file_id=None):
        if file_id is None:
            file_id = self.file_id

        if file_id is None:
            raise ValueError("File not uploaded. Call 'create_file' method first.")

        job = openai.FineTuningJob.create(training_file=file_id, model=self.model_name)
        self.job_id = job.id
        print(f"Job ID: {self.job_id}")

    def list_jobs(self, limit=10):
        jobs_data = openai.FineTuningJob.list(limit=limit)

        # Formatting the jobs_data for human-readable output
        formatted_output = format_jobs_output(jobs_data)

        print(formatted_output)
        return jobs_data

    def get_job_details(self, job_id=None):
        if job_id is None:
            job_id = self.job_id

        if job_id is None:
            raise ValueError("No training job started. Call 'start_training' method first.")

        stats = openai.FineTuningJob.retrieve(job_id)
        print(f"Stats: {stats}")
        return stats

    def cancel_job(self, job_id=None):
        if job_id is None:
            job_id = self.job_id

        if job_id is None:
            raise ValueError("No training job started. Call 'start_training' method first.")

        openai.FineTuningJob.cancel(job_id)

    def list_events(self, job_id=None, limit=10):
        if job_id is None:
            job_id = self.job_id

        if job_id is None:
            raise ValueError("No training job started. Call 'start_training' method first.")

        events = openai.FineTuningJob.list_events(id=job_id, limit=limit)
        print(f"Events: {events}")
        return events

    def delete_model(self, model_id=None):
        if model_id is None:
            model_id = self.model_id

        if model_id is None:
            raise ValueError("Model ID not provided. Set 'model_id' or pass as a parameter.")

        openai.Model.delete(model_id)

    def list_models(self):
        models = openai.Model.list()
        return models

    def list_models_summaries(self):
        models = self.list_models()

        # Get the number of models
        num_models = len(models["data"])
        print(Fore.GREEN + f"You have access to {num_models} number of models." + Style.RESET_ALL)

        # Create a dictionary to count the number of models owned by each entity
        owners_count = {}
        for model in models["data"]:
            owner = model["owned_by"]
            owners_count[owner] = owners_count.get(owner, 0) + 1

        # Print the summary
        print("Those models are owned by:")
        for owner, count in owners_count.items():
            print(Fore.BLUE + f"{owner}: {count} models" + Style.RESET_ALL)

    def list_models_by_owner(self, owner):
        models = self.list_models()

        # Filter models based on the 'owned_by' parameter
        owned_models = [model for model in models["data"] if model["owned_by"] == owner]

        if not owned_models:
            print(Fore.RED + f"No models found for owner: {owner}" + Style.RESET_ALL)
            return

        for model in owned_models:
            # Format the 'created' timestamp into a human-readable date
            created_date = datetime.utcfromtimestamp(model["created"]).strftime('%Y-%m-%d %H:%M:%S')

            # Print the details
            print(Fore.GREEN + f"Name: {model['id']}" + Style.RESET_ALL)
            print(Fore.GREEN + f"Created: {created_date}" + Style.RESET_ALL)
            print(Fore.GREEN + f"Owner: {model['owned_by']}" + Style.RESET_ALL)
            print(Fore.GREEN + f"Root model: {model['root']}" + Style.RESET_ALL)
            print(Fore.GREEN + f"Parent model: {model['parent']}" + Style.RESET_ALL)
            print("-----------------------------")

    @staticmethod
    def num_tokens_from_string(string: str, encoding_name: str) -> int:
        """Returns the number of tokens in a text string."""
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens

    @staticmethod
    def count_tokens_from_messages(encoding_name, messages):
        total_tokens = 0
        for message in messages:
            total_tokens += TrainGPT.num_tokens_from_string(message["content"], encoding_name)
        return total_tokens

    def get_token_count(self, file_path=None):
        if not file_path and not self.file_path:
            raise ValueError("Provide a file_path or call 'create_file' method first.")

        file_path = file_path or self.file_path
        # Using all OpenAI tokenizers. See https://github.com/openai/tiktoken
        tokenizers = {
            "cl100k_base": "cl100k_base",
            "p50k_base": "p50k_base",
            "r50k_base": "r50k_base",
        }

        token_counts = {name: 0 for name in tokenizers}

        with open(file_path, "r") as file:
            for line in file:
                data = json.loads(line)
                for encoding_name in tokenizers.keys():
                    token_counts[encoding_name] += self.count_tokens_from_messages(encoding_name, data["messages"])

        return token_counts


# Example Usage
# trainer = TrainGPT()
# trainer.create_file("path/to/file.jsonl")
# trainer.start_training()
# trainer.list_jobs()
# trainer.get_job_details()
# trainer.cancel_job()
# trainer.list_events()

def main():
    parser = argparse.ArgumentParser(description="Command Line Interface for TrainGPT")
    parser.add_argument("--create-file", type=str, help="Path to the file to be uploaded")
    parser.add_argument("--start-training", action="store_true",
                        help="Start a new training job using the uploaded file")
    parser.add_argument("--list-jobs", action="store_true", help="List all training jobs")
    parser.add_argument("--get-job-details", type=str, help="Get details for a specific job")
    parser.add_argument("--cancel-job", type=str, help="Cancel a specific job")
    parser.add_argument("--list-events", type=str, help="List events for a specific job")
    parser.add_argument("--list-models-summaries", type=str, help="List models summaries, per owner")
    parser.add_argument("--list-models-by_owner", type=str, help="List models from an owner")
    parser.add_argument("--delete-model", type=str, help="Delete a specific model")

    args = parser.parse_args()

    trainer = TrainGPT()

    if args.create_file:
        trainer.create_file(args.create_file)
    if args.start_training:
        trainer.start_training()
    if args.list_jobs:
        trainer.list_jobs()
    if args.get_job_details:
        trainer.get_job_details(args.get_job_details)
    if args.cancel_job:
        trainer.cancel_job(args.cancel_job)
    if args.list_events:
        trainer.list_events(args.list_events)
    if args.delete_model:
        trainer.delete_model(args.delete_model)
    if args.list_models_by_owner:
        trainer.list_models_by_owner(args.list_models_by_owner)
    if args.list_models_summaries:
        trainer.list_models_by_owner(args.list_models_summaries)


if __name__ == "__main__":
    main()