import styles from './styles.module.scss';

type Props = {
  active: boolean;
  onClick: () => void;
};
export default function Burger({ active, onClick }: Props) {
  return (
    <div
      className={styles.burgerContainer + (active ? styles.burgerActive : '')}
      onClick={onClick}
    >
      <div className={`${styles.burgerMeat} ${styles.firstMeat}`} />
      <div className={`${styles.burgerMeat} ${styles.secondMeat}`} />
      <div className={`${styles.burgerMeat} ${styles.thirdMeat}`} />
    </div>
  );
}
