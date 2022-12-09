import {
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  TextRun,
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
      if (m.groups.img)
        res.push({ type: 'img', value: m.groups.img })
      else if (m.groups.t1)
        res.push({ type: 'text', value: m.groups.t1 })
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
          break: 1,
          text: elt2.value,
        }),
      )
    }
    else if (elt2.type === 'img') {
      arr2.push(
        new ImageRun({
          data: Buffer.from(elt2.value, 'base64'),
          transformation: {
            height: 100,
            width: 100,
          },
        }),
      )
    }
    return arr2
  }, [])
}

export const generateService = async (accessToken) => {
  const vast = await reportsAPIs.generate(accessToken)
  if (vast.error)
    return vast

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
              heading: HeadingLevel.HEADING_1,
              text: elt.name,
            }),
          )
          // Affected IP
          arr.push(
            new Paragraph({
              children: [
                new TextRun({
                  bold: true,
                  break: 1,
                  text: `Severity : ${elt.affected[0].severity}`,
                }),
                new TextRun({
                  bold: true,
                  break: 1,
                  text:
                    `CVSS : ${
                    elt.affected[0].code
                    }(${
                    elt.affected[0].score
                    })`,
                }),
                new TextRun({
                  bold: true,
                  break: 1,
                  text: 'Affected IP : ',
                }),
              ]
                .concat(
                  elt.affected.reduce((arr1, elt1) => {
                    arr1.push(
                      new TextRun({
                        break: 1,
                        text:
                          `    ${
                          elt1.astName
                          } - ${
                          elt1.ip
                            ? `${elt1.ip} (${elt1.port})`
                            : elt1.uri}`,
                      }),
                    )
                    return arr1
                  }, []),
                )
                .concat([
                  new TextRun({
                    bold: true,
                    break: 2,
                    text: 'Description : ',
                  }),
                ])
                .concat(makeText(description))
                .concat([
                  new TextRun({
                    bold: true,
                    break: 2,
                    text: 'Remediation : ',
                  }),
                ])
                .concat(makeText(remediation))
                .concat([
                  new TextRun({
                    bold: true,
                    break: 2,
                    text: 'Evidence : ',
                  }),
                ])
                .concat(
                  details.reduce((arr2, elt2) => {
                    if (elt2.type === 'text') {
                      arr2.push(
                        new TextRun({
                          break: 1,
                          text: elt2.value,
                        }),
                      )
                    }
                    else if (elt2.type === 'img') {
                      arr2.push(
                        new ImageRun({
                          data: Buffer.from(elt2.value, 'base64'),
                          transformation: {
                            height: 100,
                            width: 100,
                          },
                        }),
                      )
                    }
                    return arr2
                  }, []),
                ),
            }),
          )
          return arr
        }, []),
      },
    ],
  })
  const blob = await Packer.toBuffer(docx)
  return blob
}
