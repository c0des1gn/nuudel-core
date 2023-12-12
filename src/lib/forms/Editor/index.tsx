import dynamic from 'next/dynamic';
import { IEditorProps } from './Editor';
import { IHtmlEditorProps } from './HtmlEditor';
import Spinner from '../../components/Spinner';

export type { IEditorProps };

const DynamicEditor = dynamic<IEditorProps>(() => import('./Editor'), {
  ssr: false,
  loading: () => <Spinner />,
});

export const HtmlEditor = dynamic<IHtmlEditorProps>(
  () => import('./HtmlEditor'),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default DynamicEditor;
