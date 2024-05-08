import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const axios = require("axios");

  const dummyValues = Array(1536).fill(2);

  let data = JSON.stringify({
    vectors: [
      {
        id: "vec1",
        values: dummyValues,
        metadata: {
          genre: "drama",
        },
      },
    ],
    namespace: "ns1",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://pdfs-v3n6e1s.svc.aped-4627-b74a.pinecone.io/vectors/upsert",
    headers: {
      "Api-Key": "1c7035d8-2b87-4694-8cd9-033ce1c28479",
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await axios.request(config);

  //@ts-ignore
  res.status(200).json({ data: response.data });
}
