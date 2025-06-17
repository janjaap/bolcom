// const options = await fetch('');

export const MultiSelect = () => {
  return (
    <div>
      <h2>Select Multiple Options</h2>
      <select multiple>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
    </div>
  );
};
