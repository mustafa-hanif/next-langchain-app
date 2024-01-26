
import { StreamingTextResponse, LangChainStream, experimental_StreamData } from 'ai';

import { ChatOpenAI, OpenAI } from '@langchain/openai';
import { BytesOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { formatDocumentsAsString } from "langchain/util/document";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { LLMChain } from 'langchain/chains';

export const runtime = 'edge';
const pc = new Pinecone({
  apiKey: '337d60a7-8b68-434e-abfb-5fe104fa187e'
});
const TEMPLATE = `Answer the question based only on the following context:
{context}

Question: {question}`;

export async function POST(req: Request) {
  const { prompt: value } = await req.json();

  const model = new OpenAI({ temperature: 0.5, streaming: true, modelName: "gpt-3.5-turbo-1106" });
  const prompt = PromptTemplate.fromTemplate(TEMPLATE);
  const pineconeIndex = pc.index('test');
  const outputParser = new StringOutputParser();

  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-large",
  });
  const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });
  const retriever = pineconeStore.asRetriever(4);

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    outputParser
  ]);

  const stream = await chain.stream(value);
  
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  let first_entry_skipped = false;
  const transformStream = new TransformStream({
    transform(chunk, controller) {  
      if  (!first_entry_skipped) {
          first_entry_skipped = true;
      }
      else {
        controller.enqueue(chunk.toString());
      }
    },
  });

    return new StreamingTextResponse(stream.pipeThrough(transformStream));
}
