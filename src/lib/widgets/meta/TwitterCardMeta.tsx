import { CONF } from 'nuudel-utils';
import Head from 'next/head';

type Props = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
};
export default function TwitterCardMeta({
  url,
  title,
  description,
  image,
}: Props) {
  return (
    <Head>
      <meta property="twitter:card" content={image || CONF.logo?.uri} />
      <meta property="twitter:site" content={CONF.site_title} />
      <meta
        property="twitter:url"
        content={
          CONF.base_url +
          (CONF.base_url?.endsWith('/') || url?.startsWith('/') ? '' : '/') +
          url
        }
      />
      <meta property="twitter:title" content={title || CONF.site_title} />
      <meta
        property="twitter:description"
        content={description || CONF.site_description}
      />
    </Head>
  );
}
