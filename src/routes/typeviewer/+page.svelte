<script lang="ts">
	import { TypeGenerator } from '$lib/utils/typeGenerator';
	import { createHighlightedCode } from '$lib/utils/syntaxHighlighter';
	import JsonEditor from '$lib/components/typeviewer/JsonEditor.svelte';

	let jsonInput = $state(`{
  "bookstore": {
    "name": "City Reads",
    "location": "Downtown",
    "books": [
      {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "details": {
          "genre": "Classic",
          "pages": 180,
          "published_year": 1925
        }
      },
      {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "details": {
          "genre": "Fiction",
          "pages": 281,
          "published_year": 1960
        }
      }
    ],
    "staff": [
      {
        "name": "Alice Smith",
        "role": "Manager"
      },
      {
        "name": "Bob Johnson",
        "role": "Sales Associate"
      }
    ]
  }
}`);

	let jsonError = $state('');
	let generatedTypes = $state('');
	let highlightedTypes = $state('');
	let copySuccess = $state(false);
	let editMode = $state(false);
	let parsedData = $state<any>(null);

	// JSON 파싱 및 타입 생성
	function generateTypes() {
		try {
			const parsedJson = JSON.parse(jsonInput);
			jsonError = '';
			parsedData = parsedJson;
			
			const typeResult = TypeGenerator.analyzeRecord(parsedJson, 'Root');
			const allCode = generateAllInterfacesCode(typeResult);
			generatedTypes = allCode;
			highlightedTypes = createHighlightedCode(allCode);
		} catch (error) {
			jsonError = error instanceof Error ? error.message : 'Invalid JSON';
			generatedTypes = '';
			highlightedTypes = '';
			parsedData = null;
		}
	}

	// JSON 데이터 업데이트
	function updateJsonData(newData: any) {
		parsedData = newData;
		jsonInput = JSON.stringify(newData, null, 2);
		generateTypes();
	}

	// 모든 인터페이스 코드 생성
	function generateAllInterfacesCode(mainInterface: any): string {
		const codes: string[] = [];
		
		// 중첩된 인터페이스들 먼저 추가
		if (mainInterface.nestedInterfaces) {
			mainInterface.nestedInterfaces.forEach((nested: any) => {
				codes.push(generateAllInterfacesCode(nested));
			});
		}
		
		// 메인 인터페이스 추가
		codes.push(mainInterface.code);
		
		return codes.join('\n\n');
	}

	// 클립보드 복사
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(generatedTypes);
			copySuccess = true;
			setTimeout(() => copySuccess = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// 초기 타입 생성
	generateTypes();
</script>

<svelte:head>
	<title>JSON to TypeScript - Type Viewer</title>
</svelte:head>

<div class="converter">
	<header class="converter-header">
		<h1>JSON to TypeScript</h1>
		<p>Convert JSON data to TypeScript interfaces automatically</p>
	</header>

	<div class="converter-body">
		<!-- Left Panel - JSON Input -->
		<div class="panel input-panel">
			<div class="panel-header">
				<h3>JSON Input</h3>
				<div class="panel-actions">
					<button 
						class="btn btn-secondary" 
						onclick={() => editMode = !editMode}
						disabled={!parsedData}
					>
						{editMode ? 'Text Mode' : 'Edit Mode'}
					</button>
					<button class="btn btn-secondary" onclick={() => { jsonInput = ''; generateTypes(); }}>
						Clear
					</button>
					<button class="btn btn-secondary" onclick={() => { 
						jsonInput = JSON.stringify(JSON.parse(jsonInput), null, 2); 
						generateTypes(); 
					}}>
						Format
					</button>
				</div>
			</div>
			<div class="panel-content">
				{#if editMode && parsedData}
					<div class="json-editor-container">
						<JsonEditor 
							data={parsedData} 
							onUpdate={updateJsonData}
						/>
					</div>
				{:else}
					<textarea 
						bind:value={jsonInput}
						oninput={generateTypes}
						placeholder="Paste your JSON here..."
						class="json-textarea"
						class:error={jsonError}
					></textarea>
					{#if jsonError}
						<div class="error-message">
							{jsonError}
						</div>
					{/if}
				{/if}
			</div>
		</div>

		<!-- Right Panel - TypeScript Output -->
		<div class="panel output-panel">
			<div class="panel-header">
				<h3>TypeScript Types</h3>
				<div class="panel-actions">
					<button class="btn btn-primary" onclick={copyToClipboard} disabled={!generatedTypes}>
						{copySuccess ? 'Copied!' : 'Copy'}
					</button>
				</div>
			</div>
			<div class="panel-content">
				{#if generatedTypes}
					<div class="typescript-output">
						<pre><code>{@html highlightedTypes}</code></pre>
					</div>
				{:else}
					<div class="empty-state">
						<p>Enter valid JSON to generate TypeScript types</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.converter {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #fafafa;
	}

	.converter-header {
		padding: 2rem;
		text-align: center;
		background: white;
		border-bottom: 1px solid #e5e7eb;
	}

	.converter-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
	}

	.converter-header p {
		margin: 0;
		color: #6b7280;
		font-size: 1.125rem;
	}

	.converter-body {
		flex: 1;
		display: flex;
		min-height: 0;
	}

	.panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: white;
		border-right: 1px solid #e5e7eb;
	}

	.panel:last-child {
		border-right: none;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 2rem;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.panel-header h3 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
	}

	.panel-actions {
		display: flex;
		gap: 0.75rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 6px;
		border: 1px solid;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	.btn-primary:hover:not(:disabled) {
		background: #2563eb;
		border-color: #2563eb;
	}

	.btn-secondary {
		background: white;
		color: #374151;
		border-color: #d1d5db;
	}

	.btn-secondary:hover {
		background: #f9fafb;
		border-color: #9ca3af;
	}

	.panel-content {
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	.json-textarea {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		padding: 2rem;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
		resize: none;
		background: white;
		color: #1f2937;
	}

	.json-textarea.error {
		background: #fef2f2;
		border-left: 4px solid #ef4444;
	}

	.error-message {
		position: absolute;
		bottom: 1rem;
		left: 2rem;
		right: 2rem;
		background: #fef2f2;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 6px;
		border: 1px solid #fecaca;
		font-size: 0.875rem;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
	}

	.typescript-output {
		height: 100%;
		overflow: auto;
		padding: 2rem;
	}

	.typescript-output pre {
		margin: 0;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		color: #1f2937;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #9ca3af;
		font-size: 1rem;
	}

	/* Syntax Highlighting for TypeScript */
	:global(.syntax-keyword) {
		color: #1976d2; /* Blue for keywords */
		font-weight: 600;
	}

	:global(.syntax-type) {
		color: #388e3c; /* Green for types */
		font-weight: 500;
	}

	:global(.syntax-string) {
		color: #d32f2f; /* Red for strings */
	}

	:global(.syntax-comment) {
		color: #757575; /* Gray for comments */
		font-style: italic;
	}

	:global(.syntax-punctuation) {
		color: #424242; /* Dark gray for punctuation */
	}

	:global(.syntax-identifier) {
		color: #7b1fa2; /* Purple for identifiers */
	}

	.json-editor-container {
		height: 100%;
		overflow: auto;
		padding: 2rem;
		background: white;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.converter-body {
			flex-direction: column;
		}

		.panel {
			border-right: none;
			border-bottom: 1px solid #e5e7eb;
		}

		.panel:last-child {
			border-bottom: none;
		}

		.converter-header {
			padding: 1.5rem;
		}

		.converter-header h1 {
			font-size: 1.5rem;
		}

		.panel-header {
			padding: 1rem 1.5rem;
		}

		.json-textarea,
		.typescript-output {
			padding: 1.5rem;
		}
	}
</style>
