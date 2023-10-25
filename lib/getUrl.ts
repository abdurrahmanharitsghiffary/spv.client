type GetUrlOptions = {
  base?: string;
  query?: { name: string; value: string }[];
  path: string;
};

export const getUrl = ({ base, query, path }: GetUrlOptions) => {
  const url = new URL(path, base);

  if (query && query.length > 0) {
    query.forEach(({ name, value }) => {
      if ([undefined, null, ""].some((v) => value === v)) return;
      url.searchParams.set(name, value);
    });
  }

  return url.href;
};
