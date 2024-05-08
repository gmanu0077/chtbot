// pages/api/upload.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import pdfParse from 'pdf-parse';
import {  OpenAI} from 'openai'
const { Pinecone } = require('@pinecone-database/pinecone');
const dotenv = require("dotenv");
dotenv.config();
const uploadFolder = path.resolve(process.cwd(), 'uploads');
const upload = multer({  storage: multer.memoryStorage()});
const uploadt = multer({  dest:uploadFolder});
const openai = new OpenAI({
  apiKey: 'sk-proj-knMtqQWvnnFwpFIybXScT3BlbkFJWxD7iXUno1J6lALFpoHT',
}); 
export const config = {
  api: {
    bodyParser: false,
  },
};




export default async function dataUpload(req: any, res: any) {
  const client = new Pinecone({apiKey:'1c7035d8-2b87-4694-8cd9-033ce1c28479',environment:'us-east-1'});

    if (req.method === 'POST') {
      console.log(req.body,"req")
      // Handle the file upload, storing files in memory
      uploadt.single('file');
      const uploadMiddleware = upload.single('file');
  
      uploadMiddleware(req, res, async (error) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded.' });
        }
  
        // Use the file buffer directly for parsing
        try {
          //console.log(req.body,"req",req.file)
          const Data = await pdfParse(req.file.buffer);
          // Respond with the extracted text content
         // console.log("dtaat",req.file.originalname,Data)

         try {

          const chunkSize = 500; // Number of characters per chunk

    // Iterate through PDF text and create chunks
    let chunkId = 1;
    let offset = 0;
    while (offset < Data.text.length) {
        const chunkText = Data.text.substr(offset, chunkSize);
        
        // Generate embedding for chunk text
        const embedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: JSON.stringify(Data),
      });;

        // Store vector in Pinecone with reference text as metadata
        await client.index('pdfs').upsert([{
            id: `chunk_${chunkId}`,
            values: embedding.data[0].embedding,
            metadata: { text: chunkText }
        }]);

        // Move to next chunk
        offset += chunkSize;
        chunkId++;
    }
      
          
         // await index.upsert([{ id:'pdf1', values: embedding.data[0].embedding,metadata: { text: Data.text } }]);
      } catch (error) {
          console.error("Error generating or inserting embedding:", error);
      }

        // return (response['choices'][0]['message']['content'])
        
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
 