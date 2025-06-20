import throttle from 'lodash/throttle';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { getStorageProvider } from '../../lib/storage';
import { Item } from '../Item/Item';
import Styles from './MultiSelect.module.css';

interface MultiSelectProps {
  items: Array<string>;
}

const storageProvider = getStorageProvider();

const MultiSelect = ({ items }: MultiSelectProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [preselectedItems, setPreselectedItems] = useState<Array<string>>([]);
  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
  const [unselectedItems, setUnselectedItems] = useState<Array<string>>(items);
  const [searchValue, setSearchValue] = useState<string>('');
  const itemsContainer = useRef<HTMLUListElement>(null);

  const applyFilter = throttle(
    (inputValue: string) => {
      if (!inputValue) {
        setUnselectedItems(items);
        return;
      }

      const itemsMatching = items.filter((item) => item.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()));

      setUnselectedItems(itemsMatching);
    },
    500,
    { leading: false, trailing: true },
  );

  const onFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trim();

    setSearchValue(inputValue);

    applyFilter(inputValue);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSearchValue('');

    if (preselectedItems.length === 0) {
      return false;
    }

    setSelectedItems((prev) => {
      const updatedSelectedItems = [...prev, ...preselectedItems].sort((a, b) => a.localeCompare(b));

      storageProvider.setItem('selectedItems', JSON.stringify(updatedSelectedItems));

      return updatedSelectedItems;
    });

    setPreselectedItems([]);

    setUnselectedItems(() => items.filter((item) => !preselectedItems.includes(item)));

    if (itemsContainer.current) {
      itemsContainer.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onPreselectItem = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedItem = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setPreselectedItems((prev) => [...prev, selectedItem]);
    } else {
      setPreselectedItems((prev) => prev.filter((item) => item !== selectedItem));
    }
  };

  const onDeselectItem = (event: ChangeEvent<HTMLInputElement>) => {
    const deselectedItem = event.target.value;

    setSelectedItems((prev) => {
      const updatedSelectedItems = prev.filter((item) => item !== deselectedItem);

      storageProvider.setItem('selectedItems', JSON.stringify(updatedSelectedItems));

      return updatedSelectedItems;
    });
  };

  useEffect(() => {
    const itemsFromStorage = storageProvider.getItem('selectedItems');

    if (!itemsFromStorage) {
      setUnselectedItems(items);
    } else {
      try {
        const parsedPreferences = JSON.parse(itemsFromStorage) as Array<string>;

        setSelectedItems(parsedPreferences);
        setUnselectedItems(items.filter((item) => !parsedPreferences.includes(item)));
      } catch (error) {
        // invalid JSON, fail silently
        console.error('Failed to parse selected items from storage:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [items]);

  return (
    <search>
      <form className={Styles.multiSelect__form} onSubmit={onSubmit}>
        <input
          className={Styles.multiSelect__input}
          onChange={onFilter}
          placeholder="Search..."
          type="search"
          value={searchValue}
        />

        <ul className={Styles.multiSelect__list} ref={itemsContainer}>
          {!loading && (
            <>
              {selectedItems.map((item: string) => (
                <li key={item} value={item} className={Styles.multiSelect__listItem}>
                  <Item item={item} onSelectItem={onDeselectItem} selected />
                </li>
              ))}

              {selectedItems.length > 0 && (
                <li>
                  <hr className={Styles.multiSelect__divider} />
                </li>
              )}

              {unselectedItems.map((item: string) => (
                <li key={item} value={item} className={Styles.multiSelect__listItem}>
                  <Item item={item} onSelectItem={onPreselectItem} selected={preselectedItems.includes(item)} />
                </li>
              ))}
            </>
          )}
        </ul>

        <input className={Styles.multiSelect__submit} type="submit" value="Apply" />
      </form>
    </search>
  );
};

export default MultiSelect;
