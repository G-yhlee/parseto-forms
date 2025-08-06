<script lang="ts">
	// This file contains all UI components from typeEditor2 consolidated into one file
	// All logic has been removed, only HTML and CSS remain
</script>

<!-- Main Layout -->
<div class="type-editor-layout">
	<!-- Sidebar -->
	<div class="type-editor-sidebar">
		<!-- Header -->
		<div class="sidebar-header">
			<div class="header-title">
				<svg class="icon-database" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
					<path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
					<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
				</svg>
				<h2>Type Editor</h2>
			</div>
		</div>

		<!-- Collections Section -->
		<div class="sidebar-section">
			<button class="section-header">
				<svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
				<span>Collections</span>
				<span class="count">5</span>
			</button>

			<div class="sidebar-content">
				<div class="collection-list">
					<!-- Collection Item -->
					<div class="collection-group">
						<div class="collection-header">
							<button class="collection-item active">
								<div class="collection-icon">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
										<circle cx="9" cy="7" r="4"></circle>
										<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
										<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
									</svg>
								</div>
								<div class="collection-info">
									<div class="collection-name">users</div>
									<div class="collection-meta">
										<span class="collection-type">auth</span>
									</div>
								</div>
								<div class="active-indicator"></div>
							</button>
							<button class="pin-btn" title="Pin collection">📌</button>
							<button class="toggle-records-btn">
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>
						</div>

						<!-- Collection Records -->
						<div class="collection-records">
							<div class="records-list">
								<button class="record-item-mini active">
									<div class="record-preview-mini">John Doe</div>
									<div class="record-id-mini">abc123...</div>
									<div class="mini-active-indicator"></div>
								</button>
								<button class="record-item-mini">
									<div class="record-preview-mini">Jane Smith</div>
									<div class="record-id-mini">def456...</div>
								</button>
								<div class="records-more">+3 more records</div>
							</div>
						</div>
					</div>

					<!-- More Collection Items -->
					<div class="collection-group">
						<div class="collection-header">
							<button class="collection-item">
								<div class="collection-icon">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
										<path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
										<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
									</svg>
								</div>
								<div class="collection-info">
									<div class="collection-name">posts</div>
									<div class="collection-meta">
										<span class="collection-type">base</span>
									</div>
								</div>
							</button>
							<button class="pin-btn" title="Pin collection">📍</button>
							<button class="toggle-records-btn">
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content Area -->
	<main class="main-content">
		<!-- Record Sidebar -->
		<div class="record-sidebar">
			<div class="sidebar-header">
				<h3>Records</h3>
				<span class="record-count">5 items</span>
			</div>

			<div class="sidebar-content">
				<div class="record-list">
					<button class="record-item active">
						<div class="record-info">
							<div class="record-preview">John Doe</div>
							<div class="record-meta">
								<span class="record-id">ID: abc12345...</span>
								<span class="record-date">12/25/2024</span>
							</div>
						</div>
						<div class="active-indicator"></div>
					</button>
					<button class="record-item">
						<div class="record-info">
							<div class="record-preview">Jane Smith</div>
							<div class="record-meta">
								<span class="record-id">ID: def67890...</span>
								<span class="record-date">12/24/2024</span>
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>

		<!-- JSON Editor Area -->
		<div class="editor-content">
			<div class="json-editor">
				<span class="bracket">{</span>
				<div class="object-content">
					<div class="property">
						<div class="property-key">
							<span class="key-label">"id"</span>
							<span class="colon">:</span>
						</div>
						<span class="property-value">
							<span class="value-label string">"abc12345"</span>
						</span>
						<span class="comma">,</span>
					</div>
					<div class="property">
						<div class="property-key">
							<span class="key-label">"name"</span>
							<span class="colon">:</span>
						</div>
						<span class="property-value">
							<span class="value-label string">"John Doe"</span>
						</span>
						<span class="comma">,</span>
					</div>
					<div class="property">
						<div class="property-key">
							<span class="key-label">"email"</span>
							<span class="colon">:</span>
						</div>
						<span class="property-value">
							<span class="value-label string">"john@example.com"</span>
						</span>
						<span class="comma">,</span>
					</div>
					<div class="property">
						<div class="property-key">
							<span class="key-label">"age"</span>
							<span class="colon">:</span>
						</div>
						<span class="property-value">
							<span class="value-label number">30</span>
						</span>
						<span class="comma">,</span>
					</div>
					<div class="property">
						<div class="property-key">
							<span class="key-label">"active"</span>
							<span class="colon">:</span>
						</div>
						<span class="property-value">
							<span class="value-label boolean">true</span>
						</span>
						<span class="comma">,</span>
					</div>
					<div class="property">
						<div class="property-key">
							<span class="key-label">"metadata"</span>
							<span class="colon">:</span>
						</div>
						<span class="property-value">
							<span class="bracket">{</span>
							<div class="object-content">
								<div class="property">
									<div class="property-key">
										<span class="key-label">"created"</span>
										<span class="colon">:</span>
									</div>
									<span class="property-value">
										<span class="value-label string">"2024-12-25"</span>
									</span>
								</div>
							</div>
							<span class="bracket">}</span>
						</span>
					</div>
				</div>
				<span class="bracket">}</span>
			</div>
		</div>
	</main>
