import { BlogPosting } from 'schema-dts';
import { jsonLdScriptProps } from 'react-schemaorg';
import { CONF } from 'nuudel-utils';
import moment from 'moment';
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
  date,
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
          mainEntityOfPage: CONF.base_url + url,
          headline: title,
          keywords: keywords ? undefined : keywords.join(','),
          datePublished: moment(date).format('YYYY/MM/DD HH:mm'),
          author: author,
          image: image,
          description: description,
        })}
      />
    </Head>
  );
}
