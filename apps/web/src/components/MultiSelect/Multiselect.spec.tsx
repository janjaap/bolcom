import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MultiSelect from '../../components/MultiSelect/MultiSelect';

describe('MultiSelect', () => {
  it('renders without crashing', async () => {
    render(<MultiSelect items={[]} />);

    expect(await screen.findByRole('button', { name: /Apply/i })).toBeInTheDocument();
  });

  it('displays all items passed as props when not loading');

  it('shows selected items at the top of the list');

  it('shows unselected items below selected items');

  it('filters items based on search input');

  it('shows no items when filter does not match any items');

  it('throttles search input to prevent excessive re-renders');

  it('resets filter when search input is cleared');

  it('preselects items when checkbox is checked');

  it('removes items from preselected when checkbox is unchecked');

  it('adds preselected items to selected items on submit');

  it('clears preselected items after submit');

  it('removes selected items from unselected list after submit');

  it('persists selected items to storage on submit');

  it('loads selected items from storage on mount');

  it('handles invalid JSON in storage gracefully');

  it('removes item from selected when deselected');

  it('updates storage when item is deselected');

  it('scrolls items container to top on submit');

  it('shows divider between selected and unselected items when there are selected items');

  it('does not show divider when there are no selected items');

  it('disables interaction while loading');
});
