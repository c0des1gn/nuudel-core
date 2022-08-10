import dynamic from 'next/dynamic';
import { IProps } from './Editor';
import Spinner from '../../components/Spinner';

const DynamicEditor = dynamic<IProps>(() => import('./Editor'), {
  ssr: false,
  loading: () => <Spinner />,
});

export default DynamicEditor;
