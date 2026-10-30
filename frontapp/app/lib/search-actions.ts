"use server";

import { getVinyls } from "./api";
import type { Suggestion } from "../components/SearchBox/SearchBox";

// Sugestões da busca do Header: títulos de álbuns e nomes de artistas
// que existem na loja. É chamada só quando a pessoa abre a busca.
export async function getSearchSuggestionsAction(): Promise<Suggestion[]> {
  try {
    const vinyls = await getVinyls();
    const hints = new Map<string, string>();

    for (const vinyl of vinyls) {
      if (!hints.has(vinyl.title)) {
        hints.set(vinyl.title, "Álbum");
      }

      if (!hints.has(vinyl.artist)) {
        hints.set(vinyl.artist, "Artista");
      }
    }

    return [...hints].map(([value, hint]) => ({ value, hint }));
  } catch {
    return [];
  }
}
