// Generate docx from worker thread
const workers = require('worker_threads')
const fs = require('fs')
const path = require('path')
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Footer,
  AlignmentType,
  ImageRun,
  TextWrappingType,
  TextWrappingSide,
  Table,
  TableRow,
  TableCell,
  Alignment,
  ExternalHyperlink,
  LevelFormat,
  PageNumber,
  convertInchesToTwip,
} = require('docx')
const _ = require('lodash')
const { log } = require('@/lib/logger')

const ASSET_FORMAT_MAP = {
  BUILDING: 'building',
  NETWORK: 'network',
  POLICY: 'policy',
  PROCEDURE: 'procedure',
  SERVER: 'server',
  USER: 'user',
  WEB: 'website',
}

if (workers.isMainThread) {
  // Main thread
  /**
   * @returns {Promise<Buffer>}
   */
  module.exports = function generate(scanData) {
    const scan = scanData.scan
    return new Promise((resolve) => {
      const worker = new workers.Worker(__filename, {
        workerData: { company: 'Xrator', scanData },
      })
      worker.on('message', (msg) => {
        switch (msg.type) {
          case 'report':
            resolve({
              data: { fileName: getFileName(scan) },
              file: Buffer.from(msg.data),
            })
            break
          default:
            break
        }
      })
      worker.on('error', (err) => {
        log.withError(err).error('reportGenerator > Error from worker')
      })
      worker.on('exit', (code) => {
        log.error(`reportGenerator > Worker closed with error code: ${code}`)
      })
    })
  }
}
else {
  // Worker thread

  generateReport(workers.workerData.company, workers.workerData.scanData).then(
    (buffer) => {
      workers.parentPort.postMessage({
        data: buffer,
        type: 'report',
      })
    },
  )
}

function generateReport(company, scanData) {
  const now = new Date()
  const assetsVulnerabilityGrouped = _.groupBy(
    scanData.scan_result_vulnerabilities,
    'vulnerability_id',
  )
  const doc = new Document({
    numbering: {
      config: [
        {
          levels: [
            {
              alignment: AlignmentType.START,
              format: LevelFormat.DECIMAL,
              level: 0,
              style: {
                paragraph: {
                  indent: {
                    hanging: convertInchesToTwip(0.18),
                    left: convertInchesToTwip(0.5),
                  },
                },
              },
              text: '%1.',
            },
          ],
          reference: 'default-numbered',
        },
      ],
    },
    sections: [
      {
        children: new Array(5)
          .fill(
            new Paragraph({
              children: [],
              heading: HeadingLevel.HEADING_1,
            }),
          )
          .concat([
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: fs.readFileSync(
                    path.join(__dirname, './xrator-brand-filtered.png'),
                  ),
                  floating: {
                    behindDocument: true,
                    horizontalPosition: {
                      offset: pointsToEMU(125 * 0.75), // Center image
                    },
                    verticalPosition: {
                      offset: pointsToEMU(270),
                    },
                    wrap: {
                      side: TextWrappingSide.BOTH_SIDES,
                      type: TextWrappingType.NONE,
                    },
                  },
                  transformation: {
                    height: 256 * 1.2,
                    width: 453 * 1.2,
                  },
                }),
              ],
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun('Vulnerability report for '),
                new TextRun({
                  bold: true,
                  text: company,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              heading: HeadingLevel.HEADING_2,
              text: scanData.scan.name,
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  color: '#666666',
                  text: `Scan run at ${new Date(
                    scanData.scan.cdate,
                  ).toLocaleString()}`,
                }),
              ],
              heading: HeadingLevel.HEADING_3,
            }),
          ]),
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new ImageRun({
                    data: fs.readFileSync(
                      path.join(__dirname, './xrator-icon.png'),
                    ),
                    floating: {
                      horizontalPosition: {
                        offset: pointsToEMU(25),
                      },
                      verticalPosition: {
                        offset: pointsToEMU(800),
                      },
                      wrap: {
                        side: TextWrappingSide.BOTH_SIDES,
                        type: TextWrappingType.NONE,
                      },
                    },
                    transformation: {
                      height: 25,
                      width: 25,
                    },
                  }),
                ],
                indent: {
                  left: 100,
                  right: 100,
                },
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun(`Report generated at ${now.toLocaleString()}`),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    children: [
                      'Page ',
                      PageNumber.CURRENT,
                      ' of ',
                      PageNumber.TOTAL_PAGES,
                    ],
                  }),
                ],
              }),
            ],
          }),
          first: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `Generated by Xrator at ${now.toLocaleString()}`,
                  }),
                ],
              }),
            ],
          }),
        },
        properties: {
          titlePage: 'Vulnerability report',
        },
      },
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            text: 'Executive summary',
          }),
        ],
      },
      ...Object.keys(assetsVulnerabilityGrouped).map((vulnId) => {
        return getSectionForVulnerability({
          assetsAffected: assetsVulnerabilityGrouped[vulnId],
          vulnerability: scanData.vulnerabilities.find(
            vuln => vuln.id === parseInt(vulnId),
          ),
        })
      }),
    ],
    styles: {
      paragraphStyles: [
        {
          id: HeadingLevel.HEADING_1,
          name: 'Heading 1',
          run: {
            size: 75,
          },
        },
      ],
    },
  })

  return Packer.toBuffer(doc)
}

