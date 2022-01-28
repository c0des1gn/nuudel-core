import Head from 'next/head';
import { CONF } from 'nuudel-utils';

type Props = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
};
export default function OpenGraphMeta({
  url,
  title,
  description,
  image,
}: Props) {
  return (
    <Head>
      <meta property="og:site_name" content={CONF.site_title} />
      <meta property="og:url" content={CONF.base_url + url} />
      <meta
        property="og:title"
        content={title ? [title, CONF.site_title].join(' | ') : ''}
      />
      <meta
        property="og:description"
        content={description ? description : CONF.site_description}
      />
      <meta
        property="og:image"
        content={image ? image : CONF.base_url + '/og_image.png'}
      />
      <meta property="og:type" content="article" />
    </Head>
  );
}
