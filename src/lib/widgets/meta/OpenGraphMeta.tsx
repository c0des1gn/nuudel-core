import Head from 'next/head';
import { CONF } from 'nuudel-utils';
import { IImage } from '../../../lib/common/Interfaces';

type Props = {
  url: string;
  title?: string;
  description?: string;
  image?: string | IImage;
  type?: string;
  tags?: string[];
  deeplink?: string;
};
export default function OpenGraphMeta({
  url,
  title,
  description,
  type = 'article',
  tags,
  deeplink,
  ...props
}: Props) {
  const {
    width = undefined,
    height = undefined,
    uri: image = props.image,
  } = !props.image || typeof props.image === 'string' ? {} : props.image;

  return (
    <Head>
      <meta property="og:site_name" content={CONF.site_title} />
      <meta
        property="og:url"
        content={
          CONF.base_url +
          (CONF.base_url?.endsWith('/') || url?.startsWith('/') ? '' : '/') +
          url
        }
      />
      <meta property="og:title" content={title || CONF.site_title} />
      <meta
        property="og:description"
        content={description || CONF.site_description}
      />
      <meta property="og:image" content={image || CONF.logo?.uri} />
      <meta property="og:type" content={type} />
      {!!deeplink && (
        <meta property="al:android:url" content={`${deeplink}://${url}`} />
      )}
      {!!deeplink && (
        <meta property="al:ios:url" content={`${deeplink}://${url}`} />
      )}
      {!!tags && tags.length > 0 && type === 'article' && (
        <meta name="article:tag" content={tags.join(', ')} />
      )}
      {!!width && <meta property="og:image:width" content={width + 'px'} />}
      {!!height && <meta property="og:image:height" content={height + 'px'} />}
    </Head>
  );
}
