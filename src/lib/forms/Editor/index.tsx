import dynamic from 'next/dynamic';
import { IProps } from './Editor';
import { IEditorProps } from './HtmlEditor';
import Spinner from '../../components/Spinner';

const DynamicEditor = dynamic<IProps>(() => import('./Editor'), {
  ssr: false,
  loading: () => <Spinner />,
});

export const HtmlEditor = dynamic<IEditorProps>(() => import('./HtmlEditor'), {
  ssr: false,
  loading: () => <Spinner />,
});

export default DynamicEditor;
