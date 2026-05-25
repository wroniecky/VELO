"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export function ScrollDownButton() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      // Hide button when near the bottom of the page
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setIsVisible(false);
        stopScrolling();
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  const startScrolling = () => {
    if (isScrolling) {
      stopScrolling();
      return;
    }

    setIsScrolling(true);
    scrollIntervalRef.current = setInterval(() => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        stopScrolling();
        return;
      }

      window.scrollBy({
        top: 2,
        behavior: "auto",
      });
    }, 10);
  };

  const stopScrolling = () => {
    setIsScrolling(false);
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={startScrolling}
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-all duration-300 hover:scale-110 hover:opacity-90 ${
        isScrolling ? "animate-pulse ring-2 ring-foreground/50" : ""
      }`}
      aria-label={isScrolling ? "Zatrzymaj przewijanie" : "Przewiń w dół"}
    >
      <ChevronDown className={`h-6 w-6 ${isScrolling ? "animate-bounce" : ""}`} />
    </button>
  );
}
