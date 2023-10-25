export const getFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof Array)
      return value.forEach((val) => {
        formData.append(key, val);
      });
    if (value) return formData.append(key, value);
  });
  return formData;
};
