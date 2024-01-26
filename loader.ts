import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

const pc = new Pinecone({
  apiKey: '337d60a7-8b68-434e-abfb-5fe104fa187e'
});
const pineconeIndex = pc.index('test');

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-large",
});

const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });
console.log(pineconeStore)
// add documents
// const loader = new PDFLoader("./pdf/ias-41-agriculture.pdf");
// const docs = await loader.load();


// const ids = await pineconeStore.addDocuments(docs);
// console.log(ids);

// console.log(docs); 

// search
const pageContent = "revised IAS 41";
try {
  const results = await pineconeStore.similaritySearch(pageContent, 2);
} catch (e){
  console.log(e);
}

// console.log(results);
