# CSS Variables Reference Guide

## How to Use

All CSS variables are defined in `src/styles/theme.css` and automatically used throughout the application.

### Use in CSS:
```css
.my-element {
  background: var(--primary-color);
  padding: var(--spacing-lg);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}
```

### Use in JavaScript (inline styles):
```javascript
const styles = {
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  padding: 'var(--spacing-md)',
  borderRadius: 'var(--radius-md)',
};
```

---

## Available Variables

### Colors

#### Primary (Indigo)
- `--primary-color` → #6366f1
- `--primary-light` → #818cf8
- `--primary-dark` → #4f46e5
- `--primary-gradient` → linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)

#### Secondary (Green)
- `--secondary-color` → #10b981
- `--secondary-light` → #34d399
- `--secondary-dark` → #059669

#### Text Colors
- `--text-primary` → #1f2937 (light mode) / #f3f4f6 (dark mode)
- `--text-secondary` → #6b7280
- `--text-light` → #9ca3af

#### Background Colors
- `--bg-primary` → #ffffff (light mode) / #111827 (dark mode)
- `--bg-secondary` → #f9fafb (light mode) / #1f2937 (dark mode)
- `--bg-tertiary` → #f3f4f6 (light mode) / #374151 (dark mode)

#### State Colors
- `--success` → #10b981 (Green)
- `--warning` → #f59e0b (Amber)
- `--error` → #ef4444 (Red)
- `--info` → #3b82f6 (Blue)

#### Border & Other
- `--border-color` → #e5e7eb (light) / #374151 (dark)
- `--border-light` → #f3f4f6 (light) / #1f2937 (dark)

---

### Shadows

- `--shadow-sm` → 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- `--shadow-md` → 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- `--shadow-lg` → 0 10px 15px -3px rgba(0, 0, 0, 0.1)
- `--shadow-xl` → 0 20px 25px -5px rgba(0, 0, 0, 0.1)

---

### Spacing

- `--spacing-xs` → 0.25rem
- `--spacing-sm` → 0.5rem
- `--spacing-md` → 1rem
- `--spacing-lg` → 1.5rem
- `--spacing-xl` → 2rem
- `--spacing-2xl` → 3rem
- `--spacing-3xl` → 4rem

---

### Border Radius

- `--radius-sm` → 0.375rem (6px)
- `--radius-md` → 0.5rem (8px)
- `--radius-lg` → 0.75rem (12px)
- `--radius-xl` → 1rem (16px)
- `--radius-2xl` → 1.5rem (24px)
- `--radius-full` → 9999px (circular)

---

### Typography

#### Font Sizes
- `--font-xs` → 0.75rem (12px)
- `--font-sm` → 0.875rem (14px)
- `--font-base` → 1rem (16px)
- `--font-lg` → 1.125rem (18px)
- `--font-xl` → 1.25rem (20px)
- `--font-2xl` → 1.5rem (24px)
- `--font-3xl` → 1.875rem (30px)

#### Font Weights
- `--font-weight-light` → 300
- `--font-weight-normal` → 400
- `--font-weight-medium` → 500
- `--font-weight-semibold` → 600
- `--font-weight-bold` → 700

---

### Transitions

- `--transition-fast` → 150ms ease-in-out
- `--transition-base` → 200ms ease-in-out
- `--transition-slow` → 300ms ease-in-out

---

## Dark Mode

### Enable Dark Mode

#### Method 1: HTML Attribute
```html
<html data-theme="dark">
  <!-- Content -->
</html>
```

#### Method 2: Body Class
```html
<body class="dark-mode">
  <!-- Content -->
</body>
```

#### Method 3: JavaScript
```javascript
// Enable dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Disable dark mode
document.documentElement.removeAttribute('data-theme');

// Check if dark mode is enabled
const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
```

### Dark Mode Implementation

```javascript
// Example: Create a theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

---

## Responsive Breakpoints

### Mobile-First Approach

```css
/* Mobile (default) */
.element { font-size: var(--font-base); }

/* Tablet and up (768px+) */
@media (min-width: 768px) {
  .element { font-size: var(--font-lg); }
}

/* Desktop and up (1024px+) */
@media (min-width: 1024px) {
  .element { font-size: var(--font-xl); }
}
```

---

## Customization

### To Change Primary Color

Edit `src/styles/theme.css`:

```css
:root {
  --primary-color: #your-color-here;
  --primary-light: #lighter-shade;
  --primary-dark: #darker-shade;
  --primary-gradient: linear-gradient(135deg, #your-color 0%, #darker-shade 100%);
}
```

### To Add New Variable

```css
:root {
  /* In the appropriate section */
  --my-custom-color: #value;
  --my-custom-spacing: 2.5rem;
}
```

Then use it:
```css
.my-element {
  color: var(--my-custom-color);
  padding: var(--my-custom-spacing);
}
```

---

## Best Practices

1. **Always use variables** instead of hardcoding colors/spacing
2. **Maintain consistency** by using predefined scales
3. **Test in dark mode** to ensure proper contrast
4. **Use semantic names** for custom variables
5. **Document custom variables** for team reference
6. **Group related variables** for easy management
7. **Keep fallback values** for browser compatibility

---

## Browser Support

CSS Custom Properties are supported in:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+
- iOS Safari 9.2+

For older browsers, provide fallback values:
```css
.element {
  color: #1f2937; /* Fallback */
  color: var(--text-primary);
}
```
