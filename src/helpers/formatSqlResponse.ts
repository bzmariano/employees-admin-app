export const formatSqlResponse = (str: string): string => {
  return str
    .split("\n")
    .join("")
    .split('"')
    .join("")
    .split("{")
    .join("")
    .split("}")
    .join("")
    .split("  ")
    .join("")
}
