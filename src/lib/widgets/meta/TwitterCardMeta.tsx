import { CONF } from 'nuudel-utils';
import Head from 'next/head';

type Props = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  username?: string; // @your_twitter_username
  alt?: string;
};
export default function TwitterCardMeta({
  url,
  title,
  description,
  image,
  alt,
  username = process?.env?.TWITTER_USERNAME,
}: Props) {
  return (
    <Head>
      <meta
        property="twitter:card"
        content={!image ? 'summary' : 'summary_large_image'}
      />
      <meta property="twitter:image" content={image || CONF.logo?.uri} />
      {!!alt && <meta property="twitter:image:alt" content={alt} />}
      {!!username && <meta property="twitter:site" content={username} />}
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
