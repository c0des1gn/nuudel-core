
import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import type {
  DropzoneOptions,
  Accept,
  FileRejection,
} from 'react-dropzone';
import axios from 'axios';

import { t } from '../../loc/i18n';
import UI from '../../common/UI';
import { resizeImage } from './resizeImage';
import { Sortable } from '../Sortable';

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
  onChange?(val: any): void;
  onRemove?(Id?: string | number): void;
  toWidth?: number;
  width?: number;
}

interface ImageProperties {
  uri: string;
  height?: number;
  width?: number;
  [key: string]: any;
}

interface UploadSummary {
  total: number;
  success: number;
}

// Normalize uploaded images
const normalizeImages = (value: any): ImageProperties[] => {
  const items = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  return items
    .filter(
      (item: any) =>
        item &&
        typeof item.uri === 'string' &&
        item.uri.trim() !== ''
    )
    .map((item: any) => ({ ...item }));
};

// Compare image arrays
const imagesEqual = (
  a: ImageProperties[],
  b: ImageProperties[]
): boolean => {
  if (a.length !== b.length) return false;

  return a.every(
    (item, index) =>
      item.uri === b[index]?.uri &&
      item.height === b[index]?.height &&
      item.width === b[index]?.width
  );
};

// Get axios error message
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      'Upload failed'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
};

