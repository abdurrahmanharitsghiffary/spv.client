export const removeDuplicates = <T extends object>(
  arr: T[],
  key: keyof T
): T[] => {
  const set = new Set();
  const newArr: T[] = [];

  arr.forEach((v) => {
    const isDuplicated = set.has(v[key]);
    set.add(v[key]);
    if (isDuplicated) return null;
    newArr.push(v);
  });

  return newArr;
};
