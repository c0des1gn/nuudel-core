import { CONF } from 'nuudel-utils';
import { IImage } from 'nuudel-core';

type Props = {
  url: string;
  title?: string;
  description?: string;
  image?: string | IImage;
  type?: string;
};
export function MetaJson({
  url,
  title,
  description,
  type = 'article',
  ...props
}: Props) {
  const {
    width = undefined,
    height = undefined,
    uri: image = props.image,
  } = !props.image || typeof props.image === 'string' ? {} : props.image;

  const images = [
    {
      url: image || CONF.logo?.uri,
      width: width,
      height: height,
    },
  ];
  return {
    title: title || CONF.site_title,
    description: description || CONF.site_description,
    url:
      CONF.base_url +
      (CONF.base_url?.endsWith('/') || url?.startsWith('/') ? '' : '/') +
      url,
    site_name: CONF.site_title,
    type: type,
    images: images,
  };
}
