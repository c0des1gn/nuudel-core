import { UI } from 'nuudel-core';
import { USER_KEY } from 'nuudel-utils';
import styles from './styles.module.scss';

type Props = {
  author?: string;
};
export default function Author({ author }: Props) {
  return (
    <>
      <span className={'widget-color'}>{author || UI.getItem(USER_KEY)}</span>
    </>
  );
}
