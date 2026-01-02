export const PLANS = {
  guest: {
    id: 'guest',
    name: 'Guest',
    price: 0,
    features: ['Instant AI Access', 'Public Research Library'],
    allowed: []
  },
  visitor: {
    id: 'visitor',
    name: 'Visitor',
    price: 1,
    features: ['Instant AI Access', 'Public Research Library', 'Includes Sponsored Ads'],
    allowed: ['local_search']
  },
  starter: {
    id: 'starter',
    name: 'Starter Pack',
    price: 25,
    features: [
      'Deep Neural Search',
      'Unlimited Local Analysis',
      'Smart Summarization',
      'Ad-Free Interface'
    ],
    allowed: ['local_search', 'chat']
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 50,
    features: [
      'Real-Time Web Intelligence',
      'Multi-Persona Reasoning',
      'Turbo-Charged Speed',
      'Creativity Control'
    ],
    allowed: ['local_search', 'chat', 'web_search', 'personas', 'temperature']
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    price: 115,
    features: [
      'Quantum-Speed Processing',
      'God Mode Access',
      'Enterprise-Grade Security',
      'Early Access to Future Models'
    ],
    allowed: ['local_search', 'chat', 'web_search', 'personas', 'temperature', 'gold_theme']
  },
  ultra: {
    id: 'ultra',
    name: 'Ultra Mode',
    price: 999,
    features: [
      'Omniscient AI Core',
      'Time-Travel Research',
      'Direct Neural Interface',
      'Reality Simulation Engine'
    ],
    allowed: ['local_search', 'chat', 'web_search', 'personas', 'temperature', 'gold_theme', 'ultra_theme']
  }
};

let currentPlanId = 'guest';

export const Subscription = {
  getKey() {
    return 'research_atlas_plan';
  },

  getCurrentPlan() {
    return PLANS[currentPlanId] || PLANS.guest;
  },

  setPlan(planId) {
    if (PLANS[planId]) {
      currentPlanId = planId;
      return true;
    }
    return false;
  },

  hasAccess(featureId) {
    const plan = this.getCurrentPlan();
    if (plan.id === 'gold' || plan.id === 'ultra') return true; // Gold and Ultra have everything
    return plan.allowed.includes(featureId);
  },

  clear() {
    localStorage.removeItem(this.getKey());
  }
};
