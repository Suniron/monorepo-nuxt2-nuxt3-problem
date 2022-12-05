import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
} from 'docx'

import { reportsAPIs } from '@/api/store'
const regex = /(<p><img src="data:image\/png;base64,(?<img>.*?)"><\/p>|<p>(?<t1>.*?)<\/p>)/gm

const convertHTML = (str) => {
  let m
  const res = []
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    if (m.groups) {
      if (m.groups.img) {
        res.push({ type: 'img', value: m.groups.img })
      } else if (m.groups.t1) {
        res.push({ type: 'text', value: m.groups.t1 })
      }
    }
  }
  return res
}

const convert = (str) => {
  return str.includes('<p>')
    ? convertHTML(str)
    : str.split('\n').reduce((arr3, elt3) => {
        arr3.push({ type: 'text', value: elt3 })
        return arr3
      }, [])
}

const makeText = (obj) => {
  return obj.reduce((arr2, elt2) => {
    if (elt2.type === 'text') {
      arr2.push(
        new TextRun({
          text: elt2.value,
          break: 1,
        })
      )
    } else if (elt2.type === 'img') {
      arr2.push(
        new ImageRun({
          data: Buffer.from(elt2.value, 'base64'),
          transformation: {
            width: 100,
            height: 100,
          },
        })
      )
    }
    return arr2
  }, [])
}

export const generateService = async (accessToken) => {
  const vast = await reportsAPIs.generate(accessToken)
  if (vast.error) {
    return vast
  }
  const docx = new Document({
    /* styles: {
            paragraphStyles: [
                {
                    id: "frontPage",
                    name: "Paragraph style front page",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Source Sans Pro",
                        size: "36pt",
                        bold: true,
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER
                    }
                }
            ]
        }, */
    sections: [
      {
        children: vast.reduce((arr, elt) => {
          const details = convert(elt.affected[0].details)
          const description = convert(elt.description)
          const remediation = convert(elt.remediation)

          // const test =  detailRe.exec(elt.affected[0].details) //elt.affected[0].details.match(detailRe)
          // console.log(test.groups)
          // Vuln name
          arr.push(
            new Paragraph({
              text: elt.name,
              heading: HeadingLevel.HEADING_1,
            })
          )
          // Affected IP
          arr.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Severity : ' + elt.affected[0].severity,
                  bold: true,
                  break: 1,
                }),
                new TextRun({
                  text:
                    'CVSS : ' +
                    elt.affected[0].code +
                    '(' +
                    elt.affected[0].score +
                    ')',
                  bold: true,
                  break: 1,
                }),
                new TextRun({
                  text: 'Affected IP : ',
                  bold: true,
                  break: 1,
                }),
              ]
                .concat(
                  elt.affected.reduce((arr1, elt1) => {
                    arr1.push(
                      new TextRun({
                        text:
                          '    ' +
                          elt1.astName +
                          ' - ' +
                          (elt1.ip
                            ? elt1.ip + ' (' + elt1.port + ')'
                            : elt1.uri),
                        break: 1,
                      })
                    )
                    return arr1
                  }, [])
                )
                .concat([
                  new TextRun({
                    text: 'Description : ',
                    bold: true,
                    break: 2,
                  }),
                ])
                .concat(makeText(description))
                .concat([
                  new TextRun({
                    text: 'Remediation : ',
                    bold: true,
                    break: 2,
                  }),
                ])
                .concat(makeText(remediation))
                .concat([
                  new TextRun({
                    text: 'Evidence : ',
                    bold: true,
                    break: 2,
                  }),
                ])
                .concat(
                  details.reduce((arr2, elt2) => {
                    if (elt2.type === 'text') {
                      arr2.push(
                        new TextRun({
                          text: elt2.value,
                          break: 1,
                        })
                      )
                    } else if (elt2.type === 'img') {
                      arr2.push(
                        new ImageRun({
                          data: Buffer.from(elt2.value, 'base64'),
                          transformation: {
                            width: 100,
                            height: 100,
                          },
                        })
                      )
                    }
                    return arr2
                  }, [])
                ),
            })
          )
          return arr
        }, []),
      },
    ],
  })
  const blob = await Packer.toBuffer(docx)
  return blob
}
