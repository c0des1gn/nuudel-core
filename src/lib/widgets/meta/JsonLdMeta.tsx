import { BlogPosting } from 'schema-dts';
import { jsonLdScriptProps } from 'react-schemaorg';
import { CONF, dateToString } from 'nuudel-utils';
import Head from 'next/head';

type Props = {
  url: string;
  title: string;
  keywords?: string[];
  date: Date;
  author?: string;
  image?: string;
  description?: string;
};
export default function JsonLdMeta({
  url,
  title,
  keywords,
  date = new Date(),
  author,
  image,
  description,
}: Props) {
  return (
    <Head>
      <script
        {...jsonLdScriptProps<BlogPosting>({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          mainEntityOfPage:
            CONF.base_url +
            (CONF.base_url?.endsWith('/') || url?.startsWith('/') ? '' : '/') +
            url,
          headline: title || CONF.site_title,
          keywords: !keywords ? undefined : keywords.join(', '),
          datePublished: dateToString(date, 'YYYY/MM/DD HH:mm'),
          author: author,
          image: image || CONF.logo?.uri,
          description: description || CONF.site_description,
        })}
      />
    </Head>
  );
}
