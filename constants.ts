
import { UserTier } from './types';

export const GAPSCAN_SYSTEM_INSTRUCTION = `
Persona:
You are the "GapScan Auditor," a strict analyst for emerging trends.

Objective:
Verify if a niche/entity exists and return structured market data.

Output Schema Rules:
1. entityName: The verified name.
2. safetyViolation: BOOLEAN. True if illegal/harmful.
3. isHallucinationRisk: BOOLEAN. True if you cannot find 2 independent sources.
4. authorityScore: NUMBER (0-100). Higher = more verified sources.
5. marketVolume: STRING. E.g. "15k searches/mo" or "High social volume".
6. competitionLevel: 'Low' | 'Medium' | 'High'.
7. positioningAngle: STRING. A strategic statement on how to enter this market.

Constraints:
- Be strict.
- Use Google Search to verify data.
`;

export const DISCLAIMER_TEXT = "AI and Affiliate Disclosure: This content was created with the assistance of AI tools and contains carefully selected affiliate links. All recommended products undergo rigorous environmental impact assessment. Your support through these links helps maintain our commitment to responsible research and ethical results.";

export const SUBSCRIPTION_POLICY_TEXT = "Should the subscriber elect to cancel their subscription, all associated features and charges will remain active until 11:59 PM (subscriber's local time) on the final day of the current billing cycle. In the event of a subscription downgrade, the revised subscription cost and features will be immediately applied and charged at the time the change is made. Subscriptions are set to automatically renew monthly.";

// REPLACE THESE WITH YOUR ACTUAL STRIPE PAYMENT LINKS FROM YOUR STRIPE DASHBOARD
export const STRIPE_LINKS = {
  [UserTier.SCOUT]: "https://buy.stripe.com/5kQfZh2eI5UY8nA84gdIA02",
  [UserTier.ARCHITECT]: "https://buy.stripe.com/00w6oH3iM6Z2avI1FSdIA03",
  [UserTier.AUTHORITY]: "https://buy.stripe.com/5kQ00j5qU2IMcDQbgsdIA04"
};

export const PRICING_TIERS = [
  {
    id: UserTier.DAILY_ALPHA,
    rank: 0,
    name: 'The Daily Alpha',
    price: '$0',
    period: '/forever',
    features: [
      '1 Trend Signal/Day',
      'Velocity Graph Only',
      'Strategy Title Only (Blurred)',
      'Creative Lab Locked'
    ],
    color: 'border-slate-600'
  },
  {
    id: UserTier.SCOUT,
    rank: 1,
    name: 'The Scout',
    price: '$49',
    period: '/mo',
    features: [
      'Full Live Trend Wall',
      'Saturation % Meter',
      '5 Niche Pollinations',
      'Text Summaries Only',
      'Standard Firebase Push'
    ],
    color: 'border-blue-500'
  },
  {
    id: UserTier.ARCHITECT,
    rank: 2,
    name: 'The Architect',
    price: '$129',
    period: '/mo',
    features: [
      'Full Wall + Sentiment Switch',
      '"Gap" Heatmaps',
      'Comment Sentiment Analysis',
      'AI Image/Video Scripts',
      'Entity Definition Gen',
      'Priority Instant Alerts'
    ],
    color: 'border-brand-purple',
    popular: true
  },
  {
    id: UserTier.AUTHORITY,
    rank: 3,
    name: 'The Authority',
    price: '$249',
    period: '/mo',
    features: [
      'Full Wall + Custom Tracking',
      'Full API Access',
      'Unlimited Deep-Dives',
      'Unlimited AI Video/Voice',
      'LLM-Citation/AIO Prep',
      'Editorial Window Tracker'
    ],
    color: 'border-red-500'
  }
];
