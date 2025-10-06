"use client";

import { useState } from "react";

export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<any>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const timestamp = getTimestamp();
    setSubmittedAt(timestamp);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();
      setResult({ ...data, timestamp });
    } catch (error) {
      setResult({
        error: "Sorry, I'm having trouble connecting to the backend. Please try again.",
        timestamp,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2 text-sm text-gray-700">
          <h1 className="text-lg font-semibold">Symptom Checker</h1>
          <p>Please describe your symptoms below to receive a basic analysis.</p>
          <p className="text-xs text-red-500">
            Disclaimer: This tool does not replace professional medical advice. In case of emergency, contact local services.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
            Your Symptoms
          </label>
          <textarea
            id="symptoms"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
            placeholder="e.g., headache, nausea, fatigue..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            Analyze
          </button>
        </form>

        {/* Result Section */}
        {result && (
          <div className="text-sm text-gray-800 space-y-4 border-t pt-4">
            <h2 className="font-semibold text-gray-900">Analysis Report</h2>
            <p className="text-xs text-gray-500">Submitted at: {result.timestamp}</p>
            {result.error ? (
              <p className="text-red-600">{result.error}</p>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold">Possible Conditions</h3>
                  <ul className="list-disc ml-5">
                    {result.conditions.map((cond: string, idx: number) => (
                      <li key={idx}>{cond}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Recommendation</h3>
                  <p>{result.recommendation}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Reason</h3>
                  <p>{result.reason}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Suggested Actions</h3>
                  <ul className="list-disc ml-5">
                    {result.actions.map((act: string, idx: number) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-center text-gray-500">
          Always consult with healthcare professionals for medical advice.
        </p>
      </div>
    </div>
  );
}