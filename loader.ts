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
// console.log(pineconeStore)
// add documents
const array = [
// "ias-1-presentation-of-financial-statements.pdf",
"ias-29-financial-reporting-in-hyperinflationary-economies.pdf",
"ias-10-events-after-the-reporting-period.pdf",
"ias-32-financial-instruments-presentation.pdf",
"ias-12-income-taxes.pdf",
"ias-33-earnings-per-share.pdf",
"ias-16-property-plant-and-equipment.pdf",
"ias-34-interim-financial-reporting.pdf",
"ias-19-employee-benefits.pdf",
"ias-36-impairment-of-assets.pdf",
"ias-2-inventories.pdf",
"ias-37-provisions-contingent-liabilities-and-contingent-assets.pdf",
"ias-20-accounting-for-government-grants-and-disclosure-of-government-assistance.pdf",
"ias-38-intangible-assets.pdf",
"ias-21-the-effects-of-changes-in-foreign-exchange-rates.pdf",
"ias-39-financial-instruments-recognition-and-measurement.pdf",
"ias-23-borrowing-costs.pdf",
"ias-40-investment-property.pdf",
"ias-24-related-party-disclosures.pdf",
"ias-26-accounting-and-reporting-by-retirement-benefit-plans.pdf",
"ias-7-statement-of-cash-flows.pdf",
"ias-27-separate-financial-statements.pdf",
"ias-8-accounting-policies-changes-in-accounting-estimates-and-errors.pdf",
"ias-28-investments-in-associates-and-joint-ventures.pdf"]

for (let i = 0; i < array.length; i++) {
  console.log('processing', array[i]);
  const loader = new PDFLoader(`./pdf/${array[i]}`);
  const docs = await loader.load();
  const ids = await pineconeStore.addDocuments(docs);
  console.log(ids);
}

// search
// const pageContent = "revised IAS 41";
// try {
//   const results = await pineconeStore.similaritySearch(pageContent, 2);
// } catch (e){
//   console.log(e);
// }

// console.log(results);
