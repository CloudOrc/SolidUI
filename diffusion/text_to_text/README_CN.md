# ChatGPT 3.5 Fine-tuning Utilities


This project provides a set of utilities to assist users in fine-tuning the ChatGPT 3.5 model with OpenAI. 
The utilities are wrapped into a single `TrainGPT` class which allows users to manage the entire fine-tuning lifecycle - from uploading data files, to starting training jobs, monitoring their progress, and managing the trained models.


I was using a collection of curl commands to "interact" with OAI API and it went out of control, so I started to group things together. I work a lot from the interactive Python console to test and "play" with things, so having things grouped up helps. I also plan to release the other collections for dealing with inference for custom models and managing the assests (fiels, embeddings, etc)

## Features:
- **File Upload**: Easily upload your fine-tuning data files.
- **File List**: See all your files (Uploaded and results of previous trainings).
- **File Details**: Get file details.
- **Count tokens**: Count tokens with tiktoken library.
- **Start Training**: Begin a new training job using your uploaded data.
- **List Jobs**: View all your current and past training jobs.
- **Job Details**: Retrieve detailed information about a specific training job.
- **Cancel**: Cancel a training job.
- **Delete**: Delete a training job.
- **List Models**: View all your current and past fine-tuned models, filtered per your models and standard models
- **List Models Summaries**: View all your models, grouped per owner.
- **Model Details**: Retrieve detailed information about a specific model.
- **Delete Model**: Delete a fine-tuned model.
---

# PSA
~~The code contains a `get_token_count()` method that will count the tokens from the training file using `tiktoken` library.~~
~~It will use 3 available encoders: "cl100k_base", "p50k_base", "r50k_base" and will show the results for each one.~~

~~**YOU WILL BE CHARGED ABOUT 10 TIMES THAT NUMBER OF TOKENS**. So, if you have 100k tokens returned by the `get_token_count()` method, you will be charged for 1M tokens.~~

I was wrong here. There is an overhead, but is not alwats 10x
For small files (100, 500, 1000, 2000 tokens), trained tokens are 15k+, It seems you can't go bellow 15k tokens, no matter how small is your training file.

For bigger files, the overhead is still there, but lower. For a file with 3 920 281 tokens, trained tokens were 4 245 281, so the overhead is around 6%.
For a file with 40 378 413 counted tokens, trained tokens were: 43 720 882.

**There is an overhead that will be 10x on very small files, but it gets to bellow 10% on larger files**

Here is a quick table with the overhead at different token levles:

|Number of tokens in the training file|Number of charged tokens|Overhead|
|:-|:-|:-|
|1 426|15 560|1091%|
|3 920 281|4 245 281|8.29%|
|40 378 413|43 720 882|8.27%|
|92 516 393 | File exceeds maximum size of 50000000 tokens for fine-tuning | | |
|46 860 839 |48 688 812| Here they removed some rows as "moderation"|
|25 870 859 |26 903 007|9.61%|
|41 552 537 |43 404 802 |9.54%|

****It seems that there is a limitation to 50 000 000 tokens****

## Prerequisites:

- **API Key**: Ensure you have set up your OpenAI API key. You can set it as an environment variable named `OPENAI_API_KEY`.

```angular2html
export OPENAI_API_KEY="your_api_key"
```


