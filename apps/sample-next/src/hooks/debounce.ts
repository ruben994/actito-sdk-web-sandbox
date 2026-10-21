import { useEffect, useMemo, useRef } from "react";

export const useDebounce = (callback: DebounceCallback) => {
  const callbackRef = useRef<DebounceCallback>(undefined);
  const timerRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(() => {
    return () => {
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        callbackRef.current?.();
      }, 500);
    };
  }, []);
};

type DebounceCallback = () => void;
