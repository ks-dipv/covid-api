import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './services/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('api/upload')
export class UploadController {
  constructor(
    /**
     * inject uploadsService
     */
    private readonly uploadsService: UploadService,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  @ApiHeaders([{ name: 'Content-Type', description: 'multipart/form-data' }])
  @ApiOperation({
    summary: 'Upload a new file to the server',
  })
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.upload(file.originalname, file.buffer);
  }

  @Delete(':name')
  public async deleteFile(@Param('name') fileName: string) {
    return await this.uploadsService.deleteFile(fileName);
  }

  @Get(':name')
  async readFile(@Param('name') name: string) {
    return await this.uploadsService.list(name);
  }

  @Get()
  getFile() {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file, {
      type: 'application/json',
      disposition: 'attachment; filename:"package.json"',
    });
  }
}
