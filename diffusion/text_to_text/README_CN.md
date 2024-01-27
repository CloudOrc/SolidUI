# 背景介绍

微调定制模型，结构化调整。通过训练数据集，输出更高质量结果。降低延迟，节省提示词输入。

OpenAI 的文本生成模型已经过大量文本的预训练。

微调改进了少数次学习，让您在广泛的任务上获得更好的结果。一旦模型经过微调，您就不需要在引导中提供那么多的示例。这样可以节省成本，并实现低延迟的请求。

# 步骤

1.准备并上传训练数据

2.训练新的微调模型

3.评估结果并根据需要返回步骤 1

4.使用您的微调模型

# 价格


以下是不同微调模型的定价：

**GPT-3.5-turbo**

训练：每1,000个tokens $0.0080
输入使用：每1,000个tokens $0.0030
输出使用：每1,000个tokens $0.0060

**Davinci-002**

训练：每1,000个tokens $0.0060
输入使用：每1,000个tokens $0.0120
输出使用：每1,000个tokens $0.0120

**Babbage-002**

训练：每1,000个Token $0.0004
输入使用：每1,000个tokens $0.0016
输出使用：每1,000个tokens $0.0016

**微调价格公式**：base cost per 1k tokens * number of tokens in the input file * number of epochs trained

对于在3个number of epochs 训练的包含100000个令牌的训练文件，预期成本约为2.40美元。

# 微调模型类型

* gpt-3.5-turbo-1106 (recommended)
* gpt-3.5-turbo-0613
* babbage-002
* davinci-002
* gpt-4-0613 (experimental)

# 使用

**我们的模型在一些任务上可能最初看起来表现不佳，但是通过正确的提示可以改善结果——因此可能不需要微调。**

**与微调相比，迭代提示和其他策略的反馈循环更快。微调需要创建数据集和运行训练作业，这是一个较长的过程。**

即使在微调仍然必要的情况下，最初的提示工程工作也不会浪费——我们通常看到使用好的提示作为微调数据（或将提示链接/工具使用与微调结合起来）时能够获得最好的结果。

我们的提示工程指南提供了一些最有效策略和技巧的背景知识，这些策略和技巧可以在不进行微调的情况下获得更好的性能。

简而言之，微调是一个强大的工具，可以提高模型在特定任务上的性能，但在许多情况下，通过巧妙设计提示可以实现类似的改进，且速度更快、成本更低。如果微调确实必要，那么之前进行的提示工程同样是宝贵的经验，这些经验可以整合到微调的数据中，以获得最佳效果。


# 准备你的数据
默认示例
```
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
# 精心设计的提示


我们通常建议您采用在微调之前对模型最有效的那组指令和提示，并将它们包含在每个训练示例中。 这应该可以让您获得最好、最普遍的结果，尤其是当您的训练示例相对较少时（例如少于一百个）。

如果您想缩短在每个示例中重复的指令或提示以节省成本，请记住，模型的行为可能会表现得好像包含了这些指令一样，并且在推理时可能很难让模型忽略这些“内置”的指令。

由于模型必须完全通过演示来学习，而没有指导性的指令，因此可能需要更多的训练示例才能获得好的结果。

# 示例数量建议

要对模型进行微调，您需要提供至少10个示例。我们通常看到，使用gpt-3.5-turbo对50到100个训练示例进行微调后，会有明显的改进，但确切的用例数量会有很大的不同。

我们建议从50个精心设计的演示开始，看看模型在微调后是否有改进的迹象。在某些情况下，这可能就足够了，但即使模型还没有达到生产质量，明显的改进也是一个好迹象，表明提供更多的数据将继续改进模型。如果没有改进，这可能意味着您需要重新考虑如何为模型设置任务，或者在扩展有限示例集之前重新结构化数据。

# 训练和测试分割

在收集初始数据集后，我们建议将其分割为训练和测试部分。当同时提交带有训练和测试文件的微调作业时，我们将在训练过程中提供两者的统计信息。这些统计信息将是你了解模型改进程度的初步信号。此外，早期构建测试集将有助于确保你能够通过在测试集上生成样本来评估训练后的模型。

测试数据集格式：[https://cookbook.openai.com/examples/chat_finetuning_data_prep](https://cookbook.openai.com/examples/chat_finetuning_data_prep)
# 令牌限制

令牌限制取决于您选择的模型。对于gpt-3.5-turbo-1106，最大上下文长度为16385，因此每个训练示例也限制为16385个令牌。对于gpt-3.5-turbo-0613，每个训练示例限制为4096个令牌。长于默认值的示例将被截断为最大上下文长度，这将从训练示例的末尾删除令牌。要确保您的整个训练示例符合上下文，请考虑检查消息内容中的总令牌数是否低于限制。

您可以使用OpenAI cookbook中的计数令牌笔记本来计算令牌数。

# 使用示例

上传API Key：export OPENAI_API_KEY="your_api_key"
## 方法

**File Upload**: 轻松上传您的微调数据文件。
**File List**: 查看您的所有文件（已上传的文件和之前的训练结果）。
**File Details**: 获取文件详细信息。
**Count tokens**: 使用tiktoken库计算词元。
**Start Training**:  使用您上传的数据开始新的训练任务。
**List Jobs**:  查看您当前和过去的所有训练任务。
**Job Details**:  检索有关特定训练任务的详细信息。
**Cancel**: 取消训练任务。
**Delete**:  删除训练任务。
**List Models**: 按您的模型和标准模型过滤，查看您当前和过去的所有微调模型
**List Models Summaries**: 按所有者分组查看您的所有模型。
**Model Details**: 检索有关特定模型的详细信息。
**Delete Model**: 删除微调模型。

## Python SDK 

1.Initialization

```bash
from train_gpt_utilities import TrainGPT
trainer = TrainGPT()
```

2.Upload Training Data

```bash
trainer.create_file("path/to/your/training_data.jsonl")
```

3.Start a Training Job

```bash
trainer.start_training()
```

4.Listing All Jobs

```bash
jobs = trainer.list_jobs()

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
当状态为“成功”时，您的模型应该可以使用了。您可以跳到步骤 7 找到微调后的模型。
如果列表中有多个作业，您可以使用 id 来获取特定作业的详细信息。

5.Fetching Job Details

```bash
job_details = trainer.get_job_details("specific_job_id")
```

6.Cancel a Job

```bash
trainer.cancel_job("specific_job_id")
```

7.Find the fine tuned model

```bash
models = trainer.list_models_summaries()

You have access to 61 number of models.
Those models are owned by:
openai: 20 models
openai-dev: 32 models
openai-internal: 4 models
system: 2 models
iongpt: 3 models
```

8.Model Details

```bash
trainer.list_models_by_owner("iongpt")
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
```

## 命令行

```bash
# Uploading a File
python train_gpt_cli.py --create-file /path/to/your/file.jsonl
# Starting a Training Job
python train_gpt_cli.py --start-training
# Listing All Jobs 
python train_gpt_cli.py --list-jobs
# requires a specific job or file ID 
python train_gpt_cli.py --get-job-details your_job_id
```




