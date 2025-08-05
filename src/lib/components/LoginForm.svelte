<script lang="ts">
  import { login } from '$lib/pocketbase';

  interface Props {
    onLoginSuccess: () => void;
  }

  const { onLoginSuccess }: Props = $props();

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state<string | null>(null);
  let testingConnection = $state(false);

  async function handleLogin() {
    if (!email || !password) {
      error = 'Please enter both email and password';
      return;
    }

    loading = true;
    error = null;

    try {
      console.log('Attempting login with:', { email, passwordLength: password.length });
      const result = await login(email, password);
      console.log('Login successful:', result);
      onLoginSuccess();
    } catch (err) {
      console.error('Login failed:', err);
      if (err instanceof Error) {
        // Extract more detailed error information
        const errorData = (err as any).data || (err as any).response?.data;
        if (errorData) {
          error = `Login failed: ${errorData.message || JSON.stringify(errorData)}`;
        } else {
          error = `Login failed: ${err.message}`;
        }
      } else {
        error = 'Login failed: Unknown error';
      }
    } finally {
      loading = false;
    }
  }

  async function testConnection() {
    testingConnection = true;
    error = null;
    
    try {
      // Import pb here to access it
      const { pb } = await import('$lib/pocketbase');
      console.log('Testing connection to:', pb.baseUrl);
      
      // Try to get collections (this will test authentication and CORS)
      try {
        const collections = await pb.collections.getFullList();
        error = `✅ Connection successful to ${pb.baseUrl} (Found ${collections.length} collections)`;
      } catch (collectionError) {
        // If collections fail due to auth, that's actually good - server is reachable
        if ((collectionError as any)?.status === 401 || (collectionError as any)?.status === 403) {
          error = `✅ Server reachable at ${pb.baseUrl} (Authentication required)`;
        } else {
          throw collectionError;
        }
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      if (err instanceof Error && err.message.includes('CORS')) {
        error = `❌ CORS Error: PocketBase server needs to allow localhost:5173. Check server settings.`;
      } else {
        error = `❌ Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
      }
    } finally {
      testingConnection = false;
    }
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    handleLogin();
  }
</script>

<div class="login-container">
  <div class="login-form">
    <h2>PocketBase Login</h2>
    <p class="login-description">Please login to access the records</p>
    
    <form onsubmit={handleSubmit}>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="Enter your email"
          required
          disabled={loading}
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="Enter your password"
          required
          disabled={loading}
        />
      </div>

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <button type="submit" disabled={loading || testingConnection} class="login-btn">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    <div class="connection-test">
      <button 
        type="button" 
        onclick={testConnection} 
        disabled={testingConnection || loading}
        class="test-btn"
      >
        {testingConnection ? 'Testing...' : 'Test Connection'}
      </button>
    </div>

    <div class="login-help">
      <details class="troubleshooting">
        <summary>Troubleshooting & Setup Guide</summary>
        <div class="help-content">
          <h4>CORS Error Solutions:</h4>
          <ol>
            <li><strong>PocketBase Settings:</strong> In PocketBase admin panel → Settings → Application → Add <code>http://localhost:5173</code> to allowed origins</li>
            <li><strong>Environment Variable:</strong> Set <code>PB_CORS_ENABLED=true</code> when starting PocketBase</li>
            <li><strong>Command Line:</strong> Start PocketBase with <code>--cors.enabled=true --cors.origins="*"</code></li>
          </ol>
          
          <h4>Authentication Help:</h4>
          <ul>
            <li>Try admin credentials first (created during PocketBase setup)</li>
            <li>Create users in PocketBase admin panel if needed</li>
            <li>Check if email verification is required</li>
          </ul>
          
          <h4>Server Status:</h4>
          <p>Make sure PocketBase is running at <code>https://devpiece.com/</code></p>
        </div>
      </details>
    </div>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f8f9fa;
    padding: 1rem;
  }

  .login-form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
  }

  .login-form h2 {
    margin: 0 0 0.5rem 0;
    color: #212529;
    text-align: center;
    font-size: 1.5rem;
  }

  .login-description {
    text-align: center;
    color: #6c757d;
    margin-bottom: 2rem;
    font-size: 0.9rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #495057;
    font-size: 0.9rem;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .form-group input:disabled {
    background: #e9ecef;
    cursor: not-allowed;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    border-radius: 6px;
    border: 1px solid #f5c6cb;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .login-btn {
    width: 100%;
    padding: 0.75rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-bottom: 1.5rem;
  }

  .login-btn:hover:not(:disabled) {
    background: #0056b3;
  }

  .login-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .connection-test {
    text-align: center;
    margin-bottom: 1rem;
  }

  .test-btn {
    padding: 0.5rem 1rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .test-btn:hover:not(:disabled) {
    background: #218838;
  }

  .test-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .login-help {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;
  }

  .login-help p {
    margin: 0.5rem 0;
    font-size: 0.85rem;
  }

  .help-text {
    color: #6c757d;
  }

  .troubleshooting {
    text-align: left;
    margin-top: 1rem;
  }

  .troubleshooting summary {
    cursor: pointer;
    font-weight: 600;
    color: #007bff;
    padding: 0.5rem;
    border-radius: 4px;
    background: #f8f9fa;
    margin-bottom: 0.5rem;
  }

  .troubleshooting summary:hover {
    background: #e9ecef;
  }

  .help-content {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid #007bff;
    margin-top: 0.5rem;
  }

  .help-content h4 {
    margin: 0 0 0.5rem 0;
    color: #495057;
    font-size: 0.9rem;
  }

  .help-content ol, .help-content ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  .help-content li {
    margin: 0.25rem 0;
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .help-content code {
    background: #e9ecef;
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.8rem;
    color: #e83e8c;
  }

  .help-content p {
    margin: 0.5rem 0;
    font-size: 0.85rem;
  }
</style>