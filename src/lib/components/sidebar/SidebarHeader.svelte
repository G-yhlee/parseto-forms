<script lang="ts">
  import { LogOut, Database } from 'lucide-svelte';

  interface Props {
    onLogout: () => void;
  }

  const { onLogout }: Props = $props();
</script>

<div class="sidebar-header">
  <div class="pb-logo">
    <div class="logo-icon">
      <Database size={18} color="white" />
    </div>
    <span class="logo-text">PocketBase</span>
  </div>
  <button onclick={onLogout} class="logout-btn" title="Logout">
    <LogOut size={16} />
  </button>
</div>

<style>
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .pb-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background: #3b82f6;
    color: white;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .logo-text {
    font-weight: 600;
    color: #1f2937;
  }

  .logout-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .logout-btn:hover {
    background: #f3f4f6;
    color: #374151;
  }
</style>