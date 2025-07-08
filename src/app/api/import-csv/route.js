import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function GET() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    const filePath = path.join(process.cwd(), "filtered_train.csv"); // or your actual CSV filename

    // Read and parse CSV
    const mcqs = await new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          results.push({
            question: row.question,
            options: [row.option1, row.option2, row.option3, row.option4],
            answer: row.answer,
          });
        })
        .on("end", () => resolve(results))
        .on("error", reject);
    });

    await client.connect();
    const db = client.db("quizdb");
    const collection = db.collection("Mcq");

    const result = await collection.insertMany(mcqs);
    await client.close();

    return new Response(
      JSON.stringify({ success: true, insertedCount: result.insertedCount }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
