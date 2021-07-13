import { MutableRefObject, useEffect } from "react";

interface UseIntersectionObserverProps<T extends HTMLElement, Root extends HTMLElement> {
  root?: MutableRefObject<Root | null>;
  target: MutableRefObject<T | null> | T | null;
  onIntersect: () => void;
  threshold?: number | number[];
  rootMargin?: string;
  enabled?: boolean;
}

const isRef = <T>(obj: MutableRefObject<T | null> | T): obj is MutableRefObject<T | null> =>
  (obj as MutableRefObject<T>)?.current !== undefined;

export default function useIntersectionObserver<T extends HTMLElement, Root extends HTMLElement>({
  root,
  target,
  onIntersect,
  threshold = 0.1,
  rootMargin = "0px",
  enabled = true,
}: UseIntersectionObserverProps<T, Root>) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && onIntersect());
      },
      {
        root: root && root.current,
        rootMargin,
        threshold,
      }
    );

    const el = target && isRef(target) ? target.current : target;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [enabled, rootMargin, threshold, onIntersect, root, target]);
}
