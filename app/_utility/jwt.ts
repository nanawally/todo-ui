export function decodeJwt(token: string) {
  const [, payload] = token.split(".")

  // Base64URL decode
  const decoded = Buffer.from(
    payload.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString("utf8")

  return JSON.parse(decoded)
}