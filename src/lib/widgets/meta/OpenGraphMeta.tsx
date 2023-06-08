import Head from 'next/head';
import { CONF } from 'nuudel-utils';
import { IImage } from '../../../lib/common/Interfaces';
import { isMobile } from 'react-device-detect';

type Props = {
  url: string;
  title?: string;
  description?: string;
  image?: string | IImage;
  type?: string;
};
export default function OpenGraphMeta({
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
  const link =
    CONF.base_url +
    (CONF.base_url?.endsWith('/') || url?.startsWith('/') ? '' : '/') +
    url;
  return (
    <Head>
      <meta property="og:site_name" content={CONF.site_title} />
      <meta property="og:url" content={link} />
      <meta property="og:title" content={title || CONF.site_title} />
      <meta
        property="og:description"
        content={description || CONF.site_description}
      />
      <meta property="og:image" content={image || CONF.logo?.uri} />
      <meta property="og:type" content={type} />
      {isMobile && !!link && <link rel="canonical" href={link} />}
      {!!width && <meta property="og:image:width" content={width + 'px'} />}
      {!!height && <meta property="og:image:height" content={height + 'px'} />}
    </Head>
  );
}
