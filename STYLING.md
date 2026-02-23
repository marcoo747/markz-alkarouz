# Frontend Styling Guidelines

## Overview
This document outlines the styling architecture and best practices for the Markaz Alkarouz React Vite frontend.

---

## Styling System Hierarchy

### 1. **Tailwind CSS** (Primary)
- **Use for:** Utility-first styling, responsive layouts, spacing, typography, colors
- **Location:** Build via PostCSS from `resources/css/app.css`
- **Why:** Rapid development, consistency, minimal CSS bloat
- **Example:**
  ```jsx
  <div className="flex gap-4 p-3 rounded-lg bg-gray-50">
    <button className="btn btn-primary">Submit</button>
  </div>
  ```

### 2. **Bootstrap 5** (Secondary)
- **Use for:** Component-scoped styles (buttons, badges, cards, modals)
- **Imported via npm:** `import 'bootstrap/dist/css/bootstrap.min.css'` in `app.jsx`
- **Why:** Battle-tested components, accessibility features, utility classes
- **Example:**
  ```jsx
  <div className="card shadow-sm">
    <button className="btn btn-success">Confirm</button>
  </div>
  ```

### 3. **CSS Modules** (Component-Specific)
- **Use for:** Styles that cannot be expressed via Tailwind/Bootstrap
- **Naming:** `ComponentName.module.css`
- **Scope:** Automatically scoped to component (prevents global pollution)
- **Example:**
  ```jsx
  import styles from '../../css/AddModal.module.css';

  <div className={styles.modalOverlay}>
    <div className={styles.editModal}>...</div>
  </div>
  ```

### 4. **Global CSS** (Minimal)
- **Location:**
  - `resources/css/app.css` - Tailwind directives + minimal resets
  - `resources/css/theme.css` - Brand colors and theme variables
  - `resources/css/responsive-tables.css` - Responsive table utilities
- **Use for:** Global utilities only, no component-specific styles
- **Note:** Keep these files lean to maintain performance

---

## Styling Best Practices

### ✅ DO:
1. **Use Tailwind classes** for responsive design and utility styling
   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">...</div>
   ```

2. **Use Bootstrap** for recognized component patterns
   ```jsx
   <div className="alert alert-info">Information message</div>
   ```

3. **Create CSS Modules** for complex component-specific styling
   ```jsx
   // Modal styles that need animations, pseudo-elements, etc.
   import styles from '../../css/CheckoutModal.module.css';
   ```

4. **Combine Tailwind + Bootstrap + CSS Modules** as needed
   ```jsx
   <div className={`${styles.modalOverlay} d-flex justify-content-center`}>
     <button className="btn btn-primary">Click me</button>
   </div>
   ```

5. **Use responsive prefixes** for mobile-first design
   ```jsx
   <div className="flex-col md:flex-row lg:gap-8">...</div>
   ```

### ❌ DON'T:
1. **No inline `style` props** - Use Tailwind classes instead
   ```jsx
   // ❌ WRONG
   <div style={{ padding: '20px', color: 'red' }}>...</div>

   // ✅ RIGHT
   <div className="p-5 text-red-600">...</div>
   ```

2. **No inline `<style>` tags** in React components
   ```jsx
   // ❌ WRONG
   export default MyComponent() {
     return (
       <>
         <div>...</div>
         <style>{`.my-style { color: blue; }`}</style>
       </>
     );
   }

   // ✅ RIGHT
   // Create MyComponent.module.css and import it
   ```

3. **No global class names without CSS Modules**
   ```jsx
   // ❌ WRONG
   <div className="modal-overlay">...</div> // Could conflict globally

   // ✅ RIGHT
   import styles from './Modal.module.css';
   <div className={styles.modalOverlay}>...</div>
   ```

4. **Don't add new npm packages** without approval
   - Bootstrap and Tailwind are sufficient for all UI needs
   - Check if Tailwind can already do it before adding a library

---

## CSS Module Usage

### File Naming Convention
- **Pattern:** `ComponentName.module.css`
- **Location:** `resources/css/`
- **Example:**
  - `AddModal.module.css` - For add modal styles
  - `LoginMessage.module.css` - For login message styles
  - `ProfilePage.module.css` - For profile page modals

### Importing in Components
```jsx
import styles from '../../css/AddModal.module.css';

