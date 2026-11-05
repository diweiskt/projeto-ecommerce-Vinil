import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: "search" | "cart" | "menu" | "close" | "arrow";
}

export default function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {name === "search" && (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </>
      )}
      {name === "cart" && (
        <>
          <path d="M3 3h2l2.5 12h11L21 7H6" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </>
      )}
      {name === "menu" && (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </>
      )}
      {name === "close" && <path d="m6 6 12 12M18 6 6 18" />}
      {name === "arrow" && <path d="M6 18 18 6M6 6h12v12" />}
    </svg>
  );
}
