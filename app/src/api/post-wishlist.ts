// src/api.ts
export async function fetchPreviewApi(url: string) {
    try {
      const res = await fetch("http://localhost:4000/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
  
    
      const data = await res.json().catch(() => null);
  
      if (!res.ok) {
       
        const msg = data?.error || `HTTP ${res.status}`;
        throw new Error(msg);
      }
  
      return data;
    } catch (e: any) {
      throw new Error(e?.message || "Network error");
    }
  }
  