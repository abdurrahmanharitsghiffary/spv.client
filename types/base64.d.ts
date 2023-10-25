/**
 * Object containing a Base64 value
 */

export interface ResponseBase64Object {
  /**
   * The base64 value. It can be a string, ArrayBuffer, or null.
   */
  data: string | ArrayBuffer | null;
  /**
   * Any error from the proccess of converting Blob file to Base64URL
   */
  error: DOMException | null | string;
  /**
   * Error status of the process
   */
  isError: boolean;
  /**
   * Loading status of the process
   */
  isLoading: boolean;
  /**
   * Success status of the process
   */
  isSuccess: boolean;
  /**
   * Idle status of the process,
   * if its true the process is still not executed
   */
  isIdle: boolean;
  /**
   * Function for set the blob file
   */
  setFile: Dispatch<SetStateAction<File | null>>;
  /**
   * Function for set data
   */
  setData: Dispatch<SetStateAction<string | ArrayBuffer | null>>;
}
