export interface HashMapFilterParams {
  fieldsOfInterest: string[];
  caseSensitive?: boolean;
  minLength?: number;
}

export type HashMap = {
  [k: string]: any;
};

export const hashMapFilterFactory = ({
  minLength = 2,
  caseSensitive = false,
  fieldsOfInterest,
}: HashMapFilterParams) => (search: string) => (input: HashMap): boolean => {
  if (search.length < minLength) return true;
  return fieldsOfInterest.some((f) => {
    const toMatch = input[f];
    if (caseSensitive) {
      return toMatch.includes(search);
    } else {
      return toMatch.toLowerCase().includes(search.toLowerCase());
    }
  });
};