function pointsToEMU(points) {
  // Calculation taken from https://startbigthinksmall.wordpress.com/2010/01/04/points-inches-and-emus-measuring-units-in-office-open-xml/ (linked by the docx.js documentation)
  return points * 12700
}

/**
 * Return file name as YYYYMMDD_{scan_id}_report.docx
 * @param {{
 *   scan_id: number,
 *   name: string,
 *   cdate: string,
 *   sdate: string,
 *   fdate: string,
 *   start_date: null,
 *   end_date: null,
 *   start_time: null,
 *   end_time: null,
 *   scan_type: null,
 *   status: string
 * }} scanData
 */
function getFileName(scanData) {
  const date = new Date(scanData.cdate)
  const YYYY = date.getFullYear()
  const MM = (date.getMonth() + 1).toString().padStart(2, '0')
  const DD = date.getDate().toString().padStart(2, '0')
  return `${YYYY}${MM}${DD}_${scanData.scan_id}_report.docx`
}

/**
 * Generate a section for each vulnerability
 * @param {{
 *    vulnerability: {
 *    id: number,
 *    cve: string,
 *    name: string,
 *    description: string,
 *    remediation: string,
 *    scan_id: number,
 *    vulnerability_id: number,
 *    cvss_score: null,
 *    asset_name: string,
 *    asset_type: string,
 *    ip_address: null,
 *    port_number: null,
 *    protocol: null,
 *    uri: string
 *  },
 *  assetsAffected: {
 *    scan_id: number,
 *    vulnerability_id: number,
 *    cvss_score: number?,
 *    asset_name: string,
 *    asset_type: string,
 *    ip_address: string?,
 *    port_number: number?,
 *    protocol: string?,
 *    uri: string?
 *  }
 * }} param0
 * @returns {import('docx').ISectionOptions}
 */
