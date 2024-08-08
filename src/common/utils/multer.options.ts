import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const createFolder = (folder: string) => {
  try {
    console.log('💾 Create a root uploads folder...');

    fs.mkdirSync(path.join(__dirname, '..', `uploads`));
  } catch (error) {
    console.log('The folder already exists...');
  }

  try {
    console.log(`💾 Create a ${folder} uploads folder...`);

    fs.mkdirSync(path.join(__dirname, '..', `uploads/${folder}`));
  } catch (error) {
    console.log(`The ${folder} folder already exists...`);
  }
};

const storage = (folder: string): multer.StorageEngine => {
  createFolder(folder);

  return multer.diskStorage({
    // 어디에 저장할 지에 관한 로직
    destination(req, file, cb) {
      const folderName = path.join(__dirname, '..', `uploads/${folder}`);

      cb(null, folderName);
    },

    // 어떤 이름으로 업로드할 지에 대한 로직
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);

      const fileName = `${path.basename(
        file.originalname,
        ext,
      )}${Date.now()}${ext}`;

      cb(null, fileName);
    },
  });
};

export const multerOptions = (folder: string) => {
  const result: MulterOptions = {
    storage: storage(folder),
  };

  return result;
};
