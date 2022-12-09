

const BASE64_PREFIX = 'data:image/'
const BASE64_PNG_PREFIX = 'data:image/png;base64,'
const BASE64_JPEG_PREFIX = 'data:image/jpeg;base64,'

const BASE64_IMAGE_VALIDATION_REGEX = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

/**
 * Return Buffer from base64 string, ready to be saved in the database (for example).
 * @param {string} base64Image
 * @returns {Buffer}
 */
export const convertBase64ImageToBuffer = (base64Image: any) => Buffer.from(
  base64Image.replace(BASE64_PNG_PREFIX, '').replace(BASE64_JPEG_PREFIX, ''),
  'base64'
)

/**
 * Return base64 image from buffer, ready to put in HTML img tag (for example).
 * @param {Buffer} buffer
 * @returns {string}
 */
export const convertBufferToBase64Image = (buffer: any) => {
  const base64Image = buffer.toString('base64')

  if (base64Image.startsWith(BASE64_PREFIX)) {
    return base64Image
  }

  switch (getImageMimeType(base64Image)) {
    case 'jpeg':
      return BASE64_JPEG_PREFIX + base64Image
    case 'png':
      return BASE64_PNG_PREFIX + base64Image

    default:
      return BASE64_PNG_PREFIX + base64Image
  }
}

/**
 * Return **true** if image in base64 is valid, **false** otherwise.
 * @param {string} base64Image
 * @returns {boolean}
 */
export const isValidBase64Image = (base64Image: any) => {
  return BASE64_IMAGE_VALIDATION_REGEX.test(
    base64Image.replace(BASE64_PNG_PREFIX, '').replace(BASE64_JPEG_PREFIX, '')
  )
}

/**
 * @typedef {'jpeg' | 'png' | 'gif' | 'bmp' | 'tiff'} SupportedImageMimeType
 */

/**
 * @param {string} base64Image
 * @returns {SupportedImageMimeType}
 */
function getImageMimeType(base64Image: any) {
  /**
   * @type {{[key in SupportedImageMimeType]: string[]}}
   */
  const imageMimeTypes = {
    jpeg: ['FFD8'],
    png: ['89504E470D0A1A0A'],
    gif: ['474946'],
    bmp: ['424D'],
    tiff: ['4949', '4D4D'],
  }

  const hex = getImageAsHex(base64Image)

  for (const mimeType in imageMimeTypes) {

    const fileHeaders = imageMimeTypes[mimeType]
    const doesTypeMatch = fileHeaders.find((header: any) => {
      return hex.toLowerCase().startsWith(header.toLowerCase())
    })
    if (doesTypeMatch) {
      return mimeType
    }
  }
}

/**
 * @param {string} base64Image
 * @returns {string}
 */
function getImageAsHex(base64Image: any) {
  return Buffer.from(base64Image, 'base64').toString('hex')
}
