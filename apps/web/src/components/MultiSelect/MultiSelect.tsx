import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Item } from '../Item/Item';
import Styles from './MultiSelect.module.css';

interface MultiSelectProps {
  items: Array<string>;
}

const MultiSelect = ({ items }: MultiSelectProps) => {
  const [preferredItems, setPreferredItems] = useState<Array<string>>([]);
  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
  const [unselectedItems, setUnselectedItems] = useState<Array<string>>(items);
  const [searchValue, setSearchValue] = useState<string>('');
  const itemsContainer = useRef<HTMLUListElement>(null);

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.trim();

    setSearchValue(searchValue);

    if (!searchValue) return;

    const itemsMatching = items.filter((item) => item.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()));

    setUnselectedItems(itemsMatching);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (preferredItems.length === 0) {
      return false;
    }

    setSelectedItems((prev) => [...prev, ...preferredItems].sort((a, b) => a.localeCompare(b)));
    setPreferredItems([]);

    if (itemsContainer.current) {
      itemsContainer.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSelectItem = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedItem = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setPreferredItems((prev) => [...prev, selectedItem]);
    } else {
      setPreferredItems((prev) => prev.filter((item) => item !== selectedItem));
    }
  };

  const onDeselectItem = (event: ChangeEvent<HTMLInputElement>) => {
    const deselectedItem = event.target.value;

    setSelectedItems((prev) => prev.filter((item) => item !== deselectedItem));
  };

  useEffect(() => {
    setUnselectedItems(items.filter((item) => !selectedItems.includes(item)));
  }, [selectedItems, items]);

  return (
    <>
      <h2>Select Multiple Options</h2>

      <search>
        <form className={Styles.multiSelect} onSubmit={onSubmit}>
          <input
            className={Styles.multiSelect__input}
            onChange={onSearch}
            placeholder="Search..."
            type="search"
            value={searchValue}
          />

          <ul className={Styles.multiSelect__list} ref={itemsContainer}>
            {selectedItems.map((item: string) => (
              <li key={item} value={item} className={Styles.multiSelect__listItem}>
                <Item item={item} onSelectItem={onDeselectItem} selected />
              </li>
            ))}

            {unselectedItems.map((item: string) => (
              <li key={item} value={item} className={Styles.multiSelect__listItem}>
                <Item item={item} onSelectItem={onSelectItem} selected={preferredItems.includes(item)} />
              </li>
            ))}
          </ul>

          <input type="submit" value="Apply" />
        </form>
      </search>
    </>
  );
};

export default MultiSelect;
