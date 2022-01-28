import { CONF } from 'nuudel-utils';
import Head from 'next/head';

type Props = {
  url: string;
  title?: string;
  description?: string;
};
export default function TwitterCardMeta({ url, title, description }: Props) {
  return (
    <Head>
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={'CONF.twitter_account'} />
      <meta property="twitter:url" content={CONF.base_url + url} />
      <meta
        property="twitter:title"
        content={title ? [title, CONF.site_title].join(' | ') : ''}
      />
      <meta
        property="twitter:description"
        content={description ? description : CONF.site_description}
      />
    </Head>
  );
}
