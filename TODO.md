# TODO: Add Edit and Delete Buttons to Category Cards

## Steps to Complete
- [ ] Modify `src/Components/CategoryCard.js` to include edit and delete buttons, accepting `onEdit` and `onDelete` props.
- [ ] Update `src/Components/category.js` to pass `onEdit` and `onDelete` props to `CategoryCard`.
- [ ] Update `src/pages/categories.js` to remove global edit/delete buttons and mode logic, add per-category edit/delete handlers.
- [ ] Verify the UI: Ensure buttons appear in each card and modals open correctly without navigation issues.
