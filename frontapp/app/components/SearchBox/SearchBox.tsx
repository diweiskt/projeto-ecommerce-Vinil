"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import styles from "./SearchBox.module.css";

export interface Suggestion {
  value: string;
  hint: string;
}

interface SearchBoxProps {
  name: string;
  placeholder: string;
  ariaLabel: string;
  suggestions: Suggestion[];
  defaultValue?: string;
  maxSuggestions?: number;
  className?: string;
  autoFocus?: boolean;
}

interface Folded {
  folded: string;
  // posição no texto "dobrado" -> posição do caractere no texto original
  map: number[];
  chars: string[];
}

// Ignora acentos e maiúsculas ("joao" encontra "João"), guardando a
// correspondência de posições para destacar o trecho no texto original.
function fold(text: string): Folded {
  const chars = Array.from(text);
  const map: number[] = [];
  let folded = "";

  chars.forEach((char, index) => {
    const piece = char
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");

    for (let i = 0; i < piece.length; i++) {
      map.push(index);
    }

    folded += piece;
  });

  return { folded, map, chars };
}

interface Match extends Suggestion {
  start: number;
  end: number;
  score: number;
}

function findMatches(
  suggestions: Suggestion[],
  term: string,
  limit: number,
): Match[] {
  const needle = fold(term.trim()).folded;

  if (!needle) {
    return [];
  }

  const matches: Match[] = [];

  for (const suggestion of suggestions) {
    const { folded, map } = fold(suggestion.value);
    const index = folded.indexOf(needle);

    // Sem resultado, ou igual ao que já foi digitado (nada a sugerir)
    if (index === -1 || folded === needle) {
      continue;
    }

    matches.push({
      ...suggestion,
      start: map[index],
      end: map[index + needle.length - 1] + 1,
      // 0: começa com o termo, 1: começa uma palavra, 2: aparece no meio
      score: index === 0 ? 0 : folded[index - 1] === " " ? 1 : 2,
    });
  }

  return matches
    .sort(
      (a, b) => a.score - b.score || a.value.localeCompare(b.value, "pt-BR"),
    )
    .slice(0, limit);
}

function Highlighted({ match }: { match: Match }) {
  const chars = Array.from(match.value);

  return (
    <span className={styles.text}>
      {chars.slice(0, match.start).join("")}
      <mark>{chars.slice(match.start, match.end).join("")}</mark>
      {chars.slice(match.end).join("")}
    </span>
  );
}

export default function SearchBox({
  name,
  placeholder,
  ariaLabel,
  suggestions,
  defaultValue = "",
  maxSuggestions = 4,
  className = "",
  autoFocus = false,
}: SearchBoxProps) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const matches = useMemo(
    () => findMatches(suggestions, value, maxSuggestions),
    [suggestions, value, maxSuggestions],
  );

  const visible = open && matches.length > 0;

  function choose(selected: string) {
    setValue(selected);
    setOpen(false);
    setActive(-1);

    const input = inputRef.current;

    if (input) {
      // O estado só atualiza na próxima renderização; o formulário
      // lê o valor direto do campo, então ajustamos antes de enviar.
      input.value = selected;
      input.form?.requestSubmit();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (matches.length === 0) {
        return;
      }

      event.preventDefault();
      setOpen(true);

      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) =>
        current === -1
          ? step === 1
            ? 0
            : matches.length - 1
          : (current + step + matches.length) % matches.length,
      );
    } else if (event.key === "Enter") {
      if (visible && active >= 0 && matches[active]) {
        event.preventDefault();
        choose(matches[active].value);
      }
    } else if (event.key === "Escape") {
      if (visible) {
        // Evita que o navegador limpe o campo de busca junto
        event.preventDefault();
      }

      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div className={`${styles.root} ${className}`}>
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        name={name}
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        autoComplete="off"
        autoFocus={autoFocus}
        role="combobox"
        aria-expanded={visible}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          visible && active >= 0 ? `${listId}-${active}` : undefined
        }
        onChange={(event) => {
          setValue(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false);
          setActive(-1);
        }}
        onKeyDown={handleKeyDown}
      />

      {visible && (
        <ul className={styles.list} id={listId} role="listbox">
          {matches.map((match, index) => (
            <li
              key={match.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              className={styles.option}
              // mouseDown (e não click) para escolher antes do campo perder o foco
              onMouseDown={(event) => {
                event.preventDefault();
                choose(match.value);
              }}
              onMouseEnter={() => setActive(index)}
            >
              <Highlighted match={match} />
              <span className={styles.hint}>{match.hint}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
