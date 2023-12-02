export type ApiResponseT<T> = {
  success: boolean;
  message?: string;
  statusCode: number;
  data: T;
  errors?: any[] | undefined;
  name?: string;
};

export type ApiPagingObjectResponse<T> = {
  pagination: {
    previous: null | string;
    next: null | string;
    current: string;
    result_count: number;
    total_records: number;
    limit: number;
    offset: number;
  };
} & ApiResponseT<T>;

// export type PagingObject<T> = {
//   status: "success";
//   code?: number;
//   data: T;
//   pagination: {
//     previous: null | string;
//     next: null | string;
//     current: string;
//     result_count: number;
//     total_records: number;
//     limit: number;
//     offset: number;
//   };
// };

// export type ApiResponseT<T> = {
//   status: "success";
//   data: T;
// };

// export type ApiPagingObjectResponse<T> = {
//   pagination: {
//     previous: string | null;
//     next: string | null;
//     current: string;
//     result_count: number;
//     total_records: number;
//     limit: number;
//     offset: number;
//   };
// } & ApiResponseT<T>;
