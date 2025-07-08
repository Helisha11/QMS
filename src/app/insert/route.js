import { MongoClient } from "mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const uri = process.env.DATABASE_URL;

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("quizdb");
    const collection = db.collection("Mcq");

    const result = await collection.insertOne(body);
    await client.close();

    return new Response(
      JSON.stringify({ success: true, insertedId: result.insertedId }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
