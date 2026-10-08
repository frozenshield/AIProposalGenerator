# AI Proposal Generator — Vue 3 + Inertia.js Frontend

A modern, responsive dashboard UI for generating commercial AI proposals built with **Vue 3 (Composition API)**, **Tailwind CSS**, **Inertia.js**, and **Pinia**.

---

## 🚀 Key Features

1. **Persistent Responsive Sidebar**:
   - Navigation links for **Dashboard**, **Clients**, **Catalog**, and **Proposals**.
   - Active route highlighting with brand accent bar.
   - Live AI Engine indicator (Gemini 1.5 Pro).
   - User profile badge & collapsible mobile drawer.

2. **Split Two-Column 'Create Proposal' Workspace**:
   - **Left Column (Multi-Step Form)**:
     - **Step 1: Client Selection**: Dropdown to select client accounts with instant company, role, contact, and address previews.
     - **Step 2: Catalog Items & Pricing**: Add catalog services and deliverables with dynamic **Quantity** and **Discount (%)** inputs, and automatic net price calculations.
     - **Step 3: AI Prompt Context**: Dedicated prompt context textarea (e.g., *"Pitch this as a cost-saving measure with an accelerated 6-month ROI"*), quick-select strategic angle chips, tone selectors, and the *"Generate Full Proposal"* CTA.
     - **Step 4: Review & Finalize**: Pre-dispatch verification checklist.
   - **Right Column (Real-time Document Preview)**:
     - Document canvas styled as a commercial paper proposal.
     - **Executive Summary**: Real-time preview with AI loading skeleton/shimmer state and inline editing.
     - **Scope of Work**: Structured phased deliverables, timeline badges, and AI loading indicators.
     - **Pricing Table**: Live itemized accounting table featuring unit rate, quantity, discount %, subtotal, bundled savings, and calculated tax & grand total.
     - Export tools: **Export PDF** (print view) and **Copy Markdown/Text**.

3. **Pinia State Management**:
   - Centralized reactive store at `src/stores/proposalStore.js`.
   - Manages clients, catalog directory, selected items, AI prompt context, generation loading flags, and live calculations (subtotal, discounts, tax, grand total).

---

## 🛠️ Project Structure

```
frontned/
├── index.html                           # HTML5 entrypoint with Google Fonts
├── vite.config.js                       # Vite + Vue plugin configuration
├── tailwind.config.js                   # Tailwind CSS theme customization
├── postcss.config.js                    # PostCSS plugins
├── src/
│   ├── assets/
│   │   └── main.css                     # Tailwind directives and AI shimmer animations
│   ├── stores/
│   │   └── proposalStore.js             # Pinia store for proposal & AI generation state
│   ├── Layouts/
│   │   └── AppLayout.vue                # Persistent sidebar layout (Dashboard, Clients, Catalog, Proposals)
│   ├── Components/
│   │   ├── Steps/
│   │   │   ├── ClientStep.vue           # Step 1: Client selection dropdown & preview
│   │   │   ├── CatalogStep.vue          # Step 2: Catalog items, quantity, discount inputs
│   │   │   ├── AiContextStep.vue        # Step 3: AI Prompt Context textarea & presets
│   │   │   └── ReviewStep.vue           # Step 4: Final verification checklist
│   │   └── ProposalPreview/
│   │       ├── DocumentPreview.vue      # Document canvas container & toolbar
│   │       ├── ExecutiveSummarySection.vue # Live Executive Summary with AI skeleton
│   │       ├── ScopeSection.vue         # Live Scope of Work with milestone cards
│   │       └── PricingTableSection.vue  # Live itemized calculation & totals table
│   ├── Pages/
│   │   ├── Proposals/
│   │   │   ├── Create.vue               # Main 'Create Proposal' split 2-column view
│   │   │   └── Index.vue                # Proposals directory
│   │   ├── Dashboard.vue                # Dashboard page
│   │   ├── Clients.vue                  # Clients directory page
│   │   └── Catalog.vue                  # Services & products catalog page
│   └── main.js                          # Inertia.js bootstrap + standalone dev fallback
```

---

## 💻 Running the Application

### 1. Standalone Development Server (Vite)
You can run and test the frontend immediately without a backend:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 2. Production Build
```bash
npm run build
```

### 3. Inertia.js Backend Integration (e.g. Laravel)
When paired with an Inertia.js backend:
- `src/main.js` automatically hooks into `createInertiaApp` when `data-page` exists on `#app`.
- Return the page from your Laravel controller:
  ```php
  return Inertia::render('Proposals/Create');
  ```

