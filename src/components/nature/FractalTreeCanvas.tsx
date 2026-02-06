import { useEffect, useRef } from "react";

export const FractalTreeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Logical coordinate system (fixed, normalized units) to avoid stretching
    const logical = { w: 1000, h: 1000 };
    const mouse = { x: logical.w / 2, y: logical.h };
    let currentDepth = 0;
    const maxDepth = 8;

    // These will be computed on resize: scale maps logical units -> CSS pixels
    let scale = 1;
    let offsetX = 0; // CSS pixels
    let offsetY = 0; // CSS pixels (anchor at bottom)
    let cssWidth = 0;
    let cssHeight = 0;

    const resizeCanvas = () => {
      // Use CSS size for layout (canvas styled to fill container). Then set backing store for DPR.
      const rect = canvas.getBoundingClientRect();
      cssWidth = Math.max(1, rect.width || window.innerWidth);
      cssHeight = Math.max(1, rect.height || window.innerHeight);

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);

      // Make 1 unit in ctx equal to 1 CSS pixel
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Compute uniform scale to map logical space into available CSS area while preserving aspect
      scale = Math.min(cssWidth / logical.w, cssHeight / logical.h);
      // center horizontally, anchor to bottom vertically
      offsetX = (cssWidth - logical.w * scale) / 2;
      offsetY = cssHeight - logical.h * scale;
    };

    const drawBranch = (
      x: number,
      y: number,
      angle: number,
      length: number,
      depth: number
    ) => {
      if (depth > currentDepth) return;

      // drawing happens in logical coordinate space
      ctx.beginPath();
      ctx.moveTo(x, y);

      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;

      ctx.lineTo(endX, endY);

      const opacity = 1 - depth / maxDepth;
      ctx.strokeStyle = `rgba(52, 211, 153, ${opacity * 0.7})`;
      ctx.lineWidth = Math.max(0.5, 3 - (depth / maxDepth) * 2) / scale; // keep visual thickness consistent after scaling
      ctx.stroke();

      const distToMouse = Math.hypot(endX - mouse.x, endY - mouse.y);
      // mouse effect uses logical units so it's independent of viewport size
      const mouseEffect = Math.max(0, 1 - distToMouse / (logical.h / 2));
      const angleOffset = (Math.PI / 12) * mouseEffect;

      drawBranch(
        endX,
        endY,
        angle - Math.PI / 8 - angleOffset,
        length * 0.75,
        depth + 1
      );
      drawBranch(
        endX,
        endY,
        angle + Math.PI / 8 + angleOffset,
        length * 0.75,
        depth + 1
      );
    };

    const animate = () => {
      // fill using CSS pixel sizes (ctx transformed to CSS pixels)
      ctx.fillStyle = "rgba(6, 78, 59, 0.08)";
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // save state and transform into logical coordinate space
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      const startX = logical.w / 2;
      const startY = logical.h;
      const startLength = logical.h * 0.25; // logical length independent of viewport

      drawBranch(startX, startY, -Math.PI / 2, startLength, 0);

      if (currentDepth < maxDepth) {
        currentDepth += 0.025;
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = event.clientX - rect.left; // CSS pixels
      const my = event.clientY - rect.top; // CSS pixels

      // Convert from CSS pixel space into logical coordinate space used for drawing
      mouse.x = (mx - offsetX) / scale;
      mouse.y = (my - offsetY) / scale;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    // initial setup
    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none"
      style={{ background: "linear-gradient(to bottom, #064e3b, #022c22)" }}
    />
  );
};
