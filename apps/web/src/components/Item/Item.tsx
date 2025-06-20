import Styles from './Item.module.css';

interface Props {
  item: string;
  onSelectItem: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selected?: boolean;
}

export const Item = ({ item, onSelectItem, selected = false }: Props) => (
  <>
    <input
      checked={selected}
      className={Styles.item__input}
      id={`item_check_${item}`}
      onChange={onSelectItem}
      type="checkbox"
      value={item}
    />
    <label className={Styles.item__label} htmlFor={`item_check_${item}`}>
      {item}
    </label>
  </>
);
