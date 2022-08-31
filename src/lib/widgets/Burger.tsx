import styles from './styles.module.scss';

type Props = {
  active: boolean;
  onClick: () => void;
};
export default function Burger({active, onClick}: Props) {
  return (
    <div
      className={'burger-container' + (active ? 'burger-active' : '')}
      onClick={onClick}>
      <div className={`${'burger-meat'} ${'first-meat'}`} />
      <div className={`${'burger-meat'} ${'second-meat'}`} />
      <div className={`${'burger-meat'} ${'third-meat'}`} />
    </div>
  );
}
