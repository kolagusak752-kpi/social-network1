import { useEffect, useState } from "react";

function UseDebounce(value: string, delay: number) {
  const [debounceValue, setdebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setdebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
}

export default UseDebounce