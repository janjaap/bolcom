import { GRAPHQL_HOST } from 'astro:env/client';

const response = await fetch(GRAPHQL_HOST, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      query Items {
        items
      }
    `,
  }),
});

const json = await response.json();
const { items } = json.data;

// query FilterItems($value: String!) {
//   filter(value: $value)
// }

export const MultiSelect = () => {
  return (
    <div>
      <h2>Select Multiple Options</h2>
      <select multiple>
        {items.map((item: string) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};
