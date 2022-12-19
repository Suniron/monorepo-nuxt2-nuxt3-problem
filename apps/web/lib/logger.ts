export const logDebug = (msg: string) => {
  if (process.env.NODE_ENV !== 'development')
    return

  // eslint-disable-next-line no-console
  console.log(msg)
}
