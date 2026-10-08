import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProposalStore = defineStore('proposal', () => {
  // Navigation / Stepper State
  const currentStep = ref(1)

  // Pre-configured Mock Clients
  const clients = ref([
    {
      id: 'client-1',
      name: 'Sarah Jenkins',
      company: 'Apex Retail Solutions',
      role: 'Chief Technology Officer',
      email: 's.jenkins@apexretail.io',
      phone: '+1 (555) 349-8821',
      industry: 'E-Commerce & Retail',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      address: '742 Evergreen Blvd, San Francisco, CA 94107',
    },
    {
      id: 'client-2',
      name: 'David Chen',
      company: 'OmniHealth Technologies',
      role: 'VP of Digital Transformation',
      email: 'd.chen@omnihealth.org',
      phone: '+1 (555) 782-9903',
      industry: 'Healthcare & Biotech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      address: '120 Innovation Way, Boston, MA 02110',
    },
    {
      id: 'client-3',
      name: 'Elena Rostova',
      company: 'FinVanguard Global',
      role: 'Director of Strategic Ops',
      email: 'elena.r@finvanguard.com',
      phone: '+1 (555) 912-3456',
      industry: 'Financial Services & FinTech',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      address: '350 Park Ave, New York, NY 10022',
    },
    {
      id: 'client-4',
      name: 'Marcus Sterling',
      company: 'LogiFlow Supply Corp',
      role: 'Chief Operating Officer',
      email: 'msterling@logiflow.net',
      phone: '+1 (555) 438-2190',
      industry: 'Supply Chain & Logistics',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      address: '880 Logistics Parkway, Chicago, IL 60607',
    },
  ])

  // Master Service & Product Catalog
  const catalog = ref([
    {
      id: 'cat-1',
      name: 'AI Automated Workflow Engine',
      description: 'End-to-end autonomous agent workflow pipeline integration with existing ERP/CRM.',
      category: 'Artificial Intelligence',
      unitPrice: 12500,
      unit: 'Deployment',
      defaultQuantity: 1,
    },
    {
      id: 'cat-2',
      name: 'Enterprise Cloud Modernization',
      description: 'Zero-downtime microservices containerization, multi-cloud failover, and infra optimization.',
      category: 'Cloud Architecture',
      unitPrice: 18000,
      unit: 'Phase',
      defaultQuantity: 1,
    },
    {
      id: 'cat-3',
      name: 'Custom Domain LLM Fine-Tuning',
      description: 'Proprietary dataset ingestion, safety evaluation guardrails, and on-premise private deployment.',
      category: 'Machine Learning',
      unitPrice: 9500,
      unit: 'Model Package',
      defaultQuantity: 1,
    },
    {
      id: 'cat-4',
      name: 'Security & Compliance Audit Suite',
      description: 'SOC2 Type II, HIPAA, and GDPR automated threat vector inspection and hardening.',
      category: 'Cybersecurity',
      unitPrice: 6200,
      unit: 'Audit Report',
      defaultQuantity: 1,
    },
    {
      id: 'cat-5',
      name: 'Next-Gen UX/UI Product Redesign',
      description: 'Human-centric responsive design system, WCAG AA accessibility, interactive prototypes.',
      category: 'Product Design',
      unitPrice: 7800,
      unit: 'Sprint (2 Wks)',
      defaultQuantity: 2,
    },
    {
      id: 'cat-6',
      name: '24/7 Dedicated Support SLA & SRE',
      description: '15-minute response guarantee, continuous health telemetry, and dedicated solutions architect.',
      category: 'Managed Services',
      unitPrice: 2400,
      unit: 'Month',
      defaultQuantity: 3,
    },
  ])

  // Selected Proposal Configuration
  const selectedClientId = ref('client-1')
  
  const selectedItems = ref([
    {
      id: 'item-1',
      catalogId: 'cat-1',
      name: 'AI Automated Workflow Engine',
      description: 'End-to-end autonomous agent workflow pipeline integration with existing ERP/CRM.',
      category: 'Artificial Intelligence',
      unitPrice: 12500,
      quantity: 1,
      discount: 10, // 10%
    },
    {
      id: 'item-2',
      catalogId: 'cat-2',
      name: 'Enterprise Cloud Modernization',
      description: 'Zero-downtime microservices containerization, multi-cloud failover, and infra optimization.',
      category: 'Cloud Architecture',
      unitPrice: 18000,
      quantity: 1,
      discount: 5, // 5%
    },
    {
      id: 'item-3',
      catalogId: 'cat-6',
      name: '24/7 Dedicated Support SLA & SRE',
      description: '15-minute response guarantee, continuous health telemetry, and dedicated solutions architect.',
      category: 'Managed Services',
      unitPrice: 2400,
      quantity: 3,
      discount: 0,
    },
  ])

  // AI Prompt Context & Parameters
  const aiPromptContext = ref(
    'Pitch this as an executive cost-saving measure with an accelerated 6-month ROI. Highlight automated operational efficiencies, reduced manual labor overhead by 42%, and zero-downtime cloud migration guarantee.'
  )
  const aiTone = ref('persuasive') // 'persuasive', 'formal', 'technical', 'executive'
  const targetAudience = ref('C-Suite & Executive Leadership')
  const proposalTitle = ref('Strategic AI Modernization & Cost Optimization Proposal')
  const proposalNumber = ref('PROP-2026-884')
  const validDays = ref(30)
  const taxRate = ref(8.5) // percentage

  // AI Generation Loading States
  const isGenerating = ref({
    executiveSummary: false,
    scope: false,
    full: false,
  })

  // Generated Proposal Sections Content
  const sections = ref({
    executiveSummary: `In today's fast-moving market, organizations face mounting operational expenses alongside increasing customer expectations. This proposal presents a turnkey AI modernization and cloud transformation architecture specifically calibrated for Apex Retail Solutions.

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

    pricingNotes: 'All rates are quoted in USD and fixed for 30 calendar days from issuance. Invoices are distributed on a milestone completion schedule (40% initiation, 30% Phase 2 sign-off, 30% final deployment). Dedicated support billed monthly in arrears.',
  })

  // Getters & Computed Calculations
  const selectedClient = computed(() => {
    return clients.value.find((c) => c.id === selectedClientId.value) || clients.value[0]
  })

  const subtotal = computed(() => {
    return selectedItems.value.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity)
    }, 0)
  })

  const totalDiscountAmount = computed(() => {
    return selectedItems.value.reduce((sum, item) => {
      const lineTotal = item.unitPrice * item.quantity
      const discountVal = lineTotal * ((item.discount || 0) / 100)
      return sum + discountVal
    }, 0)
  })

  const discountedSubtotal = computed(() => {
    return Math.max(0, subtotal.value - totalDiscountAmount.value)
  })

  const taxAmount = computed(() => {
    return (discountedSubtotal.value * taxRate.value) / 100
  })

  const grandTotal = computed(() => {
    return discountedSubtotal.value + taxAmount.value
  })

  const formattedGrandTotal = computed(() => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(grandTotal.value)
  })

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

  function selectClient(id) {
    selectedClientId.value = id
  }

  function addCatalogItem(item) {
    const existingIndex = selectedItems.value.findIndex((i) => i.catalogId === item.id)
    if (existingIndex > -1) {
      selectedItems.value[existingIndex].quantity += 1
    } else {
      selectedItems.value.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        catalogId: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        unitPrice: item.unitPrice,
        quantity: item.defaultQuantity || 1,
        discount: 0,
      })
    }
  }

  function removeSelectedItem(index) {
    selectedItems.value.splice(index, 1)
  }

  function updateItem(index, field, value) {
    if (selectedItems.value[index]) {
      selectedItems.value[index][field] = value
    }
  }

  // AI Generation Simulation with Realistic Content & Streaming Feedback
  async function generateExecutiveSummary() {
    isGenerating.value.executiveSummary = true
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1600))
    
    const client = selectedClient.value
    const toneNote = aiTone.value === 'technical' 
      ? 'emphasizing architectural precision and latency benchmarks'
      : aiTone.value === 'cost-saving'
      ? 'centered upon immediate bottom-line impact and accelerated payback periods'
      : 'tailored for high-level decision makers'

    sections.value.executiveSummary = `Prepared exclusively for ${client.name} and the executive team at ${client.company}, this proposal details a high-impact solution designed to address core organizational challenges within the ${client.industry} sector.

Guided by your strategic mandate—"${aiPromptContext.value}"—our solution delivers an enterprise-grade transformation ${toneNote}. Through automated orchestration and purpose-built infrastructure enhancements, ${client.company} can capture immediate operational efficiencies, curtail manual error rates by up to 85%, and solidify a measurable competitive advantage within standard fiscal milestones.`
    
    isGenerating.value.executiveSummary = false
  }

  async function generateScope() {
    isGenerating.value.scope = true

    await new Promise((resolve) => setTimeout(resolve, 1900))

    const client = selectedClient.value
    const topItem = selectedItems.value[0]?.name || 'Autonomous Transformation Architecture'

    sections.value.scope = [
      {
        title: `Phase 1: Deep Discovery & Technical Alignment (${client.company})`,
        description: `Audit current workflows, catalog legacy integrations, and establish custom evaluation metrics aligned with the AI mandate: "${aiPromptContext.value.slice(0, 60)}..."`,
        duration: 'Sprint 1 (Weeks 1 – 2)',
        deliverable: 'Solution Architecture Document & Threat Model Assessment',
      },
      {
        title: `Phase 2: Core Implementation (${topItem})`,
        description: `Engineered staging deployment with automated testing, CI/CD pipelines, and high-throughput connector bridges into ${client.company}'s primary production systems.`,
        duration: 'Sprint 2 – 3 (Weeks 3 – 6)',
        deliverable: 'Staging Environment Verification & Performance Benchmarking',
      },
      {
        title: 'Phase 3: Production Rollout, Governance & Staff Enablement',
        description: 'Zero-downtime cutover execution, comprehensive admin and stakeholder training webinars, and full activation of continuous monitoring telemetry.',
        duration: 'Sprint 4 (Weeks 7 – 8)',
        deliverable: 'Production Sign-off, Runbooks & Dedicated SLA Handover',
      },
    ]

    isGenerating.value.scope = false
  }

  async function generateFullProposal() {
    isGenerating.value.full = true
    isGenerating.value.executiveSummary = true
    isGenerating.value.scope = true

    await Promise.all([
      generateExecutiveSummary(),
      generateScope(),
    ])

    isGenerating.value.full = false
  }

  // Directory of all generated proposals
  const proposalsList = ref([
    {
      id: 'PROP-2026-884',
      title: 'Strategic AI Modernization & Cost Optimization Proposal',
      clientId: 'client-1',
      clientName: 'Sarah Jenkins',
      clientCompany: 'Apex Retail Solutions',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      industry: 'E-Commerce & Retail',
      status: 'Drafting',
      total: 37654.50,
      itemCount: 3,
      date: 'Oct 08, 2026',
      aiScore: '98%',
      aiAngle: 'Cost-Saving Focus & ROI',
      aiSummary: 'Turnkey AI modernization reducing recurring operational overhead by 42% with guaranteed 6-month ROI.',
    },
    {
      id: 'PROP-2026-883',
      title: 'Autonomous Healthcare Pipeline & SOC2 Hardening',
      clientId: 'client-2',
      clientName: 'David Chen',
      clientCompany: 'OmniHealth Technologies',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      industry: 'Healthcare & Biotech',
      status: 'Sent',
      total: 64200.00,
      itemCount: 4,
      date: 'Oct 05, 2026',
      aiScore: '94%',
      aiAngle: 'Security & Compliance',
      aiSummary: 'HIPAA and SOC2 compliance automation and microservices zero-downtime failover architecture.',
    },
    {
      id: 'PROP-2026-882',
      title: 'FinTech Cloud Infrastructure Resilience Sprint',
      clientId: 'client-3',
      clientName: 'Elena Rostova',
      clientCompany: 'FinVanguard Global',
      clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      industry: 'Financial Services',
      status: 'Approved',
      total: 112000.00,
      itemCount: 5,
      date: 'Oct 02, 2026',
      aiScore: '99%',
      aiAngle: 'Speed-to-Market',
      aiSummary: 'High-frequency transaction streaming engine and multi-cloud disaster recovery.',
    },
    {
      id: 'PROP-2026-881',
      title: 'Supply Chain Automated Dispatcher Model',
      clientId: 'client-4',
      clientName: 'Marcus Sterling',
      clientCompany: 'LogiFlow Supply Corp',
      clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      industry: 'Supply Chain & Logistics',
      status: 'In Review',
      total: 48500.00,
      itemCount: 3,
      date: 'Sep 28, 2026',
      aiScore: '91%',
      aiAngle: 'Cost-Saving Focus',
      aiSummary: 'Automated fleet dispatch routing reducing fuel overhead by 18% in logistics operations.',
    },
    {
      id: 'PROP-2026-879',
      title: 'Legacy Database to Distributed Snowflake Migration',
      clientId: 'client-1',
      clientName: 'Sarah Jenkins',
      clientCompany: 'Apex Retail Solutions',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      industry: 'E-Commerce & Retail',
      status: 'Archived',
      total: 24800.00,
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
    }
  }

  function resetProposal() {
    currentStep.value = 1
    selectedClientId.value = 'client-1'
    selectedItems.value = []
    sections.value.executiveSummary = ''
    sections.value.scope = []
  }

  return {
    // State
    currentStep,
    clients,
    catalog,
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
    
    // Getters
    selectedClient,
    subtotal,
    totalDiscountAmount,
    discountedSubtotal,
    taxAmount,
    grandTotal,
    formattedGrandTotal,
    
    // Actions
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
  }
})