function getSectionForVulnerability({ vulnerability, assetsAffected }) {
  /**
   * Heading1 for the vulnerability name
   * Heading2 "Description"
   *   content is the content of the description (no styling)
   * Heading2 "Remediation"
   *   content is the content of the remediation (no styling)
   * Heading2 for the affected assets
   *   content is:
   *     - a summary of the affected assets grouped by type
   *     - list of affected asset (table with : name, type, ip, port, uri)
   */
  return {
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            bold: true,
            text: vulnerability.name,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            bold: true,
            text: 'Description',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
      }),
      ...tokenize(vulnerability.description).flatMap((token) => {
        return generateDocxForToken(token)
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            bold: true,
            text: 'Remediation',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
      }),
      ...tokenize(vulnerability.remediation).flatMap((token) => {
        return generateDocxForToken(token)
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            bold: true,
            text: 'Affected assets',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        text: 'Summary',
      }),
      new Paragraph({
        text: Object.entries(_.groupBy(assetsAffected, 'asset_type'))
          .map(([type, assetsWithType]) => {
            const formattedType
              = ASSET_FORMAT_MAP[type].toLowerCase()
              + (assetsWithType.length > 1 ? 's' : '')
            return `${assetsWithType.length} ${formattedType}`
          })
          .join(', '),
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        text: 'Details',
      }),
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                      new TextRun({
                        bold: true,
                        text: 'Name',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                      new TextRun({
                        bold: true,
                        text: 'Type',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                      new TextRun({
                        bold: true,
                        text: 'IP',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                      new TextRun({
                        bold: true,
                        text: 'Port',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                      new TextRun({
                        bold: true,
                        text: 'Protocol',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                      new TextRun({
                        bold: true,
                        text: 'URI',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          ...Object.keys(assetsAffected).map(
            assetId =>
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: Alignment.LEFT,
                        children: [
                          new TextRun({
                            text: assetsAffected[assetId].asset_name,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: Alignment.LEFT,
                        children: [
                          new TextRun({
                            text: assetsAffected[assetId].asset_type,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: Alignment.LEFT,
                        children: [
                          new TextRun({
                            text: assetsAffected[assetId].ip_address,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: Alignment.LEFT,
                        children: [
                          new TextRun({
                            text: assetsAffected[assetId].port_number,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: Alignment.LEFT,
                        children: [
                          new TextRun({
                            text: assetsAffected[assetId].protocol,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: Alignment.LEFT,
                        children: [
                          new TextRun({
                            text: assetsAffected[assetId].uri,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
          ),
        ],
      }),
    ],
  }
}

/**
 * @typedef {{
 *  tag: string,
 *  attributes: string[],
 *  children: tokenType[] | string[]
 * }} tokenType
 */

/**
 * @param {string} htmlStr
 * @param {boolean} isChild
 * @returns {tokenType[]}
 */
function tokenize(htmlStr) {
  if (htmlStr === null)
    return []

  const normalizedHtmlStr = htmlStr
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, '\'')
    .trim()
    .replace(/<\/p>\n/g, '</p>')
    .replace(/\\n/g, '\n')
    .replace(/(?<=>)\n|\n(?=<)/g, '')
    .replace(/<br>(?!<\/br>)/g, '<br></br>') // Ensuring all tags have closing pair
  const result = [
    ...normalizedHtmlStr.matchAll(
      /<(.+?)(?: (.*?))?>(.*?)<\/\1>|^(.*?)(?=<\w)|(?<=\>)([^>]*?)(?=<\w|$)/gm,
    ),
  ].filter(match => match[0].trim().length > 0)
  /**
   * 0: Matching string
   * 1: Tag name
   * 2: Tag attributes
   * 3: Text content inside the tag
   * 4: Text content between the start of the string and the opening tag
   * 5: Text content between the closing tag and the next opening or end of the string
   *
   * 3, 4 and 5 are mutually exclusive since they are in different alternative (separated by `|`)
   */
  if (result.length) {
    return result.map((res) => {
      if (res[3] !== undefined) {
        return {
          attributes: res[2]?.split(/(?<=") /) ?? [],
          children: tokenize(res[3].trim()),
          tag: res[1],
        }
      }
      return res[4] ?? res[5]
    })
  }
  return [normalizedHtmlStr]
}

/**
 *
 * @param {tokenType} token
 * @param {{
 *  parentParagraph: Paragraph|ExternalHyperlink|TextRun,
 *  parentToken: tokenType,
 *  paragraphs: Paragraph[],
 * }} param1
 * @returns
 */
function generateDocxForToken(
  token,
  { parentParagraph, parentToken, paragraphs = [] } = {},
) {
  if (typeof token === 'string') {
    if (token.trim().length === 0)
      return []

    if (parentParagraph) {
      const text = new TextRun({ text: token })
      parentParagraph.addChildElement(text)
      return [text]
    }
    else {
      const paragraph = new Paragraph({
        children: [new TextRun({ text: token })],
      })
      paragraphs.push(paragraph)
      return [paragraph]
    }
  }
  let docElement = null
  let isParagraph = true
  switch (token.tag) {
    case 'p':
      docElement = new Paragraph({})
      break
    case 'h1':
      docElement = new Paragraph({
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_1,
      })
      break
    case 'h2':
      docElement = new Paragraph({
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_2,
      })
      break
    case 'h3':
      docElement = new Paragraph({
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_3,
      })
      break
    case 'h4':
      docElement = new Paragraph({
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_4,
      })
      break
    case 'h5':
      docElement = new Paragraph({
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_5,
      })
      break
    case 'h6':
      docElement = new Paragraph({
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_6,
      })
      break
    case 'strong':
    case 'b':
      docElement = new TextRun({
        bold: true,
        text: token.children[0],
      })
      isParagraph = false
      break
    case 'em':
    case 'i':
      docElement = new TextRun({
        italics: true,
        text: token.children[0],
      })
      isParagraph = false
      break
    case 'span':
      docElement = new TextRun({
        text: token.children[0],
      })
      isParagraph = false
      break
    case 'a':
      docElement = new ExternalHyperlink({
        link: token.attributes[0].match('src="(.*?)"')[1],
      })
      isParagraph = false
      break
    case 'li':
      // TODO: fix this
      // eslint-disable-next-line no-case-declarations
      const level
        = token.attributes
          ?.map(attr => attr.match(/ql-indent-(\d)/g))
          .filter(indent => indent)[0] ?? 0
      if (parentToken.tag === 'ul') {
        docElement = new Paragraph({
          bullet: {
            level,
          },
        })
      }
      else {
        docElement = new Paragraph({
          numbering: {
            level,
            reference: 'default-numbered',
          },
        })
      }

      break
    case 'img':
      docElement = new Image({
        altText: token.children,
        url: token.attributes[0],
      })
      isParagraph = false
      break
    case undefined:
      isParagraph = false
      break
    default:
      docElement = new Paragraph({})

      // TODO: fix this
      // eslint-disable-next-line no-case-declarations
      const srcAttribute = token.attributes.find(attr =>
        attr.includes('src='),
      )
      if (srcAttribute) {
        docElement.addChildElement(
          new TextRun({
            text: srcAttribute.match(/src=(?:"|')(.*?)(?:"|')/)[1],
          }),
        )
      }
      break
  }

  if (docElement) {
    if (isParagraph) {
      paragraphs.push(docElement)

      if (Array.isArray(token.children)) {
        token.children.forEach((child) => {
          generateDocxForToken(child, {
            paragraphs,
            parentParagraph: docElement,
            parentToken: token,
          })
        })
      }
    }
    else {
      if (!parentParagraph) {
        const paragraph = new Paragraph({
          children: [docElement],
        })
        paragraphs.push(paragraph)
      }
      else {
        parentParagraph.addChildElement(docElement)
      }
    }
  }

  // TODO: implement attributs (i.e. color, font-size, etc.) and images

  return paragraphs
}
