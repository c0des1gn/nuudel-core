import { UI } from 'nuudel-core';
import { USER_TOKEN, tokenObj } from 'nuudel-utils';
import styles from './styles.module.scss';

type Props = {
  author?: string;
};
export default function Author({ author }: Props) {
  return (
    <>
      <span className={'widget-color'}>
        {author || tokenObj(UI.getItem(USER_TOKEN))?.username || ''}
      </span>
    </>
  );
}
