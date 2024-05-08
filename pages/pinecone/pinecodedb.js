const { Pinecone } = require('@pinecone-database/pinecone');
const dotenv = require("dotenv");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { OpenAI } = require("langchain/llms/openai");
const { loadQAStuffChain } = require("langchain/chains");
const { Document } = require("langchain/document");

dotenv.config();
const client = new Pinecone({apiKey:'23b7a926-7600-4877-ac3e-4b5ad8ae9c40', environment:'us-central1-gcp'});

const queryPineconeVectorStoreAndQueryLLM = async (client, question) => {
  console.log("Querying Pinecone vector store...");
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  const queryResponse = await client.index("neet-ai").query({
    topK: 10,
    vector: queryEmbedding,
    includeValues: true,
    includeMetadata: true,
  });

  console.log(`Found ${queryResponse.matches.length} matches...`);
  console.log(`Asking question: ${question}...`);
        if (queryResponse.matches.length) {
            const llm = new OpenAI({modelName:'gpt-4'});
            const chain = loadQAStuffChain(llm);
            const concatenatedPageContent = queryResponse.matches
                .map((match) => match.metadata.pageContent)
                .join(" ");
            const result = await chain.call({
                input_documents: [new Document({ pageContent: concatenatedPageContent })],
                question: question,
            });

            console.log(`Answer: ${result.text}`);
            return (`${result.text}`);
        } else {
            console.log("Since there are no matches, GPT-3 will not be queried.");
        }
    };

    async function getAnswerFromPinecone(question) {
        return await queryPineconeVectorStoreAndQueryLLM(client, question);
    }
 
//    getAnswerFromPinecone('what is physics').then((res)=>{console.log(res);})
    module.exports = getAnswerFromPinecone
   

