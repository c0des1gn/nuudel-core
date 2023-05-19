import axios from 'axios';
import UI from '../../common/UI';
//import { resizeImage } from '../../components/Upload/resizeImage';

export class uploadAdapter {
  protected loader: any = undefined;
  protected _controller: any = undefined;
  constructor(props) {
    // CKEditor 5's FileLoader instance.
    this.loader = props;
    this._controller = new AbortController();
  }

  // Starts the upload process.
  upload() {
    const uploadPreset: string =
      process?.env?.NEXT_PUBLIC_OBJECT_STORAGE_BUCKET;
    let uploadUrl: string = process?.env?.NEXT_PUBLIC_IMAGE_UPLOAD_URL;
    let isDirect: boolean = false;
    if (uploadUrl?.indexOf('cloudinary.com') < 0) {
      uploadUrl = '/upload';
      isDirect = true;
    }
    return new Promise((resolve, reject) => {
      this.loader.file.then(async (file) => {
        const data = new FormData();
        const loader = this.loader;

        const filename = file.name || (file.path && file.path.split('/').pop());
        if (filename) {
          data.append('name', filename);
        }
        data.append('file', file, filename);
        data.append('upload_preset', uploadPreset);

        let r: any = undefined;
        try {
          r = await axios({
            url: uploadUrl,
            method: 'post',
            data: data,
            headers: { ...(isDirect ? await UI.headers() : {}) },
            signal: this._controller.signal,
            onUploadProgress: (ProgressEvent) => {
              loader.uploadTotal = ProgressEvent.total;
              loader.uploaded = ProgressEvent.loaded;
            },
          });
        } catch {
          reject("Couldn't upload file:" + ` ${filename}.`);
        }

        if (r && r.data) {
          let res: any = r.data;
          const url = res.secure_url || res.url;
          // If the upload is successful, resolve the upload promise with an object containing
          // at least the "default" URL, pointing to the image on the server.
          resolve({
            default: url,
          });
        } else {
          reject();
        }
      });
    });
  }

  // Aborts the upload process.
  abort() {
    if (this._controller) {
      this._controller.abort();
    }
  }
}
