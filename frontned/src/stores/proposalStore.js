import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'

export const useProposalStore = defineStore('proposal', () => {
  const toast = useToast()

  // Navigation / Stepper State
  const currentStep = ref(1)

  // Currency configuration: Philippine Pesos (PHP / ₱)
  const currencySymbol = ref('₱')
  const currencyCode = ref('PHP')

  function formatCurrency(val) {
    const num = Number(val || 0)
    return `${currencySymbol.value}${num.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Database-backed Clients Directory (Scoped to authenticated tenant)
  const clients = ref([])

  // Database-backed Master Service & Deliverables Catalog (Scoped to authenticated tenant)
  const catalog = ref([])

  // Database-backed Reference Options: AI Strategic Angles (Prompt Presets)
  const promptPresets = ref([
    {
      key: 'cost_saving',
      label: 'Cost-Saving & High ROI',
      text: 'Pitch this as a decisive cost-saving measure with an accelerated 6-month ROI. Highlight automated operational efficiencies, reduced manual labor overhead by 42%, and zero-downtime cloud migration guarantee in Philippine Pesos (PHP).',
      badge: 'Most Popular',
    },
    {
      key: 'speed_to_market',
      label: 'Speed-to-Market & Agility',
      text: 'Frame this proposal around aggressive time-to-value. Emphasize that modular AI pipelines allow rapid feature launches in weeks instead of quarters, outpacing key market rivals.',
      badge: 'High Conversion',
    },
    {
      key: 'security_compliance',
      label: 'Security & Enterprise Compliance',
      text: 'Prioritize bank-grade data security, strict SOC2 Type II compliance, on-premise model deployment options, and isolated tenant architectures to mitigate all cyber risks.',
      badge: 'Enterprise',
    },
    {
      key: 'modernization',
      label: 'Modernization & Scalability',
      text: 'Highlight legacy system refactoring into cloud-native microservices. Position this as an investment in sustainable technical equity and multi-year scalability.',
      badge: null,
    },
    {
      key: 'ai_multiplier',
      label: 'AI Productivity Multiplier',
      text: 'Demonstrate how autonomous agent orchestration augments internal teams, doubling deliverable output while maintaining rigorous quality checks.',
      badge: 'AI Ops',
    },
  ])

  // Database-backed Reference Options: AI Tones
  const aiTones = ref([
    { key: 'persuasive', label: 'Persuasive & High ROI', badge: 'Default' },
    { key: 'cost-saving', label: 'Cost-Saving & Lean Ops', badge: null },
    { key: 'formal', label: 'Corporate & Formal', badge: null },
    { key: 'technical', label: 'Technical & Architecture Deep Dive', badge: null },
    { key: 'executive', label: 'C-Suite Executive Pitch', badge: 'Executive' },
  ])

  // Database-backed Reference Options: AI Models
  const aiModels = ref([
    { key: 'Gemini Flash-Lite', label: 'Gemini Flash-Lite', badge: 'Default (Ultra Fast)' },
    { key: 'Gemini 1.5 Flash', label: 'Gemini 1.5 Flash', badge: 'Multimodal' },
    { key: 'Gemini 1.5 Pro', label: 'Gemini 1.5 Pro', badge: 'Pro Tier' },
    { key: 'Gemini 2.5 Pro', label: 'Gemini 2.5 Pro', badge: 'Enterprise RAG' },
  ])

  // Database-backed Reference Options: Industries
  const industries = ref([
    'E-Commerce & Retail',
    'Financial Services & FinTech',
    'Healthcare & Biotech',
    'Supply Chain & Logistics',
    'Telecommunications & ICT',
  ])

  // Selected Proposal Configuration
  const selectedClientId = ref(null)
  
  const selectedItems = ref([])

  // Check persistent auth status for seamless Pro detection
  let initialIsSubscribed = false
  let initialProposalsCount = 0
  let initialUserName = 'Elena Vance, Lead Architect'

  try {
    const savedUser = localStorage.getItem('proposal_user')
    if (savedUser) {
      const u = JSON.parse(savedUser)
      if (u.is_subscribed || u.subscription_tier === 'pro' || u.role === 'admin' || u.email === 'admin@aiproposals.io') {
        initialIsSubscribed = true
      }
      initialProposalsCount = Number(u.proposals_count || 0)
      if (u.name) initialUserName = `${u.name}, Lead Architect`
    }
  } catch (e) {}

  try {
    const appEl = document.getElementById('app')
    if (appEl?.dataset?.page) {
      const pageData = JSON.parse(appEl.dataset.page)
      const u = pageData?.props?.auth?.user
      if (u) {
        if (u.is_subscribed || u.subscription_tier === 'pro' || u.role === 'admin' || u.email === 'admin@aiproposals.io') {
          initialIsSubscribed = true
        }
        initialProposalsCount = Number(u.proposals_count || 0)
        if (u.name) initialUserName = `${u.name}, Lead Architect`
      }
    }
  } catch (e) {}

  // AI Prompt Context & Parameters
  const isSubscribed = ref(initialIsSubscribed)
  const activeAiModel = ref(initialIsSubscribed ? 'Gemini 1.5 Pro' : 'Gemini Flash-Lite')
  const proposalsCount = ref(initialProposalsCount) // Freemium tracking
  const freeLimit = ref(3)
  const isSubscriptionModalOpen = ref(false)
  const subscriptionError = ref('You have reached the free limit of 3 proposals. Upgrade to Pro for unlimited AI generations.')

  const aiPromptContext = ref(
    'Pitch this as a decisive cost-saving measure with an accelerated 6-month ROI. Highlight automated operational efficiencies, reduced manual labor overhead by 42%, and zero-downtime cloud migration guarantee in Philippine Pesos (PHP).'
  )
  const aiTone = ref('persuasive')
  const targetAudience = ref('C-Suite & Executive Leadership')
  const proposalTitle = ref('Strategic AI Modernization & Cost Optimization Proposal')
  const proposalNumber = ref('PROP-2026-884')
  const validDays = ref(30)
  const taxRate = ref(12.0) // Philippine EVAT 12%

  // Editable Document Canvas Header & Terms
  const companyName = ref('RLG Solutions')
  const companyTagline = ref('Autonomous AI & Cloud Architecture Consultancy')
  const companyAddress = ref('BGC, Taguig City, Metro Manila • Singapore')
  const issueDate = ref(new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()))
  const validUntilDate = ref(
    new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    )
  )
  const representativeName = ref(initialUserName)
  const representativeCompany = ref('RLG Enterprise Solutions Inc.')
  const clientSignerName = ref('Sign & date upon authorization')

  // E-Signature State
  const authorSignature = ref(null) // Data URL or text svg
  const authorSignatureType = ref('drawn') // 'drawn', 'typed', 'uploaded'
  const authorSignatureVerifiedAt = ref(null)
  const clientSignature = ref(null)

  function setAuthorSignature(signatureData, type = 'drawn') {
    authorSignature.value = signatureData
    authorSignatureType.value = type
    authorSignatureVerifiedAt.value = new Date().toISOString()
  }

  function clearAuthorSignature() {
    authorSignature.value = null
    authorSignatureVerifiedAt.value = null
  }

  function syncUser(userData) {
    if (!userData) return
    if (userData.is_subscribed || userData.subscription_tier === 'pro' || userData.role === 'admin' || userData.email === 'admin@aiproposals.io') {
      isSubscribed.value = true
      activeAiModel.value = 'Gemini 1.5 Pro'
    }
    proposalsCount.value = Number(userData.proposals_count || 0)
    if (userData.name) {
      representativeName.value = `${userData.name}, Lead Architect`
    }
  }

  // Freemium limit computation
  const hasReachedLimit = computed(() => {
    if (isSubscribed.value) return false
    return proposalsCount.value >= freeLimit.value
  })

  // AI Generation Loading States
  const isGenerating = ref({
    executiveSummary: false,
    scope: false,
    full: false,
  })

  // Generated Proposal Sections Content
  const sections = ref({
    executiveSummary: `In today's fast-moving market, organizations face mounting operational expenses alongside increasing customer expectations. This proposal presents a turnkey AI modernization and cloud transformation architecture specifically calibrated for Apex Retail Solutions Philippines.

By replacing fragmented manual oversight with intelligent autonomous workflows and high-efficiency containerized infrastructure, this initiative is engineered as a definitive cost-saving measure. Projected outcomes indicate an estimated 42% reduction in recurring administrative overhead, a 3.4x throughput increase, and an accelerated return on investment (ROI) within 6 months of initial deployment.`,
    
    scope: [
      {
        title: 'Phase 1: Architecture Discovery & Agent Orchestration',
        description: 'Comprehensive workflow mapping, legacy database connection audits, and initial deployment of autonomous agent pipeline to automate Tier-1 administrative requests.',
        duration: 'Weeks 1 – 3',
        deliverable: 'Agent Pipeline Blueprint & Initial Staging Deploy',
      },
      {
        title: 'Phase 2: Cloud Modernization & Resilience Hardening',
        description: 'Multi-region Kubernetes migration with zero-downtime failover, automated scaling policies, and automated cost optimization sweeps to curtail idle compute expenditure.',
        duration: 'Weeks 4 – 7',
        deliverable: 'Production Migration & Automated Infra Benchmarks',
      },
      {
        title: 'Phase 3: Integration, UAT & Enterprise SLA Onboarding',
        description: 'Final security penetration audits, personnel training workshops, and initiation of our 24/7 dedicated SRE monitoring protocol with 15-minute response SLA.',
        duration: 'Weeks 8 – 10',
        deliverable: 'Final Production Handover & 24/7 Monitoring Activation',
      },
    ],

    pricingNotes: 'All rates are quoted in Philippine Pesos (PHP ₱) exclusive of 12% EVAT and fixed for 30 calendar days from issuance. Invoices are distributed on a milestone completion schedule (40% initiation, 30% Phase 2 sign-off, 30% final deployment). Dedicated support billed monthly in arrears.',
  })

  // Getters & Computed Calculations
  const selectedClient = computed(() => {
    return clients.value.find((c) => String(c.id) === String(selectedClientId.value)) || clients.value[0] || {}
  })

  const subtotal = computed(() => {
    return selectedItems.value.reduce((sum, item) => {
      return sum + (Number(item.unitPrice) * Number(item.quantity))
    }, 0)
  })

  const totalDiscountAmount = computed(() => {
    return selectedItems.value.reduce((sum, item) => {
      const lineTotal = Number(item.unitPrice) * Number(item.quantity)
      const discountVal = lineTotal * ((Number(item.discount) || 0) / 100)
      return sum + discountVal
    }, 0)
  })

  const discountedSubtotal = computed(() => {
    return Math.max(0, subtotal.value - totalDiscountAmount.value)
  })

  const taxAmount = computed(() => {
    return (discountedSubtotal.value * Number(taxRate.value)) / 100
  })

  const grandTotal = computed(() => {
    return discountedSubtotal.value + taxAmount.value
  })

  const formattedGrandTotal = computed(() => {
    return formatCurrency(grandTotal.value)
  })

  // Synchronization with Database Reference Options API
  async function fetchReferences() {
    try {
      const res = await fetch('/api/reference-options', {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) return

      const data = await res.json()
      if (data.clients && data.clients.length) {
        clients.value = data.clients.map(c => ({
          ...c,
          id: c.id,
          company: c.company || c.name,
        }))
        if (!clients.value.some(c => String(c.id) === String(selectedClientId.value))) {
          selectedClientId.value = clients.value[0]?.id
        }
      }

      if (data.catalog_items && data.catalog_items.length) {
        catalog.value = data.catalog_items.map(i => ({
          ...i,
          unitPrice: Number(i.unit_price || i.unitPrice || 0),
          defaultQuantity: i.default_quantity || i.defaultQuantity || 1,
        }))
      }

      if (data.strategic_angles && data.strategic_angles.length) {
        promptPresets.value = data.strategic_angles.map(a => ({
          key: a.key,
          label: a.label,
          text: a.value,
          badge: a.badge,
        }))
      }

      if (data.ai_tones && data.ai_tones.length) {
        aiTones.value = data.ai_tones.map(t => ({
          key: t.key || t.value,
          label: t.label,
          badge: t.badge,
        }))
      }

      if (data.ai_models && data.ai_models.length) {
        aiModels.value = data.ai_models.map(m => ({
          key: m.label || m.key,
          label: m.label,
          badge: m.badge,
        }))
      }

      if (data.industries && data.industries.length) {
        industries.value = data.industries.map(ind => ind.label || ind.value)
      }

      if (data.currency?.symbol) {
        currencySymbol.value = data.currency.symbol
        currencyCode.value = data.currency.code
      }
    } catch (e) {
      // Graceful fallback to initial values if network/server is unavailable
    }
  }

  async function fetchClients() {
    try {
      const res = await fetch('/api/clients', {
        headers: { 'Accept': 'application/json' },
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.clients)) {
          clients.value = data.clients
        }
      }
    } catch (e) {}
  }

  async function fetchCatalog() {
    try {
      const res = await fetch('/api/catalog', {
        headers: { 'Accept': 'application/json' },
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.catalog)) {
          catalog.value = data.catalog.map(i => ({
            ...i,
            unitPrice: Number(i.unit_price || i.unitPrice || 0),
            defaultQuantity: Number(i.default_quantity || i.defaultQuantity || 1),
          }))
        }
      }
    } catch (e) {}
  }

  // Auto-fetch on setup
  fetchReferences()

  // Actions
  function setStep(step) {
    currentStep.value = step
  }

  function nextStep() {
    if (currentStep.value < 4) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  function selectClient(clientId) {
    selectedClientId.value = clientId
  }

  function addCatalogItem(catalogItem) {
    const existing = selectedItems.value.find((i) => i.catalogId === catalogItem.id)
    if (existing) {
      existing.quantity++
      toast.info(`Increased quantity for ${catalogItem.name}`, 'Catalog Updated')
    } else {
      selectedItems.value.push({
        id: `item-${Date.now()}`,
        catalogId: catalogItem.id,
        name: catalogItem.name,
        description: catalogItem.description,
        category: catalogItem.category,
        unitPrice: Number(catalogItem.unitPrice || catalogItem.unit_price || 0),
        quantity: catalogItem.defaultQuantity || catalogItem.default_quantity || 1,
        discount: 0,
      })
      toast.success(`Added ${catalogItem.name} to proposal in ₱`, 'Item Added')
    }
  }

  function removeSelectedItem(itemId) {
    const idx = selectedItems.value.findIndex((i) => i.id === itemId)
    if (idx > -1) {
      const removed = selectedItems.value[idx]
      selectedItems.value.splice(idx, 1)
      toast.info(`Removed ${removed?.name || 'item'}`, 'Item Removed')
    }
  }

  function updateItem(itemId, field, value) {
    const item = selectedItems.value.find((i) => i.id === itemId)
    if (item) {
      item[field] = value
    }
  }

  function triggerLimitReached(message = '') {
    if (message) {
      subscriptionError.value = message
    }
    isSubscriptionModalOpen.value = true
    toast.warning('Free limit reached (3 proposals). Upgrade to Pro to continue.', 'Limit Reached')
  }

  function closeSubscriptionModal() {
    isSubscriptionModalOpen.value = false
  }

  function upgradeToPro() {
    isSubscribed.value = true
    activeAiModel.value = 'Gemini 1.5 Pro'
    isSubscriptionModalOpen.value = false
    subscriptionError.value = ''
    toast.success('Upgraded to Pro! Gemini 1.5 Pro and unlimited AI proposals unlocked.', 'Upgrade Successful')
  }

  // AI Generation Simulation with Freemium Quota Enforcement
  async function generateExecutiveSummary() {
    if (!isSubscribed.value && hasReachedLimit.value) {
      triggerLimitReached('Free tier limit reached (3/3 proposals). Upgrade to Pro to generate executive summaries.')
      return false
    }

    isGenerating.value.executiveSummary = true
    await new Promise((resolve) => setTimeout(resolve, 1200))
    
    const client = selectedClient.value
    const toneNote = aiTone.value === 'technical' 
      ? 'emphasizing architectural precision and latency benchmarks'
      : aiTone.value === 'cost-saving'
      ? 'centered upon immediate bottom-line impact, reduced overhead by 42%, and accelerated payback in Philippine Pesos (₱)'
      : 'tailored for C-Suite and executive decision makers'

    sections.value.executiveSummary = `Prepared exclusively for ${client.name || 'Executive Leadership'} and the management team at ${client.company || 'your organization'}, this proposal details a high-impact solution designed to address core operational challenges within the ${client.industry || 'enterprise'} sector.

Guided by your strategic mandate—"${aiPromptContext.value}"—our solution delivers an enterprise-grade transformation ${toneNote}. Through automated orchestration and purpose-built infrastructure enhancements, ${client.company || 'the enterprise'} can capture immediate operational efficiencies, curtail manual error rates by up to 85%, and solidify a measurable competitive advantage within standard fiscal milestones.`
    
    isGenerating.value.executiveSummary = false
    toast.success('Executive Summary generated by Gemini AI in Philippine Pesos (₱)!', 'AI Synthesis Complete')
    return true
  }

  async function generateScope() {
    if (!isSubscribed.value && hasReachedLimit.value) {
      triggerLimitReached('Free tier limit reached (3/3 proposals). Upgrade to Pro to generate technical scopes.')
      return false
    }

    isGenerating.value.scope = true
    await new Promise((resolve) => setTimeout(resolve, 1300))

    const client = selectedClient.value
    const topItem = selectedItems.value[0]?.name || 'Autonomous Transformation Architecture'

    sections.value.scope = [
      {
        title: `Phase 1: Deep Discovery & Technical Alignment (${client.company || 'Client Organization'})`,
        description: `Audit current workflows, catalog legacy integrations, and establish custom evaluation metrics aligned with the AI mandate: "${aiPromptContext.value.slice(0, 80)}..."`,
        duration: 'Sprint 1 (Weeks 1 – 2)',
        deliverable: 'Solution Architecture Document & Threat Model Assessment',
      },
      {
        title: `Phase 2: Core Implementation (${topItem})`,
        description: `Engineered staging deployment with automated testing, CI/CD pipelines, and high-throughput connector bridges into ${client.company || 'client'}'s primary production systems.`,
        duration: 'Sprint 2 – 3 (Weeks 3 – 6)',
        deliverable: 'Staging Environment Verification & Performance Benchmarking',
      },
      {
        title: 'Phase 3: Production Rollout, Governance & Staff Enablement',
        description: 'Zero-downtime cutover execution, comprehensive Philippine compliance sign-off (NPC DPA 2012), and full activation of continuous monitoring telemetry.',
        duration: 'Sprint 4 (Weeks 7 – 8)',
        deliverable: 'Production Sign-off, Runbooks & Dedicated SLA Handover',
      },
    ]

    isGenerating.value.scope = false
    toast.success('Project Scope and milestones generated by Gemini AI!', 'AI Scope Ready')
    return true
  }

  async function generateFullProposal() {
    if (!isSubscribed.value && hasReachedLimit.value) {
      triggerLimitReached('Free tier limit reached (3/3 proposals). Upgrade to Pro to generate full proposals.')
      return false
    }

    isGenerating.value.full = true
    isGenerating.value.executiveSummary = true
    isGenerating.value.scope = true

    await Promise.all([
      generateExecutiveSummary(),
      generateScope(),
    ])

    isGenerating.value.full = false
    toast.success('Full proposal drafted with Philippine Peso pricing (₱)!', 'Proposal Ready')
    return true
  }

  // Directory of all generated proposals (All formatted in Philippine Pesos ₱)
  const proposalsList = ref([
    {
      id: 'PROP-2026-884',
      title: 'Strategic AI Modernization & Cost Optimization Proposal',
      clientId: 1,
      clientName: 'Sarah Jenkins',
      clientCompany: 'Apex Retail Solutions Philippines',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      industry: 'E-Commerce & Retail',
      status: 'Drafting',
      total: 376540.00,
      itemCount: 3,
      date: 'Oct 08, 2026',
      aiScore: '98%',
      aiAngle: 'Cost-Saving Focus & ROI',
      aiSummary: 'Turnkey AI modernization reducing recurring operational overhead by 42% with guaranteed 6-month ROI in PHP.',
    },
    {
      id: 'PROP-2026-883',
      title: 'Autonomous Healthcare Pipeline & SOC2 Hardening',
      clientId: 2,
      clientName: 'David Chen',
      clientCompany: 'OmniHealth Technologies Asia',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      industry: 'Healthcare & Biotech',
      status: 'Sent',
      total: 642000.00,
      itemCount: 4,
      date: 'Oct 05, 2026',
      aiScore: '94%',
      aiAngle: 'Security & Compliance',
      aiSummary: 'HIPAA and SOC2 compliance automation and microservices zero-downtime failover architecture.',
    },
    {
      id: 'PROP-2026-882',
      title: 'FinTech Cloud Infrastructure Resilience Sprint',
      clientId: 3,
      clientName: 'Elena Rostova',
      clientCompany: 'FinVanguard Global Capital',
      clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      industry: 'Financial Services',
      status: 'Approved',
      total: 1120000.00,
      itemCount: 5,
      date: 'Oct 02, 2026',
      aiScore: '99%',
      aiAngle: 'Speed-to-Market',
      aiSummary: 'High-frequency transaction streaming engine and multi-cloud disaster recovery.',
    },
    {
      id: 'PROP-2026-881',
      title: 'Supply Chain Automated Dispatcher Model',
      clientId: 4,
      clientName: 'Marcus Sterling',
      clientCompany: 'LogiFlow Supply Chain Corp',
      clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      industry: 'Supply Chain & Logistics',
      status: 'In Review',
      total: 485000.00,
      itemCount: 3,
      date: 'Sep 28, 2026',
      aiScore: '91%',
      aiAngle: 'Cost-Saving Focus',
      aiSummary: 'Automated fleet dispatch routing reducing fuel overhead by 18% in logistics operations.',
    },
    {
      id: 'PROP-2026-879',
      title: 'Legacy Database to Distributed Snowflake Migration',
      clientId: 1,
      clientName: 'Sarah Jenkins',
      clientCompany: 'Apex Retail Solutions Philippines',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      industry: 'E-Commerce & Retail',
      status: 'Archived',
      total: 248000.00,
      itemCount: 2,
      date: 'Sep 15, 2026',
      aiScore: '89%',
      aiAngle: 'Modernization',
      aiSummary: 'Automated data pipelines with zero data loss validation and modern lakehouse tooling.',
    },
  ])

  function deleteProposal(id) {
    const idx = proposalsList.value.findIndex((p) => p.id === id)
    if (idx > -1) {
      proposalsList.value.splice(idx, 1)
      toast.info(`Deleted proposal ${id}`, 'Proposal Removed')
    }
  }

  function duplicateProposal(id) {
    const original = proposalsList.value.find((p) => p.id === id)
    if (original) {
      const copy = {
        ...original,
        id: `PROP-2026-${Math.floor(885 + Math.random() * 100)}`,
        title: `${original.title} (Copy)`,
        status: 'Drafting',
        date: 'Just now',
      }
      proposalsList.value.unshift(copy)
      toast.success(`Duplicated ${copy.id}`, 'Proposal Duplicated')
    }
  }

  function resetProposal() {
    currentStep.value = 1
    selectedClientId.value = clients.value[0]?.id || 1
    selectedItems.value = []
    sections.value.executiveSummary = ''
    sections.value.scope = []
    toast.info('Proposal builder reset.', 'Reset Form')
  }

  return {
    // State
    currentStep,
    currencySymbol,
    currencyCode,
    clients,
    catalog,
    promptPresets,
    aiTones,
    aiModels,
    industries,
    selectedClientId,
    selectedItems,
    aiPromptContext,
    aiTone,
    targetAudience,
    proposalTitle,
    proposalNumber,
    validDays,
    taxRate,
    isGenerating,
    sections,
    proposalsList,
    activeAiModel,
    isSubscribed,
    proposalsCount,
    freeLimit,
    isSubscriptionModalOpen,
    subscriptionError,
    
    // Document Canvas Metadata
    companyName,
    companyTagline,
    companyAddress,
    issueDate,
    validUntilDate,
    representativeName,
    representativeCompany,
    clientSignerName,

    // E-Signature State
    authorSignature,
    authorSignatureType,
    authorSignatureVerifiedAt,
    clientSignature,
    setAuthorSignature,
    clearAuthorSignature,
    syncUser,

    // Getters
    hasReachedLimit,
    selectedClient,
    subtotal,
    totalDiscountAmount,
    discountedSubtotal,
    taxAmount,
    grandTotal,
    formattedGrandTotal,
    
    // Actions
    formatCurrency,
    fetchReferences,
    fetchClients,
    fetchCatalog,
    setStep,
    nextStep,
    prevStep,
    selectClient,
    addCatalogItem,
    removeSelectedItem,
    updateItem,
    generateExecutiveSummary,
    generateScope,
    generateFullProposal,
    resetProposal,
    deleteProposal,
    duplicateProposal,
    triggerLimitReached,
    closeSubscriptionModal,
    upgradeToPro,
  }
})