</div>

<!-- Collection Selector View -->
<div class="collection-selector">
	<div class="selector-header">
		<h1>Select Collection</h1>
		<p>Choose a collection to edit records and generate TypeScript types</p>
	</div>

	<div class="selector-content">
		<div class="collection-grid">
			<div class="collection-card pinned">
				<button class="pin-button" title="Unpin collection">📌</button>
				<div class="card-header">
					<div class="collection-icon">👤</div>
					<div class="collection-info">
						<h3 class="collection-name">users</h3>
						<p class="collection-id">ID: pb_users_auth</p>
					</div>
				</div>
				<div class="card-body">
					<div class="collection-meta">
						<span class="collection-type">auth</span>
						<span class="record-count">150 records</span>
					</div>
					<div class="schema-preview">
						<p class="schema-label">Fields:</p>
						<div class="field-tags">
							<span class="field-tag">name</span>
							<span class="field-tag">email</span>
							<span class="field-tag">avatar</span>
							<span class="field-tag more">+5</span>
						</div>
					</div>
				</div>
				<div class="card-footer">
					<span class="select-text">Click to edit records →</span>
				</div>
			</div>

			<div class="collection-card">
				<button class="pin-button" title="Pin collection">📍</button>
				<div class="card-header">
					<div class="collection-icon">📁</div>
					<div class="collection-info">
						<h3 class="collection-name">posts</h3>
						<p class="collection-id">ID: pb_posts_base</p>
					</div>
				</div>
				<div class="card-body">
					<div class="collection-meta">
						<span class="collection-type">base</span>
						<span class="record-count">1,234 records</span>
					</div>
					<div class="schema-preview">
						<p class="schema-label">Fields:</p>
						<div class="field-tags">
							<span class="field-tag">title</span>
							<span class="field-tag">content</span>
							<span class="field-tag">author</span>
							<span class="field-tag more">+8</span>
						</div>
					</div>
				</div>
				<div class="card-footer">
					<span class="select-text">Click to edit records →</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Layout Styles */
	.type-editor-layout {
		display: flex;
		height: 100vh;
		background: #fafafa;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		background: white;
	}

	/* Type Editor Sidebar Styles */
	.type-editor-sidebar {
		width: 320px;
		background: white;
		border-right: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.sidebar-header {
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.header-title h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
	}

	.sidebar-section {
		border-bottom: 1px solid #f3f4f6;
	}

	.section-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		background: none;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.section-header:hover {
		background: #f9fafb;
	}

	.count {
		margin-left: auto;
		background: #e5e7eb;
		color: #6b7280;
		padding: 0.125rem 0.375rem;
		border-radius: 10px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.sidebar-content {
		overflow-y: auto;
		flex: 1;
		max-height: calc(100vh - 150px);
	}

	.collection-list {
		padding: 0.5rem;
	}

	.collection-group {
		margin-bottom: 0.25rem;
	}

	.collection-header {
		display: flex;
		align-items: center;
	}

	.collection-item {
		flex: 1;
		text-align: left;
		background: none;
		border: none;
		padding: 0.75rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.pin-btn {
		flex-shrink: 0;
		background: none;
		border: none;
		padding: 0.375rem;
		border-radius: 4px;
		cursor: pointer;
		color: #6b7280;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
	}

	.pin-btn:hover {
		background: #f3f4f6;
		color: #374151;
		transform: scale(1.1);
	}

	.toggle-records-btn {
		flex-shrink: 0;
		background: none;
		border: none;
		padding: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		color: #6b7280;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.toggle-records-btn:hover {
		background: #f3f4f6;
		color: #374151;
	}

	.collection-item:hover {
		background: #f3f4f6;
	}

	.collection-item.active {
		background: #eff6ff;
		border: 1px solid #3b82f6;
	}

	.collection-icon {
		color: #6b7280;
		flex-shrink: 0;
	}

	.collection-info {
		flex: 1;
		min-width: 0;
	}

	.collection-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: #1f2937;
		margin-bottom: 0.25rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.collection-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.collection-type {
		font-size: 0.75rem;
		color: #6b7280;
		background: #f3f4f6;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		text-transform: uppercase;
		font-weight: 500;
	}

	.active-indicator {
		width: 6px;
		height: 6px;
		background: #3b82f6;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* Collection Records Styles */
	.collection-records {
		margin-left: 1rem;
		border-left: 2px solid #f3f4f6;
		padding-left: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.records-list {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.record-item-mini {
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		padding: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.75rem;
	}

	.record-item-mini:hover {
		background: #f9fafb;
	}

	.record-item-mini.active {
		background: #eff6ff;
		border: 1px solid #93c5fd;
	}

	.record-preview-mini {
		flex: 1;
		color: #374151;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 120px;
	}

	.record-id-mini {
		color: #9ca3af;
		font-size: 0.6875rem;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
	}

	.mini-active-indicator {
		width: 4px;
		height: 4px;
		background: #3b82f6;
		border-radius: 50%;
		flex-shrink: 0;
		margin-left: 0.25rem;
	}

	.records-more {
		padding: 0.25rem 0.5rem;
		color: #9ca3af;
		font-size: 0.6875rem;
		text-align: center;
		border-top: 1px solid #f3f4f6;
		margin-top: 0.25rem;
	}

	/* Record Sidebar Styles */
	.record-sidebar {
		width: 300px;
		height: 100vh;
		background: white;
		border-right: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
	}

	.record-sidebar .sidebar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.record-sidebar .sidebar-header h3 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
	}

	.record-count {
		font-size: 0.875rem;
		color: #6b7280;
		background: #e5e7eb;
		padding: 0.25rem 0.5rem;
		border-radius: 12px;
	}

	.record-list {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.record-item {
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		padding: 0.75rem;
		margin-bottom: 0.25rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.record-item:hover {
		background: #f3f4f6;
	}

	.record-item.active {
		background: #eff6ff;
		border: 1px solid #3b82f6;
	}

	.record-info {
		flex: 1;
		min-width: 0;
	}

	.record-preview {
		font-size: 0.875rem;
		font-weight: 500;
		color: #1f2937;
		margin-bottom: 0.25rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.record-meta {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.record-id,
	.record-date {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.record-sidebar .active-indicator {
		width: 8px;
		height: 8px;
		background: #3b82f6;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* JSON Editor Styles */
	.editor-content {
		flex: 1;
		padding: 2rem;
		overflow: auto;
	}

	.json-editor {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
		display: block;
	}

	.object-content {
		padding-left: 1.5rem;
		position: relative;
		display: block;
	}

	.property {
		display: block;
		position: relative;
	}

	.property-key {
		display: inline;
	}

	.key-label {
		color: #7b1fa2;
		cursor: pointer;
		padding: 0.125rem 0.25rem;
		border-radius: 3px;
		transition: background-color 0.2s;
	}

	.key-label:hover {
		background-color: rgba(123, 31, 162, 0.1);
	}

	.colon {
		color: #424242;
		margin-left: 0.25rem;
	}

	.value-label {
		cursor: pointer;
		padding: 0.125rem 0.25rem;
		border-radius: 3px;
		transition: background-color 0.2s;
	}

	.value-label:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.value-label.string {
		color: #d32f2f;
	}

	.value-label.number {
		color: #1976d2;
	}

	.value-label.boolean {
		color: #f57c00;
	}

	.value-label.null {
		color: #757575;
	}

	.comma {
		color: #424242;
		display: inline;
	}

	.bracket {
		color: #424242;
		font-weight: bold;
		font-size: 1rem;
		display: block;
	}

	/* Collection Selector Styles */
	.collection-selector {
		min-height: 100vh;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		flex-direction: column;
	}

	.selector-header {
		text-align: center;
		margin-bottom: 3rem;
		color: white;
	}

	.selector-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.selector-header p {
		font-size: 1.125rem;
		opacity: 0.9;
		margin: 0;
		max-width: 600px;
		margin: 0 auto;
	}

	.selector-content {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.collection-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
		width: 100%;
		max-width: 1200px;
	}

	.collection-card {
		background: white;
		border: none;
		border-radius: 12px;
		padding: 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;
	}

	.collection-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	}

	.collection-card.pinned {
		border: 2px solid #667eea;
		box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
	}

	.collection-card.pinned:hover {
		box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
	}

	.pin-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 1.25rem;
		z-index: 10;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.pin-button:hover {
		background: #f3f4f6;
		border-color: #d1d5db;
		transform: scale(1.1);
	}

	.collection-card.pinned .pin-button {
		background: #667eea;
		border-color: #667eea;
	}

	.collection-card.pinned .pin-button:hover {
		background: #5a67d8;
		border-color: #5a67d8;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.card-header .collection-icon {
		font-size: 2rem;
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea, #764ba2);
		border-radius: 12px;
		color: white;
	}

	.collection-info {
		flex: 1;
	}

	.collection-info .collection-name {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 0.25rem 0;
	}

	.collection-id {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
	}

	.card-body {
		flex: 1;
	}

	.card-body .collection-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.card-body .collection-type {
		background: #e5e7eb;
		color: #374151;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
	}

	.card-body .record-count {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.schema-preview {
		margin-top: 1rem;
	}

	.schema-label {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0 0 0.5rem 0;
	}

	.field-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.field-tag {
		background: #f3f4f6;
		color: #374151;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.field-tag.more {
		background: #667eea;
		color: white;
	}

	.card-footer {
		border-top: 1px solid #f3f4f6;
		padding-top: 1rem;
		margin-top: 1rem;
	}

	.select-text {
		color: #667eea;
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Utility Classes */
	.loading-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.5rem;
		text-align: center;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #f3f4f6;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 0.5rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-state p,
	.empty-state p {
		color: #6b7280;
		font-size: 0.875rem;
		margin: 0;
	}

	/* Icons */
	.icon-database,
	.chevron-icon {
		color: #6b7280;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.type-editor-sidebar {
			width: 100%;
			height: auto;
			max-height: 50vh;
		}

		.sidebar-content {
			max-height: 300px;
		}

		.type-editor-layout {
			flex-direction: column;
		}

		.record-sidebar {
			width: 100%;
			height: auto;
			max-height: 300px;
		}

		.collection-selector {
			padding: 1rem;
		}

		.selector-header h1 {
			font-size: 2rem;
		}

		.collection-grid {
			grid-template-columns: 1fr;
		}

		.collection-card {
			padding: 1rem;
		}
	}
</style>