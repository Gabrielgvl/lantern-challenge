import { useEffect } from "react";
import { useCountUp, useCountUpProps } from "react-countup";
import usePrevious from "./usePrevious";

export type UseContUpPrevious = (
  value: number,
  options: Omit<useCountUpProps, "start" | "end">
) => {
  countUp: React.ReactText;
  start: () => void;
  pauseResume: () => void;
  reset: () => void;
  update: (newEnd?: number) => void;
};

const useContUpPrevious: UseContUpPrevious = (value, options) => {
  const previousValue = usePrevious(value);

  const { update, ...other } = useCountUp({
    start: previousValue ?? 0,
    end: value,
    ...options,
  });

  useEffect(() => {
    update(value);
  }, [update, value]);

  return { update, ...other };
};

export default useContUpPrevious;
