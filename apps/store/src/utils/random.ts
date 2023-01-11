export const generateRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const generateRandomKey = (keyLength: number) => {
  const buf = []
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const charlen = chars.length

  for (let i = 0; i < keyLength; ++i)
    buf.push(chars[generateRandomInt(0, charlen - 1)])

  return buf.join('')
}

export const generateString = (length: number) => {
  const buf = []
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const charlen = chars.length

  for (let i = 0; i < length; ++i)
    buf.push(chars[generateRandomInt(0, charlen - 1)])

  return buf.join('')
}
