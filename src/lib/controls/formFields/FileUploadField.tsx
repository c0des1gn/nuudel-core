import React from 'react';
import { Button, Image } from '../../components';
import { t } from '../../loc/i18n';
import { ControlMode } from 'nuudel-utils';
import UI, { DeviceId } from '../../common/UI';
import styles from './styles.module.scss';
import { HttpClient } from 'nuudel-utils';
import { resizeImage } from '../../components/Upload/resizeImage';

export interface IUploadFieldProps {
  value: any;
  disabled?: boolean;
  required?: boolean;
  controlMode: ControlMode;
  placeholder: string;
  fieldSchema: any;
  accept: string;
  valueChanged(value: any);
}

export interface IUploadFieldState {
  imgSource: any;
  file: any;
  lastUpload: string;
  uploadDisable: boolean;
}

export default class UploadField extends React.Component<
  IUploadFieldProps,
  IUploadFieldState
> {
  public constructor(props: IUploadFieldProps) {
    super(props);
    this.state = {
      imgSource: props.value,
      file: undefined,
      lastUpload: props.value && props.value.uri ? props.value.uri : '',
      uploadDisable: false,
    };
  }

  componentWillUnmount() {}

  protected _uploadDocument = async () => {
    const fileToUpload = this.state.file;
    const oldImage = this.state.lastUpload;
    if (fileToUpload != undefined || fileToUpload != null) {
      //this will add the file in root folder of the document library, if you have a folder named test, replace it as "/Documents/test"
      //Check if any file is selected or not
      if (typeof fileToUpload !== 'undefined') {
        const uploadPreset: string =
          process.env.NEXT_PUBLIC_OBJECT_STORAGE_BUCKET;
        let uploadUrl: string = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL;
        let isDirect: boolean = false;
        if (uploadUrl.indexOf('cloudinary.com') < 0) {
          uploadUrl = '/upload';
          isDirect = true;
        }
        //If file selected then create FormData
        const data = new FormData();
        const filename =
          fileToUpload.name ||
          fileToUpload.filename ||
          fileToUpload.path
            ?.split('/')
            .pop()
            .replace(/\%|\'|\,|\"|\*|\:|\<|\>|\?|\/|\\|\|/g, '');

        // fileToUpload.type, fileToUpload.size
        data.append('name', filename);
        data.append('delete', oldImage);
        data.append('file', await resizeImage(fileToUpload), filename);
        data.append('upload_preset', uploadPreset);

        //Please change file upload URL
        let res: any = undefined;
        try {
          res = await HttpClient(uploadUrl, {
            method: 'post',
            body: data,
            headers: { ...(isDirect ? await UI.headers() : {}) },
          });
        } catch (e) {}

        if (res) {
          let url: string = res.secure_url || res.url;
          let picture: any = { uri: url };
          if (res.height) {
            picture['height'] = res.height;
          }
          if (res.width) {
            picture['width'] = res.width;
          }

          this.props.valueChanged(picture);
          this.setState({
            lastUpload: url,
            imgSource: picture,
            uploadDisable: true,
            file: undefined,
          });
          return;
        }
      } else {
        //if no file selected the show alert
        console.log('Please Select File first');
      }
      this.props.valueChanged(this.props.value);
    }
  };

  private _handleChange = (e: any) => {
    let item = e.target.files[0]; //URL.createObjectURL(e.target.files[0]),
    this.setState({
      file: item,
      uploadDisable: false,
    });
  };

  protected pressRemove = (src: any = this.props.value) => {
    this.setState({
      imgSource: src,
      file: undefined,
    });
  };

  public render() {
    return (
      <div className={styles.picture}>
        <input
          className="file-input"
          name={this.props.fieldSchema.InternalName}
          onChange={this._handleChange}
          placeholder={this.props.placeholder}
          type="file"
          disabled={this.props.disabled}
          accept={this.props.accept}
          multiple={false}
          required={this.props.fieldSchema.isRequired}
        />
        {!!this.state.file && (
          <Button
            className={styles.button}
            color={'primary'}
            disabled={this.props.disabled}
            onClick={this._uploadDocument}
          >
            {t('Upload')}
          </Button>
        )}
        {!this.state.file && !!this.state.imgSource?.uri && (
          <span onClick={this.pressRemove}>
            <Image
              src={this.state.imgSource.uri}
              width={50}
              height={50}
              className={styles.image}
            />
          </span>
        )}
      </div>
    );
  }
}
