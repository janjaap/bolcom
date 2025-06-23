import { GRAPHQL_HOST } from 'astro:env/client';
import { getStorageProvider, STORAGE_KEY } from '../../lib/storage';

const storageProvider = getStorageProvider();

const itemsFromStorage = new Set<string>(
  JSON.parse(document.querySelector('[role="search"]')!.getAttribute('data-items-from-storage') || '[]'),
);

const itemsFromSource = new Set<string>(
  JSON.parse(document.querySelector('[role="search"]')!.getAttribute('data-items') || ''),
);

const form = document.querySelector('.multiSelect__form') as HTMLFormElement;
const input = form.querySelector('.multiSelect__input') as HTMLInputElement;
const list = form.querySelector('.multiSelect__list') as HTMLUListElement;

const preselectedItems = new Set<HTMLInputElement>();
const selectedItems = new Set<string>(itemsFromStorage);
const unselectedItems = new Set(itemsFromSource.difference(itemsFromStorage));
const filteredItems = new Set<string>([]);

const getSorted = <T extends string>(set: Set<T>): T[] =>
  [...Array.from(set)].sort((a, b) => a.toString().localeCompare(b.toString()));

function getListDivider(): HTMLLIElement {
  const li = document.createElement('li');
  const hr = document.createElement('hr');
  hr.className = 'multiSelect__divider';
  li.prepend(hr);

  return li;
}

function getLiFromItem(
  item: string,
  options?: { checked?: boolean; once?: boolean; inputHandler?: (event: Event) => void },
): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'multiSelect__listItem';
  li.innerHTML = `
    <input type="checkbox" id="${item}" name="${item}" value="${item}" />
    <label for="${item}">${item}</label>
  `;

  const { checked, once, inputHandler } = options || {};

  if (checked) {
    li.querySelector('input')!.checked = true;
  }

  if (inputHandler) {
    li.querySelector('input')!.addEventListener('change', inputHandler, { once });
  }

  return li;
}

function renderList() {
  const fragment = new DocumentFragment();

  if (selectedItems.size > 0) {
    getSorted(selectedItems).forEach((item) => {
      fragment.appendChild(getLiFromItem(item, { inputHandler: deselectItem, checked: true, once: true }));
    });

    fragment.appendChild(getListDivider());
  }

  const itemsToRender = filteredItems.size > 0 ? filteredItems : unselectedItems;

  getSorted(itemsToRender).forEach((item) => {
    fragment.appendChild(getLiFromItem(item, { inputHandler: preselectItem }));
  });

  list.replaceChildren(fragment);

  list.scrollTo({ top: 0, behavior: 'smooth' });
}

function preselectItem(event: Event) {
  const target = event.currentTarget as HTMLInputElement;

  if (target.checked) {
    preselectedItems.add(target);
  } else {
    preselectedItems.delete(target);
  }
}

function deselectItem(event: Event) {
  const target = event.currentTarget as HTMLInputElement;

  if (target.checked) return;

  selectedItems.delete(target.value);
  unselectedItems.add(target.value);

  storageProvider.setItem(STORAGE_KEY, JSON.stringify(getSorted(selectedItems)));

  renderList();
}

input.addEventListener('input', async (event) => {
  const target = event.currentTarget as HTMLInputElement;
  const searchTerm = target.value.trim().toLowerCase();

  filteredItems.clear();

  if (searchTerm.length === 0) {
    itemsFromSource.forEach((item) => unselectedItems.add(item));
    renderList();
    return;
  }

  try {
    const json = await fetch(GRAPHQL_HOST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
        query FilterItems($searchTerm: String!) {
          filter(value: $searchTerm)
        }
      `,
        variables: { searchTerm },
      }),
    }).then((res) => res.json());

    const itemsMatching: Array<string> = json.data.filter;

    filteredItems.clear();

    itemsMatching.forEach((item) => {
      filteredItems.add(item);
    });
  } catch (error) {
    console.error('Error fetching filtered items:', error);
  }

  renderList();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (preselectedItems.size === 0) return;

  const checkedItems = form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked');

  Array.from(checkedItems)
    .sort((a, b) => b.value.localeCompare(a.value))
    .forEach((item) => {
      selectedItems.add(item.value);
      unselectedItems.delete(item.value);
    });

  storageProvider.setItem(STORAGE_KEY, JSON.stringify(getSorted(selectedItems)));

  filteredItems.clear();
  input.value = '';

  renderList();
});

renderList();
