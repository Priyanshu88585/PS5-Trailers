import { useRef, useCallback } from "react";
export function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const ref = useCallback((node: HTMLElement | null) => {
    if (!hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) callback(); },
      { threshold: 0.1, rootMargin: "200px" }
    );
    if (node) observerRef.current.observe(node);
  }, [callback, hasMore]);
  return ref;
}
export default useInfiniteScroll;