export default AddItemModal() {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.addModal}>
        {/* content */}
      </div>
    </div>
  );
}
```

### Class Naming in CSS Modules
- **Use camelCase:** `.modalOverlay` not `.modal-overlay`
- **Be descriptive:** `.addCategoryModal` is better than `.modal`
- **Scope locally:** Each module handles its own component only

---

## When to Use What

### Use Tailwind When:
- Styling basic spacing, margins, padding
- Responsive layouts (grid, flex)
- Typography (font sizes, weights, colors)
- Hover/focus states
- Simple positioning

### Use Bootstrap When:
- Using Bootstrap components (Carousel, Modal, Alert, Badge)
- Needing proven accessibility patterns
- Grid system for layouts
- Form styling and validation states

### Use CSS Modules When:
- Complex animations or transitions
- Pseudo-elements (::before, ::after)
- Media queries for responsive edge cases
- Component-specific hover/active states
- Styles that depend on dynamic values

---

## Responsive Design

### Mobile-First Breakpoints
Use Tailwind's responsive prefixes (Bootstrap breakpoints equivalent):
```jsx
<div className="col-12 md:col-6 lg:col-4">
  {/* 100% on mobile, 50% on tablet, 33% on desktop */}
</div>
```

### Available Breakpoints (Tailwind)
- `sm` - 640px
- `md` - 768px (Bootstrap `md`)
- `lg` - 1024px (Bootstrap `lg`)
- `xl` - 1280px (Bootstrap `xl`)
- `2xl` - 1536px (Bootstrap `xxl`)

---

## Color System

### Theme Colors
Defined in `resources/css/theme.css` and available globally:
- Primary: `#0d6efd` (Bootstrap blue)
- Success: `#198754` (Bootstrap green)
- Danger: `#dc3545` (Bootstrap red)
- Warning: `#ffc107` (Bootstrap yellow)
- Info: `#0dcaf0` (Bootstrap cyan)

### Usage
```jsx
// Tailwind
<div className="bg-blue-600 text-white">...</div>

// Bootstrap
<div className="bg-primary text-white">...</div>

// Mix both
<div className="bg-success py-3 px-4 rounded">...</div>
```

---

## Performance Considerations

1. **CSS Module Scope:** Automatically scoped, no cascading issues
2. **Tailwind JIT:** Only used classes are included in build
3. **Bootstrap Pruning:** Only needed Bootstrap components are imported
4. **No Duplicates:** Each CSS file imported once per app
5. **Build Size:** Optimized bundle with no redundant styles

---

## Common Patterns

### Modal Overlay
```jsx
import styles from '../../css/AddModal.module.css';

<div className={styles.modalOverlay}>
  <div className={styles.addModal}>
    <div className={styles.modalHeader}>
      <h3>Title</h3>
    </div>
    <div className={styles.modalBody}>...</div>
    <div className={styles.modalFooter}>...</div>
  </div>
</div>
```

### Card Component
```jsx
<div className="card shadow-sm">
  <div className="card-body">
    <h5 className="card-title">Title</h5>
    <p className="card-text">Content</p>
  </div>
</div>
```

### Button Group
```jsx
<div className="btn-group" role="group">
  <button className="btn btn-outline-primary">Option 1</button>
  <button className="btn btn-outline-primary">Option 2</button>
</div>
```

### Responsive Grid
```jsx
<div className="grid gap-4">
  <div className="col-12 md:col-6 lg:col-4">Item 1</div>
  <div className="col-12 md:col-6 lg:col-4">Item 2</div>
  <div className="col-12 md:col-6 lg:col-4">Item 3</div>
</div>
```

---

## Migration Path

### From Inline Styles to Tailwind
```jsx
// OLD
style={{ padding: '16px', borderRadius: '8px' }}

// NEW
className="p-4 rounded-lg"
```

### From Component CSS to CSS Modules
```jsx
// OLD
<style>
  .modal { width: 420px; }
  .modal-header { background: blue; }
</style>

// NEW
// Create Modal.module.css
import styles from './Modal.module.css';
<div className={styles.modal}>
  <div className={styles.modalHeader}>...</div>
</div>
```

---

## Troubleshooting

### Styles Not Applied
1. Check class name is referenced correctly
2. Verify CSS Module is imported: `import styles from '...'`
3. Ensure camelCase for CSS Module classes: `styles.modalOverlay`
4. Check browser DevTools for scoped class name: `_AddModal-module__modalOverlay__1a2b3`

### Conflicting Styles
1. Use CSS Module scoping to avoid conflicts
2. Increase specificity: `className="btn btn-primary btn-lg"`
3. Use Bootstrap nesting: `.card.large { ... }`
4. Check z-index values for layering issues

### Build Errors
1. Ensure all CSS Modules end with `.module.css`
2. Verify PostCSS config is correct: `postcss.config.js`
3. Check Tailwind config content paths: `tailwind.config.js`
4. Run `npm run build` to check for errors

---

## References
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [CSS Modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)
- [PostCSS Configuration](https://postcss.org/)

---

**Last Updated:** Feb 23, 2025
**Maintainer:** Frontend Team
