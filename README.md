Objective:
My goal was to create an efficient and accurate chatbot by leveraging Vector DB and OpenAI’s Large Language Model (LLM). I aimed to improve response quality and speed.


Technology Stack--
I chose the following technologies for the project:
Typescript: A statically typed language that enhances tooling and type safety.
Next.js: A React framework for server-rendered web applications.
Node.js: The runtime environment for executing JavaScript on the server side.


Tools Used:--
Pinecone: A vector database for efficient similarity search based on embeddings.
OpenAI: Utilising LLM for natural language understanding and generation.

Methodology---
Chunking PDF Text:
I broke down PDF text into manageable chunks on the server side.
Each chunk was then embedded by OpenAI, with reference text serving as metadata.

Storage in Pinecone:
The embedded chunks were stored in Pinecone for efficient similarity search.

Handling Queries:
When a query was posed, I embedded it using OpenAI.
The embedded query was then queried in Pinecone, returning similar chunks along with metadata.

Final Response Generation:
I combined the relevant chunks and passed them to OpenAI to form the final chatbot response.


Challenges Faced--
Chunk Size and Vector Array Optimization:
Determining the right chunk size and vector array size for Pinecone was challenging.
OpenAI 3.5 Limitations:
OpenAI 3.5 didn’t always generate optimal responses, highlighting the importance of model selection.

Key Learning---
Understanding the core workings of Vector DBs like Pinecone is crucial for building effective search systems.
Professionalism in project execution ensures success.

