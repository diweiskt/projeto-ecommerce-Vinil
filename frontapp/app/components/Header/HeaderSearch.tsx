"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeaderSearch.module.css";
import SearchBox, { type Suggestion } from "../SearchBox/SearchBox";
import { getSearchSuggestionsAction } from "../../lib/search-actions";

export default function HeaderSearch() {
  const rootRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    getSearchSuggestionsAction()
      .then((list) => {
        setSuggestions(list);
      })
      .catch(() => {
        loadedRef.current = false;
      });
  }, []);

  return (
    <div className={styles.root} ref={rootRef}>
      <form className={styles.form} action="/vinyls" role="search">
        <div className={styles.searchWrapper}>
          <SearchBox
            name="search"
            placeholder="Buscar álbum ou artista..."
            ariaLabel="Buscar por álbum ou artista"
            suggestions={suggestions}
            className={styles.search}
          />

          <button type="submit" className={styles.submit} aria-label="Buscar">
            ⌕
          </button>
        </div>
      </form>
    </div>
  );
}
