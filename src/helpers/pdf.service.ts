import { Injectable } from "@nestjs/common"
import * as fs from "fs"
import * as dotenv from "dotenv"
import * as path from "path"
import * as pdfParse from "pdf-parse"
import { PDFDocument } from "pdf-lib"

dotenv.config()

@Injectable()
export class PdfService {
  async splitByPages(file: Express.Multer.File) {
    try {
      const documentAsBytes = fs.readFileSync(file.path)
      const pdfDoc = await PDFDocument.load(documentAsBytes)
      const numPages = pdfDoc.getPageCount()

      if (numPages > 0) {
        for (let i = 0; i < numPages; i++) {
          const subDocument = await PDFDocument.create()
          const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
          subDocument.addPage(copiedPage)
          const pdfBytes = await subDocument.save()

          let cuil: number = await pdfParse(pdfBytes).then((data) =>
            this.findCuil(data.text)
          )
          let url: string = path.join(
            file.destination,
            `${file.filename.replace(".pdf", "")}-${cuil}.pdf`
          )
          fs.writeFileSync(url, pdfBytes)
        }
        fs.unlinkSync(file.path)
      } else throw new Error("Pdf file empty")
    } catch (err) {
      return err
    }
  }

  findCuil(text: string): string {
    let array = ["20-", "23-", "27-"]
    try {
      let cuil = ""
      array.forEach((element) => {
        if (text.includes(element)) cuil = text.substring(text.indexOf(element), text.indexOf(element) + 13)
      })
      if (cuil !== "") return cuil
      else return "cuil-not-found"
    } catch (err) {
      return err
    }
  }

  getSubstring(text: string, str: string) {
    return text
      .substring(text.indexOf(str), text.indexOf(str) + 13)
      .split("-")
      .join("")
  }

  async readFilenames(path: string, startWith: string) {
    try {
      return fs.readdirSync(path).map((file) => {
        file.includes(startWith)
        return file
      })
    }
    catch (err) {
      return err
    }
  }

  getCuilfromFilename(path: string, offset: number) {
    let p = path.indexOf(".pdf")
    let s = path.substring(p - offset, p)
    if (parseInt(s.split("-").join("")))
      return s
    else
      throw new Error("could not find cuil")
  }

  deleteBatch(folder: string) {
    try {
      fs.rmSync(folder, { recursive: true, force: true });
    } catch (err) {
      return err
    }
  }
}
