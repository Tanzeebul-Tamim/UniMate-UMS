export const generateSearchableFields = (
  object: Record<string, unknown>,
): string[] => {
  const result: string[] = [];

  const generateSearchableFields = (
    obj: typeof object,
    parentKey?: string,
  ): void => {
    const keys: string[] = Object.keys(obj);
    keys.map((key) => {
      const value = obj[key] as string | object;
      const currentPath = parentKey ? `${parentKey}.${key}` : key;

      if (typeof value === 'string') {
        result.push(currentPath);
      } else if (typeof value === 'object') {
        generateSearchableFields(value as typeof object, currentPath as string);
      }
    });
  };

  generateSearchableFields(object);
  return result;
};
