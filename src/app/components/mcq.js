"use client";
import { useState } from "react";

export default function AddMcqForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mcqData = {
      question,
      options,
      answer,
    };

    try {
      const res = await fetch("/api/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mcqData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Inserted successfully! ID: " + data.insertedId);
        setQuestion("");
        setOptions(["", "", "", ""]);
        setAnswer("");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter Question"
        required
        className="w-full border px-3 py-2"
      />
      {options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          value={opt}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[idx] = e.target.value;
            setOptions(newOptions);
          }}
          placeholder={`Option ${idx + 1}`}
          required
          className="w-full border px-3 py-2"
        />
      ))}
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter Correct Answer"
        required
        className="w-full border px-3 py-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit MCQ
      </button>
    </form>
  );
}
