import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from '@mui/material';
import Image from '../../components/Image';
import { useDropzone, DropzoneOptions, Accept } from 'react-dropzone';
import { useStyles } from './Style';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { t } from '../../loc/i18n';
import axios from 'axios';
import UI from '../../common/UI';
import { resizeImage } from './resizeImage';
import { Sortable } from '../Sortable';
import { SortableItem } from '../Sortable/SortableItem';
//import { stringify_params } from 'nuudel-utils';

interface IUploadProps {
  disabled?: boolean;
  accept?: Accept;
  multiple?: boolean;
  label?: string;
  uploaded?: any;
  minSize?: number;
  maxSize?: number;
  maxFiles?: number;
  onChange?(val: any);
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
  accept = {
    'image/*': [],
  },
  ...props
}) => {
  const classes = useStyles();
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
        if (r && r.data) {
          let res: any = r.data;
          const url = res.secure_url || res.url;
          let picture: any = { uri: url };
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

  const thumbs = files.map((file: UploadFile) => (
    <div className={classes.thumb} key={file.name}>
      <div className={classes.thumbInner}>
        <Image src={file.preview} className={classes.img} />
      </div>
    </div>
  ));

  const removeExistingImage = async (
    index: number,
    allImages: ImageProperties[]
  ) => {
    if (!allImages[index] || !allImages[index].uri) {
      return;
    }
    let allImagesData = allImages.map((it) => ({ ...it }));
    let uploadUrl: string = process?.env?.NEXT_PUBLIC_IMAGE_UPLOAD_URL || '';
    if (uploadUrl?.indexOf('cloudinary.com') < 0) {
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

  const ProductImagesSection: React.FC<any> = ({ images }) => {
    if (images?.length > 0) {
      return (
        <ImageList className={classes.gridList} style={{ margin: '0px' }}>
          {images.map((image: any, index: number) => {
            return (
              <ImageListItem
                key={index}
                style={{
                  width: `${width}px`,
                  height: `${width}px`,
                  padding: '0',
                  display: 'inline-block',
                  marginRight: '5px',
                }}
              >
                <Image
                  src={image?.uri || '/images/placeholder.png'}
                  alt="Image"
                  width={width}
                  height={width}
                />
                <ImageListItemBar
                  classes={{
                    root: classes.titleBar,
                  }}
                  actionIcon={
                    <IconButton
                      disabled={disabled === true}
                      onClick={(e) => {
                        removeExistingImage(index, alreadyUploadedImages);
                      }}
                      className={classes.icon}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            );
          })}
        </ImageList>
      );
    } else {
      return <div></div>;
    }
  };

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      setAlreadyUploadedImages(
        uploaded instanceof Array ? uploaded : !uploaded ? [] : [uploaded]
      );
    } else {
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
        return <span>Uploading. </span>;
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
    }
  };

  return (
    <Grid container>
      <Sortable
        items={alreadyUploadedImages}
        onChange={setAlreadyUploadedImages}
        renderItem={(item: any) => (
          <SortableItem id={item?.uri} item={item} onRemove={onRemove} />
        )}
      >
        <section className={classes.FileContainer} style={{ maxHeight: width }}>
          {/* DROPZONE */}
          <div
            {...getRootProps({ className: 'dropzone' })}
            style={{
              width: alreadyUploadedImages?.length > 0 ? width : undefined,
            }}
          >
            <input {...getInputProps()} />
            {alreadyUploadedImages?.length > 0 ? (
              <span style={{ fontSize: 60, lineHeight: '50px' }}>+</span>
            ) : (
              <p>{t(`Image drag and drop`, { label: label })}</p>
            )}
          </div>
          <FileUploading />
          {/* DROPZONE */}
        </section>
      </Sortable>
      {
        //<ProductImagesSection images={alreadyUploadedImages}></ProductImagesSection>
      }
    </Grid>
  );
};

export default Upload;
