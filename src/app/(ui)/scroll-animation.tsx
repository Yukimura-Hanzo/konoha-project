"use client";

//? REACT
import React, { useEffect, useRef } from "react";
import type { ReactNode } from "react";

//? TS Interface
interface RevealOnScrollProps {
  children: ReactNode; //* The content to wrap and animate
  className?: string;  //* Optional additional CSS classes
}

export default function ScrollAnimation({
  children,
  className,
}: RevealOnScrollProps) {
  //? Create a ref to attach to the wrapping div element
  //* It will be used to observe visibility on screen
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    //* Safety check: exit if ref is not attached
    if (!element) return;
    //* Create a new IntersectionObserver instance
    //* It calls the callback when the observed element crosses the visibility threshold
    const observer = new IntersectionObserver(
      (entries) => {
        //* For each observed entry (usually one in this case)
        entries.forEach((entry) => {
          //* Check if the element is currently intersecting (visible in viewport)
          if (entry.isIntersecting) {
            //* Add the "show" CSS class to trigger animation
            entry.target.classList.add("show");
            //* Stop observing after first reveal to prevent repeated triggers
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, //* Trigger callback when 10% of element is visible
      }
    );
    //* Start observing the element referenced by ref
    observer.observe(element);
    //* Cleanup: disconnect observer on component unmount to prevent memory leaks
    return () => observer.disconnect();
  }, []); //* Empty dependency array means this runs once on mount

  //* Render a div wrapper with the ref and combined CSS classes
  //* Initial styles for animation come from "reveal-on-scroll" class
  //* Additional classes can be passed via props
  return (
    <div ref={ref} className={`reveal-on-scroll ${className ?? ""}`}>
      {children}
    </div>
  );
}