## Installation:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your_username/chatgpt-fine-tuning-utilities.git
   cd chatgpt-fine-tuning-utilities
   ```

2. **Install Dependencies**:

   ```bash
   pip install -r chatgptbase.txt
   ```

## Prepare your data:

Data needs to be in JSONL format:
```json
[
  {
  "messages": [
    { "role": "system", "content": "You are an assistant that occasionally misspells words" },
    { "role": "user", "content": "Tell me a story." },
    { "role": "assistant", "content": "One day a student went to schoool." }
  ]
},
  {
  "messages": [
    { "role": "system", "content": "You are an assistant that occasionally misspells words" },
    { "role": "user", "content": "Tell me a story." },
    { "role": "assistant", "content": "One day a student went to schoool." }
  ]
}
]
```
Save it as `data.jsonl` in the root directory of the project.

## Detailed Usage:

### **Python Script Usage**:

After setting up, you can utilize the `TrainGPT` class in your Python scripts as follows:

1. **Initialization**:

    Start by importing and initializing the `TrainGPT` class.

    ```python
    from train_gpt_utilities import TrainGPT
    trainer = TrainGPT()
    ```

2. **Upload Training Data**:

    Upload your training data file to start the fine-tuning process.

    ```python
    trainer.create_file("path/to/your/training_data.jsonl")
    ```

3. **Start a Training Job**:

    Begin the training process using the uploaded file.

    ```python
    trainer.start_training()
    ```
4. **Listing All Jobs**:

    You can list all your current and past training jobs.

    ```python
    jobs = trainer.list_jobs()
    ```
   You will get something like this:

    ```bash
   trainer.list_jobs()
   There are 1 jobs in total.
   1 jobs of fine_tuning.job.
   1 jobs succeeded.
   
   List of jobs (ordered by creation date):
   
   - Job Type: fine_tuning.job
     ID: ftjob-Sq3nFz3Haqt6fZwqts321iSH
     Model: gpt-3.5-turbo-0613
     Created At: 2023-08-24 04:19:56
     Finished At: 2023-08-24 04:29:55
     Fine Tuned Model: ft:gpt-3.5-turbo-0613:iongpt::7qwGfk6d
     Status: succeeded
     Training File: file-n3kU9Emvvoa8wRrewaafhUv
   ```
   When the status is "succeeded" you should have your model ready to use. You can jump to step 7 to find the fine tuned model.

   If you have multiple jobs in the list, you can use the id to fetch the details of a specific job.
5. **Fetching Job Details**:

    You can get detailed statistics of a specific training job.

    ```python
    job_details = trainer.get_job_details("specific_job_id")
    ```
   If something goes wrong, you can cancel a job using
6. **Cancel a Job**:

    You can cancel a training job if it is still running.

    ```python
    trainer.cancel_job("specific_job_id")
    ```
7. **Find the fine tuned model**:
   For this we will use the list_models_summaries method.
    ```python
    models = trainer.list_models_summaries()
    ```
    You will get something like this:
     ```bash
   You have access to 61 number of models.
   Those models are owned by:
   openai: 20 models
   openai-dev: 32 models
   openai-internal: 4 models
   system: 2 models
   iongpt: 3 models
   ```
   Then, you can use the owner to fetch the details of models from specific owner. The fine tuned model will be in that list.
8. ```python
   trainer.list_models_by_owner("iongpt")
   ```
You will get something like this:
   ```bash
   Name: ada:ft-iongpt:url-mapping-2023-04-12-17-05-19
   Created: 2023-04-12 17:05:19
   Owner: iongpt
   Root model: ada:2020-05-03
   Parent model: ada:2020-05-03
   -----------------------------
   Name: ada:ft-iongpt:url-mapping-2023-04-12-18-07-26
   Created: 2023-04-12 18:07:26
   Owner: iongpt
   Root model: ada:2020-05-03
   Parent model: ada:ft-iongpt:url-mapping-2023-04-12-17-05-19
   -----------------------------
   Name: davinci:ft-iongpt:url-mapping-2023-04-12-15-54-23
   Created: 2023-04-12 15:54:23
   Owner: iongpt
   Root model: davinci:2020-05-03
   Parent model: davinci:2020-05-03
   -----------------------------
   Name: ft:gpt-3.5-turbo-0613:iongpt::7qy7qwVC
   Created: 2023-08-24 06:28:54
   Owner: iongpt
   Root model: sahara:2023-04-20
   Parent model: sahara:2023-04-20
   -----------------------------
   ````


### **Command Line Usage**:

This part was not tested yet. Please use the Python script usage for now.
Recommended to use from a python interactive shell.

1. **Uploading a File**:

    ```bash
    python train_gpt_cli.py --create-file /path/to/your/file.jsonl
    ```

2. **Starting a Training Job**:

    ```bash
    python train_gpt_cli.py --start-training
    ```

3. **Listing All Jobs**:

    ```bash
    python train_gpt_cli.py --list-jobs
    ```


For any command that requires a specific job or file ID, you can provide it as an argument. For example:

```bash
python train_gpt_cli.py --get-job-details your_job_id
```

## ToDo
1. Add support for inference on the custom fine tune models
2. Add suport for embeddings
   
## Contribution:

We welcome contributions to this project. If you find a bug or want to add a feature, feel free to open an issue or submit a pull request.

## License:

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for more details.
