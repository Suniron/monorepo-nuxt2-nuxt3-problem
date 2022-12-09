

import sanitizeHtml from 'sanitize-html'

export function sanitizeString(string: any) {
  return sanitizeHtml(string, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
    },
    allowedSchemes: [...sanitizeHtml.defaults.allowedSchemes, 'data'],
  })
}


function sanitizeObject(obj: any) {
  if (typeof obj === 'string') {
    return sanitizeString(obj)
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  } else if (typeof obj !== 'object' || !obj) {
    return obj
  }
  const sanitizedObj = {}
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') {

      sanitizedObj[key] = sanitizeString(obj[key])
    } else if (typeof obj[key] === 'object') {

      sanitizedObj[key] = sanitizeObject(obj[key])
    } else {

      sanitizedObj[key] = obj[key]
    }
  })
  return sanitizedObj
}

export function sanitizerMiddleware(req: any, res: any, next: any) {
  req.body = sanitizeObject(req.body)
  req.query = sanitizeObject(req.query)
  req.params = sanitizeObject(req.params)

  next()
}
