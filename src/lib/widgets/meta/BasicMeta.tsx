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
      <title>
        {title ? [title, CONF.site_title].join(' | ') : CONF.site_title}
      </title>
      <meta
        name="description"
        content={description ? description : CONF.site_description}
      />
      <meta
        name="keywords"
        content={keywords ? keywords.join(',') : CONF.site_keywords.join(',')}
      />
      {author ? <meta name="author" content={author} /> : null}
      <link rel="canonical" href={CONF.base_url + url} />
    </Head>
  );
}
