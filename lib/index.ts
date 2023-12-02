export function removeDuplicates<T>(arrOfObj: T[]): T[] {
  const jsonObject = arrOfObj.map((obj) => JSON.stringify(obj));
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map((obj) => JSON.parse(obj));

  return uniqueArray;
}
