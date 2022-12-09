/**
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export const getBase64FromFile = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.toString())
    reader.onerror = error => reject(error)
  })

/**
 *
 * @param {string} base64 image encoded in base64
 * @returns {Promise<{width: number, height: number}>} image dimensions
 */
export const getInfosFromBase64 = (base64) => {
  const image = new Image()
  image.src = base64
  return new Promise((resolve, reject) => {
    image.onload = () => {
      const { width, height } = image
      resolve({ height, width })
    }
    image.onerror = error => reject(error)
  })
}

/**
 * Extract some infos about image like size and content
 * @param {File} imageFile
 * @returns {Promise<{base64: string|ArrayBuffer, width: number, height: number}>} image infos
 */
export const extractDataFromImage = async (imageFile) => {
  const base64 = await getBase64FromFile(imageFile)

  const { width, height } = await getInfosFromBase64(base64)

  return { base64, height, width }
}
