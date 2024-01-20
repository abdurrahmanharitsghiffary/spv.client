export const parseLimitOffset = (url: string) => {
  const newUrl = new URL(url);

  const limit = Number(newUrl.searchParams.get("limit"));
  const offset = Number(newUrl.searchParams.get("offset"));

  return { limit, offset };
};
