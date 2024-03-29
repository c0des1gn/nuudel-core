import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import { useDropzone, DropzoneOptions, Accept } from 'react-dropzone';
import { t } from '../../loc/i18n';
import axios from 'axios';
import UI from '../../common/UI';
import { resizeImage } from './resizeImage';
import { Sortable } from '../Sortable';
import { arraysEqual } from '../../common/helper';

interface IUploadProps {
  id?: string;
  disabled?: boolean;
  mini?: boolean;
  accept?: Accept;
  multiple?: boolean;
  label?: string;
  uploaded?: any;
  minSize?: number;
  maxSize?: number;
  maxFiles?: number;
  removable?: boolean;
  onChange?(val: any);
  onRemove?(Id?: string | number);
  toWidth?: number;
  width?: number;
}

const Upload: React.FC<IUploadProps> = ({
  uploaded = [],
  label = '',
  multiple = true,
  disabled = false,
  minSize = undefined,
  maxSize = 10048576,
  maxFiles = 20,
  width = 100,
  mini = false,
  removable = true,
  accept = {
    'image/*': [],
  },
  ...props
}) => {
  interface ImageProperties {
    uri: string;
    height?: number;
    width?: number;
  }
  const [totalFilesToUpload, setTotalFilesToUpload] = React.useState(0);
  const [totalFilesUploaded, setTotalFilesUploaded] = useState<
    ImageProperties[]
  >([]);
  const [alreadyUploadedImages, setAlreadyUploadedImages] = useState<
    ImageProperties[]
  >(uploaded instanceof Array ? uploaded : !uploaded ? [] : [uploaded]);
  //////////////////////////////////////////////
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    disabled,
    minSize,
    maxSize,
    maxFiles,
    accept: accept,
    onDrop: (acceptedFiles) => {
      setTotalFilesUploaded([]);
      setTotalFilesToUpload(0);

      let arr: any = [];
      acceptedFiles.forEach((file, j) => {
        arr.push({
          name: file.name,
          preview: URL.createObjectURL(file),
        });
      });
      setFiles(arr);

      let values: any[] = [];

      const uploadPreset: string =
        process?.env?.NEXT_PUBLIC_OBJECT_STORAGE_BUCKET;
      let uploadUrl: string = process?.env?.NEXT_PUBLIC_IMAGE_UPLOAD_URL;
      let isDirect: boolean = false;
      if (uploadUrl?.indexOf('cloudinary.com') < 0) {
        uploadUrl = '/upload';
        isDirect = true;
      }

      acceptedFiles.map(async (file: File | any, index: number) => {
        const data = new FormData();
        const filename = file.name || (file.path && file.path.split('/').pop());
        if (filename) {
          data.append('name', filename);
        }
        try {
          data.append('file', await resizeImage(file, props.toWidth), filename);
        } catch {
          data.append('file', file, filename);
        }
        data.append('upload_preset', uploadPreset);

        const r = await axios({
          url: uploadUrl, //'/c_crop,g_north,h_600,w_600'
          method: 'post',
          data: data,
          headers: {
            toWidth: props.toWidth,
            ...(isDirect ? await UI.headers() : {}),
          },
        });
        if (r?.data) {
          let res: any = r.data;
          const url = res.secure_url || res.url || res.uri || res.data?.uri;
          let picture: any = { uri: url || '' };
          if (res.height) {
            picture['height'] = res.height;
          }
          if (res.width) {
            picture['width'] = res.width;
          }

          const length = values.push(picture);
          setTotalFilesUploaded(values);
          setTotalFilesToUpload(length);

          let newImages: any[];
          if (multiple) {
            newImages = [...alreadyUploadedImages, picture];
            setAlreadyUploadedImages(newImages);
          } else {
            setAlreadyUploadedImages([picture]);
          }
          if (props.onChange) {
            props.onChange(!multiple ? picture : newImages);
          }
        }
      });
    },
  } as DropzoneOptions);

  interface UploadFile {
    name: string;
    preview: string;
  }

  const removeExistingImage = async (
    index: number,
    allImages: ImageProperties[]
  ) => {
    if (!allImages[index] || !allImages[index].uri) {
      return;
    }
    let allImagesData = allImages.map((it) => ({ ...it }));
    let uploadUrl: string = process?.env?.NEXT_PUBLIC_IMAGE_UPLOAD_URL || '';
    if (uploadUrl?.indexOf('cloudinary.com') < 0 && removable) {
      const data = {
        delete: allImagesData[index].uri,
        upload_preset: process?.env?.NEXT_PUBLIC_OBJECT_STORAGE_BUCKET,
      };
      const r = await axios({
        url: '/remove',
        method: 'post',
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          ...(await UI.headers()),
        },
      });
    }
    allImagesData.splice(index, 1);
    setAlreadyUploadedImages(allImagesData);
    if (props.onChange) {
      props.onChange(!multiple ? null : allImagesData);
    }
  };

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      let upd =
        uploaded instanceof Array ? uploaded : !uploaded ? [] : [uploaded];
      if (!arraysEqual(alreadyUploadedImages, upd)) {
        setAlreadyUploadedImages(upd);
      }
    }
    if (!didMountRef.current) {
      didMountRef.current = true;
    }
  }, [uploaded]);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file: UploadFile) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const FileUploading = () => {
    if (totalFilesToUpload === 0) {
      return <span></span>;
    } else if (totalFilesToUpload > 0) {
      if (totalFilesUploaded.length > 0) {
        return <span>{totalFilesUploaded.length} file(s) uploaded. </span>;
      } else {
        return <span>Uploading... </span>;
      }
    } else {
      return <span></span>;
    }
  };

  const onRemove = (Id: string | number) => {
    let index: number = alreadyUploadedImages.findIndex(
      (item) => item?.uri === Id
    );
    if (index >= 0) {
      removeExistingImage(index, alreadyUploadedImages);
      if (props.onRemove) {
        props.onRemove(Id);
      }
    }
  };

  const onChangeSort = (items: ImageProperties[]) => {
    setAlreadyUploadedImages(items);
    if (props.onChange && multiple) {
      props.onChange(items);
    }
  };

  return (
    <Grid container>
      <Sortable
        id={props.id}
        gridGap={!mini ? 10 : 0}
        items={alreadyUploadedImages.map((im) => ({ ...im }))}
        onChange={onChangeSort}
        onRemove={onRemove}
        disabled={disabled}
        width={width}
        height={width}
      >
        {
          // hide image uploader
          alreadyUploadedImages?.filter((it) => it?.uri).length >= maxFiles ||
          (!multiple &&
            alreadyUploadedImages?.length > 0 &&
            !!alreadyUploadedImages[0].uri) ? (
            <></>
          ) : (
            <section
              style={{
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                fontFamily: 'sans-serif',
                position: 'relative',
                maxHeight: width,
              }}
            >
              {/* DROPZONE */}
              <div
                {...getRootProps({ className: 'dropzone' })}
                style={{
                  width: alreadyUploadedImages?.length > 0 ? width : undefined,
                  padding: !mini ? undefined : 12,
                }}
              >
                <input {...getInputProps()} />
                {mini || alreadyUploadedImages?.length > 0 ? (
                  <span
                    style={{
                      fontSize: width / 2 + 10,
                      lineHeight: `${width / 2}px`,
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </span>
                ) : (
                  <p>{t(`Image drag and drop`, { label: label })}</p>
                )}
              </div>
              <FileUploading />
              {/* DROPZONE */}
            </section>
          )
        }
      </Sortable>
    </Grid>
  );
};

export default Upload;
