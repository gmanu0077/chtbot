// pages/api/upload.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import pdfParse from 'pdf-parse';
import {  OpenAI} from 'openai'
import axios from 'axios'
const dotenv = require("dotenv");
dotenv.config();
const upload = multer({  storage: multer.memoryStorage()});
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}); 
export const config = {
  api: {
    bodyParser: false,
  },
};




export default async function dataUpload(req: any, res: any) {

    if (req.method === 'POST') {
      console.log(req.body,"req")
      const uploadMiddleware = upload.single('file');
  
      uploadMiddleware(req, res, async (error) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded.' });
        }
  
        try {
          const Data = await pdfParse(req.file.buffer);
         

         try {

          const chunkSize = 500; // Number of characters per chunk

    
    let chunkId = 1;
    let offset = 0;
    while (offset < Data.text.length) {
        const chunkText = Data.text.substr(offset, chunkSize);
        
       
        const embedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: JSON.stringify(Data),
      });
      const data = {
        vectors: [
          {
            id: "pdf1",
            values: embedding.data[0].embedding,
            metadata: {
              text: chunkText
            }
          }]}
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://pdfs-v3n6e1s.svc.aped-4627-b74a.pinecone.io/vectors/upsert",
        headers: {
          "Api-Key": `1c7035d8-2b87-4694-8cd9-033ce1c28479`,
          "Content-Type": "application/json",
        },
        data: data,
      };
    
       await axios.request(config)
       
        offset += chunkSize;
        chunkId++;
    }
      
          
      } catch (error) {
          console.error("Error generating or inserting embedding:", error);
      }

        
          res.status(200).json({ text: Data.text });
        } catch (parseError) {
          res.status(500).json({ error: 'Failed to parse PDF file.', details: parseError });
        }
      });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end('Method Not Allowed');
    }
  }
 