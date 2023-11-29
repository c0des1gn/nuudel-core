import styles from './styles.module.scss';

type Props = {
  author?: string;
};
export default function Author({ author }: Props) {
  return (
    <>
      <span className={'widget-author'}>{author || ''}</span>
    </>
  );
}
