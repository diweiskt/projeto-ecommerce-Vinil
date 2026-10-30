"use client";

import Link from "next/link";

export default function GenresLink() {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const section = document.getElementById("genres");

    // Se já estiver na página inicial, força a rolagem.
    if (window.location.pathname === "/" && section) {
      event.preventDefault();

      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (window.location.hash !== "#genres") {
        window.history.replaceState(null, "", "/#genres");
      }
    }
  }

  return (
    <Link href="/#genres" onClick={handleClick}>
      Gêneros
    </Link>
  );
}
