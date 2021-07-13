import { useRef, useEffect } from "react";

export type UsePrevious = <T>(value: T) => T | undefined;

const usePrevious: UsePrevious = <T>(value: T) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
