import Styles from './Item.module.css';

interface Props {
  item: string;
  onSelectItem: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selected?: boolean;
}

export const Item = ({ item, onSelectItem, selected = false }: Props) => (
  <>
    <input type="checkbox" id={`item_check_${item}`} value={item} onChange={onSelectItem} checked={selected} />
    <label className={Styles.select__listItemLabel} htmlFor={`item_check_${item}`}>
      {item}
    </label>
  </>
);
