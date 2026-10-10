const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export async function analyze(data: FormData) {
  try {
    const res = await fetch(`${BASE_URL}/api/analyze`, {
      method: "POST",
      body: data,
    });

    const json = await res.json(); 

    console.log("API RESPONSE:", json);

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Analysis failed");
    }

    return json;
  } catch (err: any) {
    console.error("API ERROR:", err);
    throw new Error(err.message || "Server connection failed");
  }
}