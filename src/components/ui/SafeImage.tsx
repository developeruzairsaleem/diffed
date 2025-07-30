"use client";
import { useState, useEffect } from "react";

export default function SafeImage({
  src,
  alt,
  placeholder,
  className,
}: {
  src: string;
  alt?: string;
  placeholder: string;
  className?: string;
}) {
  const [validSrc, setValidSrc] = useState(placeholder);
  function checkImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // Image loaded successfully
      img.onerror = () => resolve(false); // Not a real image
      img.src = url;
    });
  }

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }
  useEffect(() => {
    const check = async () => {
      if (isValidUrl(src) && (await checkImage(src))) {
        setValidSrc(src);
      } else {
        setValidSrc(placeholder);
      }
    };
    check();
  }, [src, placeholder]);

  return (
    <img
      src={validSrc}
      className={`${className ? className : ""}`}
      alt={alt || "image"}
    />
  );
}
