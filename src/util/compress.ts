import imageCompression from "browser-image-compression";

export type compressImageType = {
  maxSizeMB: number;
  maxWidthOrHeight?: number;
  useWebWorker: boolean;
  initialQuality: number;
};

// optionsは必要に応じて調整する
// https://github.com/Donaldcwl/browser-image-compression#api
export const compressImage =  async (
  file: File,
  options: compressImageType = {
    maxSizeMB: 0.05,
    useWebWorker: true,
    initialQuality: 0.75,
    maxWidthOrHeight: 250,
  }
): Promise<File> => {
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (err) {
    return Promise.reject(new Error(`compress failed: ${err}`));
  }
};

