import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  get,
  HttpErrors,
  oas,
  param,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import {promisify} from 'util';
import {GeneralConfig} from '../config/general.config';
import {SecurityConfig} from '../config/security.config';
const readdir = promisify(fs.readdir);

export class FileManagerController {
  constructor() {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuFileManagerId, SecurityConfig.createAction],
  })
  @post('/upload-property-file', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'File to upload',
      },
    },
  })
  async UploadPropertyFile(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const filePath = path.join(__dirname, GeneralConfig.propertiesFilesFolder);
    console.log(filePath);
    const res = await this.storeFileToPath(
      filePath,
      GeneralConfig.propertyField,
      request,
      response,
      GeneralConfig.imagesExtensions,
    );
    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        return {file: filename};
      }
    }
    return res;
  }

  @post('/upload-contract-file', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'File to upload',
      },
    },
  })
  async UploadContarctFile(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const filePath = path.join(__dirname, GeneralConfig.contractsFilesFolder);
    console.log(filePath);

    const res = await this.storeFileToPath(
      filePath,
      GeneralConfig.propertyField,
      request,
      response,
      GeneralConfig.documentsExtensions,
    );
    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        return {file: filename};
        // return {route: `files/contracts/${filename}`};
      }
    }
    return res;
  }

  /**
   * Return a config for multer storage
   * @param Path
   *
   */

  // eslint-disable-next-line @typescript-eslint/no-shadow
  private getMulterStorageConfig(path: string) {
    let filename = '';
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path);
      },
      filename: function (res, file, cb) {
        filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    });
    return storage;
  }

  /**
   *
   * @param storePath
   * @param fieldname
   * @param request
   * @param response
   * @param acceptedExt
   * @returns
   */

  private storeFileToPath(
    storePath: string,
    fieldname: string,
    request: Request,
    response: Response,
    acceptedExt: string[],
  ): Promise<object> {
    //console.log(storage);

    return new Promise<Object>((resolve, reject) => {
      const storage = this.getMulterStorageConfig(storePath);
      //console.log(storage);
      const upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
          const ext = path.extname(file.originalname).toUpperCase();
          console.log(ext);
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(
            new HttpErrors[400]('This format file is not supported'),
          );
        },
        limits: {},
      }).single(fieldname);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  /** File Download */

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuFileManagerId, SecurityConfig.downloadAction],
  })
  @get('/files/{type}', {
    responses: {
      200: {
        content: {
          //string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  async getListOfFiles(@param.path.number('type') type: number) {
    const folderPath = this.getFilesByType(type);
    const files = await readdir(folderPath);
    return files;
  }

  @get('/GetFiles/{type}/{name}')
  @oas.response.file()
  async downloadFileByName(
    @param.path.number('type') type: number,
    @param.path.string('name') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const folder = this.getFilesByType(type);
    const file = this.validateFileName(folder, fileName);
    response.download(file, fileName);
    return response;
  }

  /**
   * Get the folder when files are uploaded by type
   * @param type
   */

  private getFilesByType(type: number) {
    let filePath = '';
    switch (type) {
      //amusement
      case 1:
        filePath = path.join(__dirname, GeneralConfig.propertiesFilesFolder);
        break;
      case 2:
        filePath = path.join(__dirname, GeneralConfig.contractsFilesFolder);
        break;
    }
    return filePath;
  }

  /**
   * Validates file names to provent them goes beyond the designates directory
   * @param fileName = File name
   */

  private validateFileName(folder: string, fileName: string) {
    const resolved = path.resolve(folder, fileName);
    if (resolved.startsWith(folder)) return resolved;
    throw new HttpErrors[400](`Invalid file name: ${fileName}`);
  }
}
