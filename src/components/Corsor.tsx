import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    // Only enable cursor trail on non-mobile devices
    const isDesktop = window.innerWidth >= 768;
    setShowDot(isDesktop);
  }, []);

  useEffect(() => {
    if (!showDot) return;

    const dot = dotRef.current;
    if (!dot) return;

    let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let mouse = { x: pos.x, y: pos.y };

    const move = () => {
      pos.x += (mouse.x - pos.x) * 0.1;
      pos.y += (mouse.y - pos.y) * 0.1;

      gsap.set(dot, {
        x: pos.x - 8,
        y: pos.y - 8,
      });

      requestAnimationFrame(move);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(move);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [showDot]);

  if (!showDot) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed top-0 left-0 w-4 h-4 bg-green-600 rounded-full z-[9999] mix-blend-difference"
    />
  );
}
