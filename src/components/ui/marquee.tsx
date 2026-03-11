"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

type MarqueeProps = ComponentPropsWithoutRef<"div"> & {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: ReactNode;
  vertical?: boolean;
  repeat?: number;
};

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <>
      <div
        {...props}
        className={cx(
          "group flex overflow-hidden p-1 [--duration:40s] [--gap:1rem]",
          vertical ? "flex-col gap-[var(--gap)]" : "flex-row gap-[var(--gap)]",
          className,
        )}
      >
        {Array.from({ length: repeat }).map((_, index) => (
          <div
            key={index}
            className={cx(
              "flex shrink-0 justify-around gap-[var(--gap)]",
              vertical
                ? "animate-[marquee-vertical_var(--duration)_linear_infinite] flex-col"
                : "animate-[marquee_var(--duration)_linear_infinite] flex-row",
              reverse && "[animation-direction:reverse]",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
            )}
          >
            {children}
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% - var(--gap)));
          }
        }
        @keyframes marquee-vertical {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(calc(-100% - var(--gap)));
          }
        }
      `}</style>
    </>
  );
}
