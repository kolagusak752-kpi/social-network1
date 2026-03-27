import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  UploadedFile,
  BadRequestException,
  Header,
  Param,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { existsSync, createReadStream } from 'fs';

@Controller()
export class AppController {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
          console.log(extname(file.originalname));
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Неподдерживаемый формат'), false);
        }
      },
    }),
  )
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('file not found');
    }

    return {
      success: true,
      message: 'file uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: `/cdn/images/${file.filename}`,
      },
    };
  }

  @Get('images/:filename')
  @Header('Cache-Control', 'public, max-age=31536000')
  getImage(@Param('filename') filename: string): StreamableFile {
    if (
      filename.includes('..') ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      throw new BadRequestException('Недопустимое имя файла');
    }

    const filePath = join(this.uploadPath, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Изображение не найдено');
    }

    const file = createReadStream(filePath);

    const ext = extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    return new StreamableFile(file, {
      type: mimeType,
    });
  }
}
