import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SwipeableRowProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  itemMinWidthClassName?: string;
  className?: string;
};

export function SwipeableRow({
  title,
  subtitle,
  children,
  itemMinWidthClassName = "min-w-[260px] sm:min-w-[320px]",
  className,
}: SwipeableRowProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [edge, setEdge] = useState({ left: true, right: false });

  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const left = el.scrollLeft <= 2;
      const right = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      setEdge({ left, right });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (childrenArray.length === 0) return null;

  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-black tracking-tight">{title}</h2>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-muted-foreground" aria-hidden="true">
          <span className={cn("h-1.5 w-10 rounded-full transition-colors", edge.left ? "bg-muted" : "bg-secondary/40")} />
          <span className={cn("h-1.5 w-10 rounded-full transition-colors", edge.right ? "bg-muted" : "bg-secondary/40")} />
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent transition-opacity",
            edge.left ? "opacity-0" : "opacity-100",
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent transition-opacity",
            edge.right ? "opacity-0" : "opacity-100",
          )}
          aria-hidden="true"
        />

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto py-1 pr-6 -mr-6 scroll-px-4 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
          aria-label={`${title} carousel`}
        >
          {childrenArray.map((child, idx) => (
            <div key={idx} className={cn("snap-start", itemMinWidthClassName)}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

