import { api } from "./client";
import imageCompression from "browser-image-compression";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/webp",
};

export async function uploadImage(
  file: File,
  purpose: UploadPurpose,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const compressed = await imageCompression(file, {
    ...COMPRESSION_OPTIONS,
    maxWidthOrHeight: purpose === "avatar" ? 400 : 1920,
    onProgress: onProgress ? (p) => onProgress(Math.round(p * 0.5)) : undefined,
  });

  const { uploadUrl, key, publicUrl } = await api.post<PresignResponse>(
    "/api/uploads/presign",
    { mimeType: compressed.type, byteSize: compressed.size, purpose },
  );

  await putToR2(
    uploadUrl,
    compressed,
    onProgress ? (p) => onProgress(50 + Math.round(p * 0.5)) : undefined,
  );

  await api.post<ConfirmResponse>("/api/uploads/confirm", {
    key,
    mimeType: compressed.type,
    byteSize: compressed.size,
    purpose,
  });

  return publicUrl;
}

export type UploadPurpose = "avatar" | "post";

interface PresignResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

interface ConfirmResponse {
  image: {
    id: string;
    url: string;
    key: string;
    mimeType: string;
    byteSize: number;
    purpose: string;
  };
}

function putToR2(
  url: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable)
          onProgress(Math.round((e.loaded / e.total) * 100));
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`R2 upload failed: ${xhr.status}`));
    });

    xhr.addEventListener("error", () =>
      reject(new Error("R2 upload network error")),
    );
    xhr.send(file);
  });
}
