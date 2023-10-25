"server only";

class Fetcher {
  url: string | URL | RequestInfo;
  method: string;
  body?: BodyInit | null | undefined;
  options?: RequestInit;
  constructor() {
    this.url = "";
    this.method = "GET";
    this.body = undefined;
    this.options = {};
  }

  static create() {
    return new Fetcher();
  }

  setUrl(url: string | URL | RequestInfo) {
    this.url = url;
    return this;
  }

  setMethod(method: string) {
    this.method = method;
    return this;
  }

  setBody(body?: BodyInit | null | undefined) {
    this.body = body;
    return this;
  }

  setOptions(options?: RequestInit) {
    this.options = options;
    return this;
  }

  send() {
    return fetch(this.url, {
      method: this.method,
      body: JSON.stringify(this.body ?? {}),
      ...this.options,
    });
  }
}

export const request = {
  get: (url: string | URL | RequestInfo, init?: RequestInit) =>
    Fetcher.create().setMethod("GET").setUrl(url).setOptions(init).send(),
  post: (
    url: string | URL | RequestInfo,
    body?: BodyInit | null | undefined,
    init?: RequestInit
  ) =>
    Fetcher.create()
      .setMethod("POST")
      .setUrl(url)
      .setBody(body)
      .setOptions(init)
      .send(),
  patch: (
    url: string | URL | RequestInfo,
    body?: BodyInit | null | undefined,
    init?: RequestInit
  ) =>
    Fetcher.create()
      .setMethod("PATCH")
      .setUrl(url)
      .setBody(body)
      .setOptions(init)
      .send(),
  delete: (url: string | URL | RequestInfo, init?: RequestInit) =>
    Fetcher.create().setMethod("DELETE").setUrl(url).setOptions(init).send(),
  put: (
    url: string | URL | RequestInfo,
    body?: BodyInit | null | undefined,
    init?: RequestInit
  ) =>
    Fetcher.create()
      .setMethod("PUT")
      .setUrl(url)
      .setBody(body)
      .setOptions(init)
      .send(),
};
