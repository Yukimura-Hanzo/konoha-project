"use client";

//? REACT
import React, { useEffect, useState } from "react";
//? NEXT
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const NavigationBar: React.FC = () => {

  //* Define next router
  const router = useRouter();

  //* Handle page transition animation
  const handleRouteChange = (path: string) => {
    if (!document.startViewTransition) {
      router.push(path);
      return;
    }
    document.startViewTransition(() => router.push(path));
  };


  //* State to track if menu is open (used for mobile or responsive nav toggling)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  //* State to control the size of the logo (in pixels)
  const [logoSize, setLogoSize] = useState<number>(70);

  useEffect(() => {
    //* Function to dynamically update logo size on scroll
    const handleScroll = (): void => {
      if (typeof window !== "undefined") {
      //* Only apply dynamic resizing on large screens (640px and above)
      if (window.innerWidth >= 640) {
        //* Shrink logo size smoothly as user scrolls down
        //* Minimum size is 70px, maximum is 120px at scrollY = 0
        const newSize = Math.max(70, 120 - window.scrollY / 5);
        setLogoSize(newSize);
      } else {
        //* On smaller screens, keep logo size fixed
        setLogoSize(70);
      }
      }
    };
    //* Attach scroll event listener when component mounts
    window.addEventListener("scroll", handleScroll);
    //* Cleanup: remove event listener when component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //* TS Types
  const navItems: string[] = ["Home", "Blogs", "About", "Contact"];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur bg-white/30 shadow-md transition-all duration-300">
      {/* Top Bar */}
      <div className="bg-gray-100 text-gray-700 text-sm px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">Made w/ TurboPack</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="#" className="hover:underline">
            FAQs
          </Link>
          <span className="h-4 border-l border-gray-400" />
          <Link href="#" className="hover:underline">
            <span className="flex items-center gap-1">Privacy Policy</span>
          </Link>
        </div>
      </div>
      {/* Unified Navbar */}
      <div className="flex items-center justify-between px-4 py-3 sm:py-4">
        {/* Logo */}
        <Link
          onClick={(e) => {
            e.preventDefault();
            if (!document.startViewTransition) {
              router.push("/");
            } else {
              document.startViewTransition(() => router.push("/"));
            }
          }}
          href="/" aria-label="Homepage">
          <Image
            src="/next.svg"
            alt="Company Logo"
            width={logoSize}
            height={logoSize / 3}
            priority
            className="transition-all duration-300"
          />
        </Link>
        {/* Nav Links (visible always) */}
        <nav className="hidden sm:flex gap-6 text-sm items-center">
          {navItems.map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                handleRouteChange(item === "Home" ? "/" : `/${item.toLowerCase()}`);
                setIsMenuOpen(false); // for mobile menu
              }}
              className="relative group hover:text-blue-600 transition-colors"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full origin-left" />
            </Link>
          ))}
        </nav>
        {/* Toggle (visible only on small screens) */}
        <button
          aria-label="Toggle menu"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden relative w-8 h-8 flex items-center justify-center"
        >
          <div
            className="w-6 h-[2px] bg-black absolute transition-transform duration-300"
            style={{
              transform: isMenuOpen ? "rotate(45deg)" : "translateY(-6px)",
            }}
          />
          <div
            className={`w-6 h-[2px] bg-black absolute transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <div
            className="w-6 h-[2px] bg-black absolute transition-transform duration-300"
            style={{
              transform: isMenuOpen ? "rotate(-45deg)" : "translateY(6px)",
            }}
          />
        </button>
      </div>
      {/* Mobile Nav */}
      <div
        id="mobile-menu"
        className={`sm:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 text-sm px-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="py-2 border-b hover:text-blue-600"
              onClick={(e) => {
                e.preventDefault();
                handleRouteChange(item === "Home" ? "/" : `/${item.toLowerCase()}`);
                setIsMenuOpen(false); // for mobile menu
              }}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
