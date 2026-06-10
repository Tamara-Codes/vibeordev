import type { Question } from '../types'

export const questions: Question[] = [
  {
    id: 1,
    category: 'Tokenization',
    question:
      "Roughly how many tokens is the word 'unfortunately' in a typical GPT BPE tokenizer?",
    options: ['1 token', '2-3 tokens', '6 tokens', '13 tokens (one per letter)'],
    correct: 1,
    explanation:
      "Common-ish words split into a handful of subword pieces — 'unfortunately' lands around 2-3 tokens, nowhere near one-per-letter.",
  },
  {
    id: 2,
    category: 'Transformers & Attention',
    question:
      'In scaled dot-product attention, which function turns the Query·Key scores into the attention weights?',
    options: ['Softmax', 'ReLU', 'Sigmoid', 'Tanh'],
    correct: 0,
    explanation:
      'Attention = softmax(QKᵀ / √dₖ)·V. The dot products of a Query with every Key are scaled by √dₖ, then softmax normalizes them into a probability distribution over the Values.',
  },
  {
    id: 3,
    category: 'Fundamentals',
    question: 'What does the "GPT" in GPT stand for?',
    options: [
      'General Purpose Transformer',
      'Generative Pre-trained Transformer',
      'Gradient Propagation Technique',
      'Guided Probabilistic Tokenizer',
    ],
    correct: 1,
    explanation:
      'Generative Pre-trained Transformer: generative output, pre-trained on large corpora, built on the transformer architecture.',
  },
  {
    id: 5,
    category: 'Embeddings & RAG',
    question: 'In a Retrieval-Augmented Generation (RAG) pipeline, what is actually stored in the vector database?',
    options: [
      'A fine-tuned copy of the model weights for every indexed document',
      'Embedding vectors of text chunks, used for similarity search',
      'The full text of every document, indexed as searchable JSON',
      'Pre-computed answers to every question a user might plausibly ask',
    ],
    correct: 1,
    explanation:
      'RAG embeds chunks of your corpus into vectors; at query time it embeds the question and retrieves the nearest chunks to ground the answer.',
  },
  {
    id: 6,
    category: 'Embeddings & RAG',
    question: 'Two embedding vectors point in nearly the same direction but one is twice as long. What does cosine similarity say about them?',
    options: [
      'They are very dissimilar, since one vector is twice the magnitude of the other',
      'They are highly similar — cosine ignores magnitude and measures angle',
      'Cosine similarity is undefined whenever the two vectors differ in length',
      'Similarity comes out to exactly 0.5, since one vector is double the other',
    ],
    correct: 1,
    explanation:
      'Cosine similarity depends only on the angle between vectors, not their length, so near-parallel vectors score close to 1 regardless of magnitude.',
  },
  {
    id: 7,
    category: 'Prompting',
    question: 'What does "few-shot prompting" mean?',
    options: [
      'Asking the model the same question several times and taking a majority vote',
      'Including a handful of worked examples in the prompt before the real task',
      'Limiting the model to generating just a few output tokens per response',
      'Fine-tuning the model on a few hundred hand-labeled examples',
    ],
    correct: 1,
    explanation:
      'Few-shot prompting puts example input/output pairs directly in the context so the model infers the pattern — no weight updates involved.',
  },
  {
    id: 8,
    category: 'Prompting',
    question: 'Chain-of-thought prompting improves results on reasoning tasks primarily because it…',
    options: [
      'Temporarily raises the model\'s effective parameter count during that inference',
      'Lets the model spend intermediate tokens working through steps before answering',
      'Quietly disables the built-in safety and alignment filters for the request',
      'Automatically retrieves supporting documents from an external knowledge base',
    ],
    correct: 1,
    explanation:
      'Asking for step-by-step reasoning gives the model more intermediate computation (tokens) to reach the answer, improving multi-step accuracy.',
  },
  {
    id: 9,
    category: 'Training & Fine-tuning',
    question: 'What is the core idea behind RLHF (Reinforcement Learning from Human Feedback)?',
    options: [
      'Humans hand-label all the data and the entire model is retrained from scratch each round',
      'A reward model trained on human preferences is used to fine-tune the policy with RL',
      'The model plays millions of games against itself with no human input at all',
      'Engineers manually edit the model\'s weights to encode the desired behavior',
    ],
    correct: 1,
    explanation:
      'Humans rank outputs, a reward model learns those preferences, and the LLM is optimized (e.g. with PPO) to maximize that reward.',
  },
  {
    id: 10,
    category: 'Training & Fine-tuning',
    question: 'What does LoRA (Low-Rank Adaptation) do during fine-tuning?',
    options: [
      'Quantizes all of the base weights down to 4-bit precision before training',
      'Freezes the base weights and trains small low-rank update matrices instead',
      'Prunes roughly half of the attention heads to make training run faster',
      'Distills the large base model down into a much smaller student network',
    ],
    correct: 1,
    explanation:
      'LoRA freezes the original weights and learns tiny low-rank matrices added to them — drastically fewer trainable parameters and memory.',
  },
  {
    id: 11,
    category: 'Fundamentals',
    question: 'What is "hallucination" in the context of LLMs?',
    options: [
      'The model crashing partway through generation due to an out-of-memory error',
      'Confidently generating plausible-sounding but false or fabricated information',
      'A deliberate creativity mode you switch on with a special sampling flag',
      'When the model flatly refuses to answer a perfectly reasonable question',
    ],
    correct: 1,
    explanation:
      'Hallucination is fluent, confident output that is simply not grounded in fact — a core reliability challenge for LLMs.',
  },
  {
    id: 12,
    category: 'Fundamentals',
    question: 'Raising the "temperature" sampling parameter generally does what to the output?',
    options: [
      'Makes the output far more deterministic, repetitive, and predictable',
      'Makes it more random and varied by flattening the token distribution',
      'Speeds up token generation by sampling from fewer candidate tokens',
      'Increases the maximum context length the model is able to attend to',
    ],
    correct: 1,
    explanation:
      'Higher temperature flattens the probability distribution so less-likely tokens get picked more often — more diverse, less predictable text.',
  },
  {
    id: 13,
    category: 'Transformers & Attention',
    question: 'Why do transformers need positional encodings?',
    options: [
      'To compress the long input sequence and save substantial memory during the attention computation',
      'Because self-attention is order-agnostic and would otherwise treat input as a bag of tokens',
      'To encrypt the prompt before it is processed by the model\'s attention layers',
      'To convert the internal tokens back into human-readable words at the very end',
    ],
    correct: 1,
    explanation:
      'Self-attention has no inherent notion of order, so positional information must be injected for the model to understand sequence.',
  },
  {
    id: 14,
    category: 'Models & Benchmarks',
    question: 'What does a "7B" label on a model like Llama 7B refer to?',
    options: [
      'It was trained on 7 billion tokens',
      'It has roughly 7 billion trainable parameters',
      'It supports a 7-billion-character context window',
      'It costs 7 billion FLOPs per token',
    ],
    correct: 1,
    explanation:
      'The "B" denotes parameter count in billions. Training-token counts are usually far larger than the parameter count.',
  },
  {
    id: 15,
    category: 'Models & Benchmarks',
    question: 'What does MMLU measure?',
    options: [
      'Average inference latency per generated token, measured in milliseconds',
      'Multitask accuracy across 57 academic and professional subjects',
      'The maximum size of the model\'s context window, measured in tokens',
      'Total energy consumption over the course of the full training run',
    ],
    correct: 1,
    explanation:
      'MMLU (Massive Multitask Language Understanding) is a multiple-choice benchmark spanning 57 subjects, used to gauge broad knowledge.',
  },
  {
    id: 16,
    category: 'Agents & Tools',
    question: 'In the ReAct agent pattern, what does the model interleave?',
    options: [
      'Reading from and writing to the local disk in between every generation step',
      'Reasoning traces and actions (tool calls), using observations to decide the next step',
      'Rendering React UI components and dispatching Redux state, despite the name',
      'Document retrieval combined with aggressive response caching, and nothing more than that',
    ],
    correct: 1,
    explanation:
      'ReAct = Reason + Act: the model alternates between thinking and taking actions (tool calls), feeding observations back into its reasoning.',
  },
  {
    id: 17,
    category: 'Agents & Tools',
    question: 'When an LLM "calls a function" via tool use, what does the model itself actually produce?',
    options: [
      'It executes the target function directly inside its own weights during the forward pass itself',
      'A structured request (e.g. JSON args) that your code runs, returning the result to the model',
      'Fully compiled machine code for the target function, ready for the OS to execute',
      'A raw network packet sent straight to the external tool\'s REST API endpoint',
    ],
    correct: 1,
    explanation:
      'The model only emits a structured call describing which tool and arguments; your application executes it and feeds the result back.',
  },
  {
    id: 18,
    category: 'Tokenization',
    question: 'Why can LLMs struggle with tasks like counting the letters in a word or reversing a string?',
    options: [
      'They quickly run out of memory even on relatively short character-level inputs',
      'They see subword tokens, not individual characters, so character-level structure is obscured',
      'Their sampling temperature is permanently hardcoded far too high for this kind of precise task',
      'Tokenizers silently strip out all punctuation and whitespace before processing',
    ],
    correct: 1,
    explanation:
      'BPE/wordpiece tokenizers operate on multi-character chunks, so the model has limited visibility into exact character composition.',
  },
  {
    id: 19,
    category: 'Embeddings & RAG',
    question: 'What problem does "chunking" address when building a RAG system?',
    options: [
      'Reducing the underlying model\'s total parameter count so that it needs far less memory',
      'Splitting long documents into retrievable, embeddable units sized to fit the context',
      'Encrypting all of the source documents at rest inside the vector database',
      'Converting PDFs and other binary documents into images before indexing them',
    ],
    correct: 1,
    explanation:
      'Documents are split into chunks so each can be embedded, retrieved independently, and fit within the model\'s context window.',
  },
  {
    id: 20,
    category: 'Training & Fine-tuning',
    question: 'What does the "pre-training" objective of a typical decoder-only LLM look like?',
    options: [
      'Classifying each input sentence as either positive or negative in sentiment',
      'Predicting the next token given all previous tokens (autoregressive language modeling)',
      'Reconstructing the original input image from its paired text caption, one pixel at a time',
      'Matching incoming questions to the answers stored in a large fixed database',
    ],
    correct: 1,
    explanation:
      'Decoder-only LLMs are pre-trained with next-token prediction: maximize the probability of the next token given the preceding context.',
  },
  {
    id: 21,
    category: 'Fundamentals',
    question: "What is a model's \"context window\"?",
    options: [
      'The maximum amount of text, in tokens, the model can consider at once',
      'The total number of GPUs required to serve the model in production',
      'The maximum wall-clock time allowed for generating a single response',
      'The total size of the dataset the model was originally trained on',
    ],
    correct: 0,
    explanation:
      'The context window is the maximum number of tokens — prompt plus response — a model can attend to in a single pass. Go past it and the earliest tokens fall out of view.',
  },
]
