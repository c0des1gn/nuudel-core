import Head from 'next/head';
import { CONF } from 'nuudel-utils';
import { isMobile } from 'react-device-detect';

type Props = {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  url: string;
};
export default function BasicMeta({
  title,
  description,
  keywords,
  author,
  url,
}: Props) {
  return (
    <Head>
      <title>{[title, CONF.site_title].filter(Boolean).join(' | ')}</title>
      {!!description && <meta name="description" content={description} />}
      {!!keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {!author ? null : <meta name="author" content={author} />}
      {isMobile && (
        <link
          rel="canonical"
          href={
            CONF.base_url +
            (CONF.base_url?.endsWith('/') || url?.startsWith('/') ? '' : '/') +
            url
          }
        />
      )}
    </Head>
  );
}
