// Só aceita números inteiros positivos dentro do limite do banco
export function parseId(raw: string): number | null {
  const id = Number(raw);

  return /^\d+$/.test(raw) && id >= 1 && id <= 2147483647 ? id : null;
}
