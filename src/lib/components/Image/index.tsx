import React from 'react';
import NextImage, { ImageLoader } from 'next/image';

interface IImageProps {
  src?: string | any;
  srcSet?: string;
  width?: number | string | any;
  height?: number | string | any;
  className?: string;
  style?: React.CSSProperties;
  children?: any;
  alt?: string;
  title?: string;
  loader?: ImageLoader;
  layout?: 'fixed' | 'fill' | 'intrinsic' | 'responsive';
  objectFit?:
    | 'contain'
    | 'cover'
    | 'fill'
    | 'inherit'
    | 'initial'
    | 'none'
    | 'revert'
    | 'scale-down'
    | 'unset'
    | '-moz-initial';
  //quality?: number | string;
  //priority?: boolean;
  //name?: string;
  //align?: string;
  //border?: string;
  //hspace?: number | string;
  //vspace?: number | string;
}

// A styled version of the Next.js Image component:
const Image: React.FC<IImageProps> = React.forwardRef<
  HTMLImageElement,
  IImageProps
>(({ children, src, className, loader, ...props }, ref) => {
  const isExternal =
    typeof src === 'string' &&
    (src.indexOf('http') === 0 || src.indexOf('data:') === 0);

  if (isExternal) {
    return (
      <img {...props} className={className} src={src} ref={ref}>
        {children}
      </img>
    );
  }

  // no width & no height error hack
  if (
    typeof props.width === 'undefined' &&
    typeof props.height === 'undefined' &&
    typeof props.layout === 'undefined' &&
    typeof props.objectFit === 'undefined'
  ) {
    props.layout = 'fill';
    props.objectFit = 'contain';
  }

  return (
    <div className={className} style={{ position: 'relative' }}>
      <NextImage {...props} alt={props.alt || ''} src={src} loader={loader}>
        {children}
      </NextImage>
    </div>
  );
});

export default Image;