// Get rejected file message
const getRejectionMessage = (
  rejection: FileRejection
): string => {
  const messages = rejection.errors.map((error) => {
    switch (error.code) {
      case 'file-too-large':
        return 'File size is too large';

      case 'file-too-small':
        return 'File size is too small';

      case 'file-invalid-type':
        return 'Invalid file type';

      case 'too-many-files':
        return 'Maximum file count exceeded';

      default:
        return error.message;
    }
  });

  return `${rejection.file.name}: ${messages.join(', ')}`;
};

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
  // Initial images
  const initialImages = normalizeImages(uploaded);

  const [alreadyUploadedImages, setAlreadyUploadedImages] =
    useState<ImageProperties[]>(initialImages);

  // Keep latest image state for concurrent uploads
  const imagesRef = useRef<ImageProperties[]>(initialImages);

  // Upload tracking
  const pendingUploadsRef = useRef(0);

  const [uploadingCount, setUploadingCount] = useState(0);

  const [uploadSummary, setUploadSummary] =
    useState<UploadSummary>({
      total: 0,
      success: 0,
    });

  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  // Upload endpoint configuration
  const getUploadConfig = () => {
    const configuredUrl =
      process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL || '';

    const isCloudinary = configuredUrl.includes(
      'cloudinary.com'
    );

    return {
      uploadUrl: isCloudinary ? configuredUrl : '/upload',
      isDirect: !isCloudinary,
      uploadPreset:
        process.env.NEXT_PUBLIC_OBJECT_STORAGE_BUCKET || '',
    };
  };

  // Update image state and notify parent
  const updateImages = (
    images: ImageProperties[],
    notify = true
  ) => {
    imagesRef.current = images;

    setAlreadyUploadedImages(images);

    if (notify && props.onChange) {
      props.onChange(
        multiple ? images : images[0] ?? null
      );
    }
  };

  // Sync external uploaded prop
  useEffect(() => {
    const nextImages = normalizeImages(uploaded);

    if (!imagesEqual(imagesRef.current, nextImages)) {
      imagesRef.current = nextImages;
      setAlreadyUploadedImages(nextImages);
    }
  }, [uploaded]);

  // Upload one image
  const uploadOne = async (
    file: File
  ): Promise<ImageProperties> => {
    const {
      uploadUrl,
      isDirect,
      uploadPreset,
    } = getUploadConfig();

    const data = new FormData();

    const filename = file.name || 'upload';

    data.append('name', filename);

    // Resize image if possible
    let fileToUpload: Blob = file;

    if (props.toWidth) {
      try {
        const resized = await resizeImage(
          file,
          props.toWidth
        );

        if (resized instanceof Blob) {
          fileToUpload = resized;
        }
      } catch (error) {
        // Use original image if resizing fails
        console.warn(
          'Image resize failed. Using original file.',
          error
        );
      }
    }

    data.append('file', fileToUpload, filename);

    if (uploadPreset) {
      data.append('upload_preset', uploadPreset);
    }

    // Prepare headers
    const baseHeaders = isDirect
      ? await UI.headers()
      : {};

    const requestHeaders: Record<string, any> = {
      ...baseHeaders,
    };

    // Let Axios/browser set multipart boundary automatically
    Object.keys(requestHeaders).forEach((key) => {
      if (key.toLowerCase() === 'content-type') {
        delete requestHeaders[key];
      }
    });

    if (isDirect && props.toWidth != null) {
      requestHeaders.toWidth = String(props.toWidth);
    }

    // Send request
    const response = await axios({
      url: uploadUrl,
      method: 'post',
      data,
      headers: requestHeaders,
    });

    const result = response?.data || {};

    const imageUrl =
      result.secure_url ||
      result.url ||
      result.uri ||
      result.data?.uri;

    if (
      typeof imageUrl !== 'string' ||
      !imageUrl.trim()
    ) {
      throw new Error(
        'Upload response does not contain an image URL'
      );
    }

    const picture: ImageProperties = {
      uri: imageUrl,
    };

    if (result.height != null) {
      picture.height = result.height;
    }

    if (result.width != null) {
      picture.width = result.width;
    }

    return picture;
  };

  // Upload selected files
  const handleDrop = async (
    acceptedFiles: File[],
    fileRejections: FileRejection[]
  ) => {
    const rejectionMessages = fileRejections.map(
      getRejectionMessage
    );

    // Calculate remaining capacity including pending uploads
    const currentCount =
      imagesRef.current.length +
      pendingUploadsRef.current;

    let availableCount: number;

    if (!multiple) {
      availableCount = currentCount === 0 ? 1 : 0;
    } else if (maxFiles > 0) {
      availableCount = Math.max(
        0,
        maxFiles - currentCount
      );
    } else {
      availableCount = acceptedFiles.length;
    }

    const filesToUpload = acceptedFiles.slice(
      0,
      availableCount
    );

    if (filesToUpload.length < acceptedFiles.length) {
      rejectionMessages.push(
        `Maximum ${maxFiles > 0 ? maxFiles : 1} files allowed`
      );
    }

    // Nothing to upload
    if (filesToUpload.length === 0) {
      setUploadSummary({
        total: 0,
        success: 0,
      });

      setUploadErrors(rejectionMessages);

      return;
    }

    // Register pending uploads immediately
    pendingUploadsRef.current += filesToUpload.length;

    setUploadingCount(pendingUploadsRef.current);

    setUploadSummary({
      total: filesToUpload.length,
      success: 0,
    });

    setUploadErrors(rejectionMessages);

    try {
      // Upload concurrently, but collect results in selection order
      const results = await Promise.all(
        filesToUpload.map(async (file) => {
          try {
            const image = await uploadOne(file);

            return {
              success: true as const,
              image,
              filename: file.name,
            };
          } catch (error) {
            return {
              success: false as const,
              filename: file.name,
              error: getErrorMessage(error),
            };
          }
        })
      );

      const successfulImages = results
        .filter((result) => result.success)
        .map((result) => result.image);

      const failedMessages = results
        .filter((result) => !result.success)
        .map(
          (result) =>
            `${result.filename}: ${result.error}`
        );

      // Append successful images without losing previous uploads
      if (successfulImages.length > 0) {
        const nextImages = multiple
          ? [
              ...imagesRef.current,
              ...successfulImages,
            ]
          : [successfulImages[0]];

        updateImages(nextImages);
      }

      // Update upload summary
      setUploadSummary({
        total: filesToUpload.length,
        success: successfulImages.length,
      });

      setUploadErrors([
        ...rejectionMessages,
        ...failedMessages,
      ]);
    } finally {
      // Always release pending upload count
      pendingUploadsRef.current = Math.max(
        0,
        pendingUploadsRef.current - filesToUpload.length
      );

      setUploadingCount(
        pendingUploadsRef.current
      );
    }
  };

  // Remove existing image
  const onRemove = async (
    id: string | number
  ) => {
    const currentImages = imagesRef.current;

    const index = currentImages.findIndex(
      (item) => item.uri === String(id)
    );

    if (index < 0) {
      return;
    }

    const image = currentImages[index];

    const {
      isDirect,
      uploadPreset,
    } = getUploadConfig();

    // Delete from storage when direct upload is used
    if (isDirect && removable) {
      try {
        const data: Record<string, any> = {
          delete: image.uri,
        };

        if (uploadPreset) {
          data.upload_preset = uploadPreset;
        }

        await axios({
          url: '/remove',
          method: 'post',
          data,
          headers: {
            'Content-Type': 'application/json',
            ...(await UI.headers()),
          },
        });
      } catch (error) {
        console.error(
          'Image deletion failed:',
          error
        );

        setUploadErrors([
          `Delete failed: ${getErrorMessage(error)}`,
        ]);

        return;
      }
    }

    // Remove from local state
    const nextImages = currentImages.filter(
      (_, imageIndex) => imageIndex !== index
    );

    updateImages(nextImages);

    if (props.onRemove) {
      props.onRemove(id);
    }
  };

  // Sorting images
  const onChangeSort = (
    items: ImageProperties[]
  ) => {
    imagesRef.current = items;

    setAlreadyUploadedImages(items);

    if (props.onChange && multiple) {
      props.onChange(items);
    }
  };

  // Calculate remaining capacity
  const remainingFiles =
    maxFiles > 0
      ? Math.max(
          0,
          maxFiles -
            alreadyUploadedImages.length -
            uploadingCount
        )
      : 0;

  // Hide uploader when limit is reached
  const isLimitReached =
    maxFiles > 0 &&
    alreadyUploadedImages.length + uploadingCount >=
      maxFiles;

  const hideUploader =
    isLimitReached ||
    (!multiple &&
      (alreadyUploadedImages.length > 0 ||
        uploadingCount > 0));

  // Dropzone configuration
  const dropzoneOptions: DropzoneOptions = {
    multiple,

    disabled:
      disabled ||
      (maxFiles > 0 && remainingFiles <= 0) ||
      (!multiple && uploadingCount > 0),

    minSize,
    maxSize,

    // react-dropzone maxFiles applies to multiple selection
    maxFiles:
      multiple && maxFiles > 0
        ? remainingFiles
        : 0,

    accept,

    onDrop: handleDrop,
  };

  const {
    getRootProps,
    getInputProps,
  } = useDropzone(dropzoneOptions);

  return (
    <Grid container>
      <Sortable
        id={props.id}
        gridGap={!mini ? 10 : 0}
        items={alreadyUploadedImages.map((im) => ({
          ...im,
        }))}
        onChange={onChangeSort}
        onRemove={onRemove}
        disabled={disabled}
        width={width}
        height={width}
      >
        {!hideUploader && (
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
              {...getRootProps({
                className: 'dropzone',
              })}
              style={{
                width:
                  alreadyUploadedImages.length > 0
                    ? width
                    : undefined,
                padding: !mini ? undefined : 12,
              }}
            >
              <input {...getInputProps()} />

              {mini || alreadyUploadedImages.length > 0 ? (
                <span
                  style={{
                    fontSize: width / 2 + 10,
                    lineHeight: `${width / 2}px`,
                    cursor: disabled
                      ? 'not-allowed'
                      : 'pointer',
                  }}
                >
                  +
                </span>
              ) : (
                <p>
                  {t('Image drag and drop', {
                    label: label,
                  })}
                </p>
              )}
            </div>

            {/* Upload status */}
            {uploadingCount > 0 && (
              <span>
                Uploading {uploadingCount} file(s)...
              </span>
            )}

            {uploadingCount === 0 &&
              uploadSummary.total > 0 && (
                <span>
                  {uploadSummary.success} of{' '}
                  {uploadSummary.total} file(s) uploaded.
                </span>
              )}

            {/* Upload errors */}
            {uploadErrors.length > 0 && (
              <div
                style={{
                  color: 'red',
                  fontSize: 12,
                  marginTop: 5,
                }}
              >
                {uploadErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}

            {/* DROPZONE */}
          </section>
        )}

        {/* Errors remain visible even when uploader is hidden */}
        {hideUploader && uploadErrors.length > 0 && (
          <div
            style={{
              color: 'red',
              fontSize: 12,
            }}
          >
            {uploadErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
      </Sortable>
    </Grid>
  );
};

export default Upload;
