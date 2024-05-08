import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import axios from 'axios'

const dotenv = require("dotenv");
dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }); 
  
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
   if(req.method=='POST'){
    const query = req.body.query;
    console.log(query,"query")
    // Generate an embedding for the query
    const queryEmbeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query
    });

    const queryEmbedding = queryEmbeddingResponse.data[0].embedding; // Get embedding



    const data = {
      
          topK: 10,
          vector: queryEmbedding,
          includeValues: true,
          includeMetadata: true,
        }
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://pdfs-v3n6e1s.svc.aped-4627-b74a.pinecone.io/query",
      headers: {
        "Api-Key": `1c7035d8-2b87-4694-8cd9-033ce1c28479`,
        "Content-Type": "application/json",
      },
      data: data,
    };
  
    const queryResponse = await axios.request(config)
    console.log(queryResponse,"pinecone res")
    const content = queryResponse.data.matches
    .map((match: { metadata: { text: any; }; }) => match.metadata.text)
    .join(" ");
    const response = await openai.chat.completions.create({
      model:'gpt-3.5-turbo',
          messages:[
              {role: "user", content: `Based on the following information: "${content}", answer the question: ${query}`},
              ],
    });
  console.log(response['choices'][0]['message']['content'])
  
   
    res.send({
        answer: response['choices'][0]['message']['content']
    });
   }

  
   
 
}




