import { Injectable } from "@nestjs/common";

@Injectable()
export class FilesService {
    constructor() {}
    async uploadFile(file: Express.Multer.File) {
        const formData = new FormData()
        const fileToUpload = new File([file.buffer as any], file.originalname, { type: file.mimetype })
        formData.append('file',fileToUpload)
        const res = await fetch("http://localhost:8080/upload", {
            method: "POST",
            body: formData
        } )
        const data = await res.json()
        return data
    }
        async deleteFile(fileUrl: string) {
            const res = await fetch(`http://localhost:8080/images/${fileUrl}`, {
                method: "DELETE"
            })
            const data = await res.json()
            return data
        }
    }