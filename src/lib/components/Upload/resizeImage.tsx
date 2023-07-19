// helpers/image.js
import Pica from 'pica';

export function resizeImage(
  file: HTMLCanvasElement | HTMLImageElement | File | Blob | any,
  toWidth: number = 600, // pixel
  maxSize: number = 307200 // 300kb
) {
  return new Promise<string | Blob>((resolve, reject) => {
    let reader: any = new FileReader();
    //Read the contents of Image File.
    reader.readAsDataURL(file);
    reader.onload = (ev) => {
      //Initiate the JavaScript Image object.
      let img = new Image();

      //Validate the File Height and Width.
      img.onload = () => {
        let width: number = img.width,
          height: number = img.height;
        const pica = Pica();
        const resizedCanvas: HTMLCanvasElement =
          document.createElement('canvas');
        const mimeType = file.type || 'image/jpeg';
        toWidth = width < toWidth ? width : toWidth;
        resizedCanvas.width = toWidth;
        resizedCanvas.height = Math.ceil((height * toWidth) / width);

        const options = {
          features: ['js', 'wasm', 'ww'], //cib
          quality: 3,
          alpha: false,
          unsharpAmount: 160,
          unsharpRadius: 0.6,
          unsharpThreshold: 1,
        };

        // Resize from Canvas/Image to another Canvas
        if (width > toWidth || file.size > maxSize) {
          resolve(
            pica
              .resize(img, resizedCanvas, options)
              .then((result) => pica.toBlob(result, mimeType, 0.75))
          );
        }
        resolve(file);
      };

      //Set the Base64 string return from FileReader as source.
      img.src = ev.target.result;
    };
  });
}
