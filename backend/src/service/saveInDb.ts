import { DOC } from "../database/models/Pdf.model"
import { archive } from "../interfaces/interfaces"



export const savePdf =async (archive:archive) => {
    DOC.create(archive)
}