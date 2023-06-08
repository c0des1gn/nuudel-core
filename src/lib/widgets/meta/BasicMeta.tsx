import Head from 'next/head';
import { CONF } from 'nuudel-utils';

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
      <meta name="description" content={description || CONF.site_description} />
      <meta
        name="keywords"
        content={!keywords ? CONF.site_keywords?.join(',') : keywords.join(',')}
      />
      {!author ? null : <meta name="author" content={author} />}
      <link
        rel="canonical"
        href={
          CONF.base_url +
          (CONF.base_url?.endsWith('/') || url?.startsWith('/') ? '' : '/') +
          url
        }
      />
    </Head>
  );
}
