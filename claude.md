# Parseto Forms

## Svelte 5 Development Guidelines

This project uses Svelte 5. Please follow these guidelines when working with the codebase:

### Key Svelte 5 Features to Use

1. **Runes System**: Use the new runes instead of legacy reactive syntax
   - `$state()` for reactive state
   - `$derived()` for computed values
   - `$effect()` for side effects
   - `$props()` for component props

2. **Component Structure**: 
   - Use `<script>` blocks with runes
   - Prefer composition over inheritance
   - Use TypeScript for type safety

3. **State Management**:
   - Use `$state()` for local component state
   - Use stores for global state when needed
   - Leverage `$derived()` for computed properties

4. **Event Handling**:
   - Use the new event handling syntax
   - Prefer explicit event declarations

### Example Component Pattern

```svelte
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
  }

  const { title, count = 0 }: Props = $props();
  
  let localState = $state(0);
  let computed = $derived(localState + count);
  
  $effect(() => {
    console.log('State changed:', localState);
  });
</script>

<div>
  <h1>{title}</h1>
  <p>Count: {computed}</p>
  <button onclick={() => localState++}>Increment</button>
</div>
```

### Migration Notes
- Avoid legacy `$:` reactive syntax
- Replace `export let` with `$props()`
- Use runes instead of stores for local state when possible