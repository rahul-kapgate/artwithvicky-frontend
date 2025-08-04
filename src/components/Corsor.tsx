import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const TRAIL_COUNT = 10;

export default function CursorTrail() {
  const [showTrail, setShowTrail] = useState(false);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const rippleContainerRef = useRef<HTMLDivElement>(null);

  // Show cursor on large screens
  useEffect(() => {
    const handleResize = () => {
      setShowTrail(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cursor trail animation
  useEffect(() => {
    if (!showTrail) return;

    const trailEls = trailRefs.current;
    if (!trailEls.length) return;

    let pos = Array.from({ length: TRAIL_COUNT }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }));

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const quickSetters = trailEls.map(dot => ({
      x: gsap.quickSetter(dot, "x", "px"),
      y: gsap.quickSetter(dot, "y", "px"),
    }));

    const animate = () => {
      pos[0].x += (mouse.x - pos[0].x) * 0.2;
      pos[0].y += (mouse.y - pos[0].y) * 0.2;

      quickSetters[0].x(pos[0].x - 4);
      quickSetters[0].y(pos[0].y - 4);

      for (let i = 1; i < TRAIL_COUNT; i++) {
        pos[i].x += (pos[i - 1].x - pos[i].x) * 0.3;
        pos[i].y += (pos[i - 1].y - pos[i].y) * 0.3;

        quickSetters[i].x(pos[i].x - 4);
        quickSetters[i].y(pos[i].y - 4);
      }

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [showTrail]);

  // 💥 Ripple burst on click
  useEffect(() => {
    if (!showTrail) return;

    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement("div");
      ripple.className =
        "pointer-events-none fixed w-4 h-4 rounded-full border-2 border-green-400 z-[9998]";

      ripple.style.left = `${e.clientX - 8}px`;
      ripple.style.top = `${e.clientY - 8}px`;

      rippleContainerRef.current?.appendChild(ripple);

      gsap.to(ripple, {
        width: 80,
        height: 80,
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
        x: -36,
        y: -36,
        onComplete: () => {
          ripple.remove();
        },
      });
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [showTrail]);

  if (!showTrail) return null;

  return (
    <>
      {/* Cursor trailing dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={el => { trailRefs.current[i] = el!; }}
          className={`pointer-events-none fixed top-0 left-0 w-2 h-2 rounded-full z-[9999] mix-blend-difference`}
          style={{
            backgroundColor: "rgb(34 197 94)", // green-600
            opacity: (1 - i / TRAIL_COUNT).toFixed(2),
          }}
        />
      ))}

      {/* Ripple burst container */}
      <div ref={rippleContainerRef}></div>
    </>
  );
}
