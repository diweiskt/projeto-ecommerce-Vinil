"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "../Icon";
import styles from "./Header.module.css";

export default function MobileMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function closeOnOutside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 1101px)");
    function closeOnDesktop() {
      if (desktop.matches) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <div className={styles.mobileMenu} ref={root}>
      <button
        ref={trigger}
        type="button"
        className={styles.menuToggle}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      <nav
        id="mobile-navigation"
        aria-label="Navegação mobile"
        className={styles.mobileNav}
        hidden={!open}
        onClick={(event) => {
          if ((event.target as Element).closest("a, button")) setOpen(false);
        }}
      >
        {children}
      </nav>
    </div>
  );
}
