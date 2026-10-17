export async function loadImageAsDataUrl(url: string | null): Promise<string | null> {
  if (!url) {
    return null;
  }

  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) {
      return null;
    }

    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";

    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]!);
    }

    const base64 = btoa(binary);
    return `data:${blob.type};base64,${base64}`;
  } catch {
    return null;
  }
}
