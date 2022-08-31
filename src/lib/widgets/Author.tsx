import {UI} from 'nuudel-core';
import {USER_ID} from 'nuudel-utils';
import styles from './styles.module.scss';

type Props = {
  author?: string;
};
export default function Author({author}: Props) {
  return (
    <>
      <span className={'widget-color'}>{author || UI.getItem(USER_ID)}</span>
    </>
  );
}
