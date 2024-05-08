import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
const { Pinecone } = require('@pinecone-database/pinecone');
const dotenv = require("dotenv");
dotenv.config();
const openai = new OpenAI({
    apiKey: 'sk-proj-knMtqQWvnnFwpFIybXScT3BlbkFJWxD7iXUno1J6lALFpoHT',
  }); 
  
  const client = new Pinecone({apiKey:'23b7a926-7600-4877-ac3e-4b5ad8ae9c40', environment:'us-central1-gcp'});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
   if(req.method=='POST'){
    const query = req.body.query;

    // Generate an embedding for the query
    const queryEmbeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query
    });

    const queryEmbedding = queryEmbeddingResponse.data[0].embedding; // Get embedding


    const queryResponse = await client.index("pdfs").query({
      topK: 10,
      vector: queryEmbedding,
      includeValues: true,
      includeMetadata: true,
    });
    
    // Fetch the most relevant document based on the query embedding
    console.log(queryResponse,"pinecone res")
    const content = queryResponse.matches
    .map((match: { metadata: { text: any; }; }) => match.metadata.text)
    .join(" ");
    // Generate a response using GPT-3 with the relevant document as context
    const gptResponse = await openai.completions.create({
        model: "gpt4",
        prompt: `Based on the following information: "${content}", answer the question: ${query}`,
        
    });
    console.log(gptResponse,"res")
    res.json({
        answer: gptResponse.choices[0].text
    });
   }

  
   
 
}




