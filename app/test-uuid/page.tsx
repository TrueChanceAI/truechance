"use client";

import { useState } from "react";
import { testKindeIdConversion } from "@/lib/actions/general.action";

export default function TestUuidPage() {
  const [kindeId, setKindeId] = useState("kp_6d7982c0e6cf4b5ea88299d10fb692cb");
  const [convertedUuid, setConvertedUuid] = useState("");
  const [error, setError] = useState("");

  const handleTest = async () => {
    try {
      setError("");
      const uuid = await testKindeIdConversion(kindeId);
      setConvertedUuid(uuid);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setConvertedUuid("");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">UUID Conversion Test</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Kinde ID:
            </label>
            <input
              type="text"
              value={kindeId}
              onChange={(e) => setKindeId(e.target.value)}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg"
              placeholder="Enter Kinde ID (e.g., kp_6d7982c0e6cf4b5ea88299d10fb692cb)"
            />
          </div>
          
          <button
            onClick={handleTest}
            className="px-6 py-3 bg-gradient-to-br from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-200"
          >
            Test Conversion
          </button>
          
          {convertedUuid && (
            <div className="p-4 bg-green-900 border border-green-700 rounded-lg">
              <h3 className="text-green-300 font-medium mb-2">Converted UUID:</h3>
              <p className="text-green-100 font-mono text-sm break-all">{convertedUuid}</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
              <h3 className="text-red-300 font-medium mb-2">Error:</h3>
              <p className="text-red-100">{error}</p>
            </div>
          )}
          
          <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
            <h3 className="text-zinc-300 font-medium mb-2">Expected Format:</h3>
            <p className="text-zinc-400 text-sm">
              Kinde ID: kp_6d7982c0e6cf4b5ea88299d10fb692cb<br/>
              Expected UUID: 6d7982c0-e6cf-4b5e-a882-99d10fb692cb
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
