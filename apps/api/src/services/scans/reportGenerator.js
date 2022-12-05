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
  SERVER: 'server',
  WEB: 'website',
  USER: 'user',
  BUILDING: 'building',
  POLICY: 'policy',
  PROCEDURE: 'procedure',
  NETWORK: 'network',
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
        log.error('reportGenerator > Worker closed with error code: ' + code)
      })
    })
  }
} else {
  // Worker thread

  generateReport(workers.workerData.company, workers.workerData.scanData).then(
    (buffer) => {
      workers.parentPort.postMessage({
        type: 'report',
        data: buffer,
      })
    }
  )
}

function generateReport(company, scanData) {
  const now = new Date()
  const assetsVulnerabilityGrouped = _.groupBy(
    scanData.scan_result_vulnerabilities,
    'vulnerability_id'
  )
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'default-numbered',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.5),
                    hanging: convertInchesToTwip(0.18),
                  },
                },
              },
            },
          ],
        },
      ],
    },
    styles: {
      paragraphStyles: [
        {
          name: 'Heading 1',
          id: HeadingLevel.HEADING_1,
          run: {
            size: 75,
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          titlePage: 'Vulnerability report',
        },
        children: new Array(5)
          .fill(
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [],
            })
          )
          .concat([
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: fs.readFileSync(
                    path.join(__dirname, './xrator-brand-filtered.png')
                  ),
                  transformation: {
                    height: 256 * 1.2,
                    width: 453 * 1.2,
                  },
                  floating: {
                    horizontalPosition: {
                      offset: pointsToEMU(125 * 0.75), // Center image
                    },
                    verticalPosition: {
                      offset: pointsToEMU(270),
                    },
                    wrap: {
                      type: TextWrappingType.NONE,
                      side: TextWrappingSide.BOTH_SIDES,
                    },
                    behindDocument: true,
                  },
                }),
              ],
            }),
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun('Vulnerability report for '),
                new TextRun({
                  text: company,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              text: scanData.scan.name,
            }),
            new Paragraph({
              heading: HeadingLevel.HEADING_3,
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `Scan run at ${new Date(
                    scanData.scan.cdate
                  ).toLocaleString()}`,
                  color: '#666666',
                }),
              ],
            }),
          ]),
        footers: {
          first: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Generated by Xrator at ' + now.toLocaleString(),
                  }),
                ],
              }),
            ],
          }),
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                indent: {
                  left: 100,
                  right: 100,
                },
                children: [
                  new ImageRun({
                    data: fs.readFileSync(
                      path.join(__dirname, './xrator-icon.png')
                    ),
                    transformation: {
                      width: 25,
                      height: 25,
                    },
                    floating: {
                      horizontalPosition: {
                        offset: pointsToEMU(25),
                      },
                      verticalPosition: {
                        offset: pointsToEMU(800),
                      },
                      wrap: {
                        type: TextWrappingType.NONE,
                        side: TextWrappingSide.BOTH_SIDES,
                      },
                    },
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun('Report generated at ' + now.toLocaleString()),
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
        },
      },
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            text: 'Executive summary',
          }),
        ],
      },
      ...Object.keys(assetsVulnerabilityGrouped).map((vulnId) => {
        return getSectionForVulnerability({
          vulnerability: scanData.vulnerabilities.find(
            (vuln) => vuln.id === parseInt(vulnId)
          ),
          assetsAffected: assetsVulnerabilityGrouped[vulnId],
        })
      }),
    ],
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
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: vulnerability.name,
            bold: true,
          }),
        ],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: 'Description',
            bold: true,
          }),
        ],
      }),
      ...tokenize(vulnerability.description).flatMap((token) => {
        return generateDocxForToken(token)
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: 'Remediation',
            bold: true,
          }),
        ],
      }),
      ...tokenize(vulnerability.remediation).flatMap((token) => {
        return generateDocxForToken(token)
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: 'Affected assets',
            bold: true,
          }),
        ],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        text: 'Summary',
      }),
      new Paragraph({
        text: Object.entries(_.groupBy(assetsAffected, 'asset_type'))
          .map(([type, assetsWithType]) => {
            const formattedType =
              ASSET_FORMAT_MAP[type].toLowerCase() +
              (assetsWithType.length > 1 ? 's' : '')
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
                        text: 'Name',
                        bold: true,
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
                        text: 'Type',
                        bold: true,
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
                        text: 'IP',
                        bold: true,
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
                        text: 'Port',
                        bold: true,
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
                        text: 'Protocol',
                        bold: true,
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
                        text: 'URI',
                        bold: true,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          ...Object.keys(assetsAffected).map(
            (assetId) =>
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
              })
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
  if (htmlStr === null) {
    return []
  }
  const normalizedHtmlStr = htmlStr
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .trim()
    .replace(/<\/p>\n/g, '</p>')
    .replace(/\\n/g, '\n')
    .replace(/(?<=>)\n|\n(?=<)/g, '')
    .replace(/<br>(?!<\/br>)/g, '<br></br>') // Ensuring all tags have closing pair
  const result = [
    ...normalizedHtmlStr.matchAll(
      /<(.+?)(?: (.*?))?>(.*?)<\/\1>|^(.*?)(?=<\w)|(?<=\>)([^>]*?)(?=<\w|$)/gm
    ),
  ].filter((match) => match[0].trim().length > 0)
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
          tag: res[1],
          attributes: res[2]?.split(/(?<=") /) ?? [],
          children: tokenize(res[3].trim()),
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
  { parentParagraph, parentToken, paragraphs = [] } = {}
) {
  if (typeof token === 'string') {
    if (token.trim().length === 0) {
      return []
    }
    if (parentParagraph) {
      const text = new TextRun({ text: token })
      parentParagraph.addChildElement(text)
      return [text]
    } else {
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
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
      })
      break
    case 'h2':
      docElement = new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
      })
      break
    case 'h3':
      docElement = new Paragraph({
        heading: HeadingLevel.HEADING_3,
        alignment: AlignmentType.LEFT,
      })
      break
    case 'h4':
      docElement = new Paragraph({
        heading: HeadingLevel.HEADING_4,
        alignment: AlignmentType.LEFT,
      })
      break
    case 'h5':
      docElement = new Paragraph({
        heading: HeadingLevel.HEADING_5,
        alignment: AlignmentType.LEFT,
      })
      break
    case 'h6':
      docElement = new Paragraph({
        heading: HeadingLevel.HEADING_6,
        alignment: AlignmentType.LEFT,
      })
      break
    case 'strong':
    case 'b':
      docElement = new TextRun({
        text: token.children[0],
        bold: true,
      })
      isParagraph = false
      break
    case 'em':
    case 'i':
      docElement = new TextRun({
        text: token.children[0],
        italics: true,
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
      const level =
        token.attributes
          ?.map((attr) => attr.match(/ql-indent-(\d)/g))
          .filter((indent) => indent)[0] ?? 0
      if (parentToken.tag === 'ul') {
        docElement = new Paragraph({
          bullet: {
            level,
          },
        })
      } else {
        docElement = new Paragraph({
          numbering: {
            reference: 'default-numbered',
            level,
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

      const srcAttribute = token.attributes.find((attr) =>
        attr.includes('src=')
      )
      if (srcAttribute) {
        docElement.addChildElement(
          new TextRun({
            text: srcAttribute.match(/src=(?:"|')(.*?)(?:"|')/)[1],
          })
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
            parentParagraph: docElement,
            parentToken: token,
            paragraphs,
          })
        })
      }
    } else {
      if (!parentParagraph) {
        const paragraph = new Paragraph({
          children: [docElement],
        })
        paragraphs.push(paragraph)
      } else {
        parentParagraph.addChildElement(docElement)
      }
    }
  }

  // TODO: implement attributs (i.e. color, font-size, etc.) and images

  return paragraphs
}
