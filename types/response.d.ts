export type PagingObject<T> = {
  status: "success";
  code?: number;
  data: T;
  pagination: {
    previous: null | string;
    next: null | string;
    current: string;
    result_count: number;
    total_records: number;
    limit: number;
    offset: number;
  };
};

export type JsendSuccess<T> = {
  status: "success";
  data: T;
};

export type JsendWithPaging<T> = {
  pagination: {
    previous: string | null;
    next: string | null;
    current: string;
    result_count: number;
    total_records: number;
    limit: number;
    offset: number;
  };
} & JsendSuccess<T>;

export type JsendFail<T> = {
  status: "fail";
  data: T;
};

export type JsendError<T> = {
  status: "error";
  code?: number | string;
  message: T;
};
