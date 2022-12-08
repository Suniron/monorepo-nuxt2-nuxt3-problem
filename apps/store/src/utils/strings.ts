// @ts-check
// @ts-expect-error TS(7016): Could not find a declaration file for module 'sani... Remove this comment to see the full error message
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

// @ts-expect-error TS(7023): 'sanitizeObject' implicitly has return type 'any' ... Remove this comment to see the full error message
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
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      sanitizedObj[key] = sanitizeString(obj[key])
    } else if (typeof obj[key] === 'object') {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      sanitizedObj[key] = sanitizeObject(obj[key])
    } else {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
