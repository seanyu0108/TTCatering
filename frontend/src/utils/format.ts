export function formatFen(fen: number): string {
  return (fen / 100).toFixed(2)
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  const pad = (part: number) => String(part).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

