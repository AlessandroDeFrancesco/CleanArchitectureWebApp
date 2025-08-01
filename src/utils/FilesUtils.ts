export function getFileContentAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        return reject(new Error('FileReader result is not a string'));
      }

      const base64 = result.split(',')[1];
      resolve(base64);
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error('Unknown FileReader error'));
    };

    reader.readAsDataURL(file);
  });
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
