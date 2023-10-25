import { ResponseBase64Object } from "@/types/base64";
import { useEffect, useState } from "react";

export const useGetFile: () => ResponseBase64Object = () => {
  const [data, setData] = useState<string | ArrayBuffer | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isIdle, setIsIdle] = useState<boolean>(true);
  const [error, setError] = useState<DOMException | null | string>(null);
  const [file, setFile] = useState<File | null>(null);

  const reset = () => {
    setIsError(false);
    setIsSuccess(false);
    setError(null);
    setData(null);
    setIsIdle(false);
  };

  useEffect(() => {
    const fileReader = new FileReader();
    const GetBase64: () => Promise<
      string | ArrayBuffer | null | DOMException
    > = () =>
      new Promise((resolve, reject) => {
        if (file && file instanceof Blob) {
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };

          fileReader.onerror = () => {
            reject(fileReader.error);
          };
        } else {
          reject("Type file is not blob");
        }
      });

    const GetBase64URL = async () => {
      reset();
      setIsLoading(true);
      try {
        const response = await GetBase64();

        if (!(response instanceof DOMException)) {
          setIsSuccess(true);
          setData(response);
        }
      } catch (err) {
        setIsError(true);
        setError(err as DOMException | string);
      } finally {
        setIsLoading(false);
        setIsIdle(true);
      }
    };

    if (file) {
      GetBase64URL();
    }

    return () => fileReader.abort();
  }, [file]);

  return {
    data,
    isError,
    error,
    setData,
    isLoading,
    isSuccess,
    isIdle,
    setFile,
  };
};

export const useGetMultipleBase64 = () => {
  const [data, setData] = useState<(string | ArrayBuffer | null)[] | null>(
    null
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isIdle, setIsIdle] = useState<boolean>(true);
  const [error, setError] = useState<DOMException | null | string>(null);
  const [files, setFile] = useState<FileList | null>(null);

  useEffect(() => {
    if (files && (files ?? [])?.length > 0 && files instanceof FileList) {
      getBase64s(files).then((res) => {
        setData(res);
      });
    }
  }, [files]);

  const getBase64: (
    file: File
  ) => Promise<string | ArrayBuffer | null> = async (file: File) =>
    new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });

  const getBase64s: (
    files: FileList
  ) => Promise<(string | ArrayBuffer | null)[]> = async (files) => {
    return await Promise.all(
      Array.from(files).map(async (file) => {
        const fileString = await getBase64(file);
        return fileString;
      })
    );
  };

  return { setFile, data };
};
