import { useState, useEffect, Dispatch, SetStateAction } from "react";

function getStorageValue(key: string, defaultValue: string | null) {
  const saved = localStorage.getItem(key);
  if (!saved) {
    return null;
  }

  const initial = saved;
  return initial || defaultValue;
}

export const useUpdateToken = (key: string, defaultValue: string | null): [string | null, Dispatch<SetStateAction<string | null>>] => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    if (!value) {
        return;
    }
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

export default useUpdateToken;