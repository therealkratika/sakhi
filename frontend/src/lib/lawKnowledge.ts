/**
 * Sakhi Legal Knowledge Engine
 * Provides instant, verified statutory guidance based on the Protection of Women from
 * Domestic Violence Act (PWDVA 2005), Bharatiya Nyaya Sanhita (BNS) / IPC 498A,
 * CrPC / BNSS, and National Legal Services Authority (NALSA) frameworks.
 */

export interface LegalTopic {
  id: string;
  title: string;
  queryMatch: string[];
  summary: string;
  statutoryProvisions: string[];
  actionSteps: string[];
  emergencyNotes?: string;
}

export const LEGAL_TOPICS: LegalTopic[] = [
  {
    id: 'protection_orders',
    title: 'Protection Orders & Immediate Injunctions',
    queryMatch: ['protection', 'order', 'restraining', 'stop', 'violence', 'harassment', 'stay'],
    summary:
      'Under Section 18 of the Protection of Women from Domestic Violence Act (PWDVA) 2005, a Magistrate can grant an immediate interim Protection Order prohibiting the respondent from committing acts of domestic violence, entering the workplace or place frequently visited by the aggrieved woman, or attempting communication.',
    statutoryProvisions: [
      'Section 18, PWDVA 2005 (Protection Orders)',
      'Section 23, PWDVA 2005 (Power to grant interim and ex-parte orders)',
      'Section 31, PWDVA 2005 (Breach of protection order is a cognizable, non-bailable offense punishable by up to 1 year imprisonment)',
    ],
    actionSteps: [
      'Submit Form I (Domestic Incident Report - DIR) via a Protection Officer or directly to the Judicial Magistrate First Class.',
      'Request an ex-parte interim injunction under Section 23 if there is imminent threat of bodily harm.',
      'Keep documentation of medical reports, photographs, text messages, or audio/video evidence.',
      'Upon issuance, a copy is automatically served to the local police station in charge of your jurisdiction.',
    ],
    emergencyNotes:
      'If the respondent violates an interim protection order, dial 112 immediately. The police are legally bound to arrest the violator without warrant under Section 31.',
  },
  {
    id: 'residence_rights',
    title: 'Right to Reside in Shared Household (Anti-Eviction)',
    queryMatch: ['residence', 'home', 'evict', 'throw out', 'house', 'shelter', 'roof', 'staying'],
    summary:
      'Under Section 17 & 19 of PWDVA, every woman in a domestic relationship has the statutory right to reside in the shared household, regardless of whether she has any legal right, title, or beneficial interest in the property. You CANNOT be forcibly evicted or excluded by the respondent.',
    statutoryProvisions: [
      'Section 17, PWDVA (Right to reside in a shared household)',
      'Section 19, PWDVA (Residence Orders - restraining respondent from disposing or dispossessing)',
      'Supreme Court Precedent: Satish Chander Ahuja v. Sneha Ahuja (2020)',
    ],
    actionSteps: [
      'If facing threatened eviction, apply for a Residence Order under Section 19.',
      'The court can order the respondent to remove himself from the shared household or secure alternate equivalent accommodation at his expense.',
      'Contact a Protection Officer or Service Provider registered under the Act to enter the residence with police assistance if locked out.',
    ],
  },
  {
    id: 'free_legal_aid',
    title: 'Free Legal Aid & NALSA Representation',
    queryMatch: ['lawyer', 'legal aid', 'cost', 'money', 'free', 'nalsa', 'dlsa', 'advocate', 'fees'],
    summary:
      'Under Section 12(c) of the Legal Services Authorities Act, 1987, ALL women in India are unconditionally entitled to free legal aid, regardless of financial income or caste.',
    statutoryProvisions: [
      'Section 12(c), Legal Services Authorities Act, 1987',
      'NALSA (Free and Competent Legal Services) Regulations',
      'Article 39A, Constitution of India (Equal justice and free legal aid)',
    ],
    actionSteps: [
      'Visit the nearest District Legal Services Authority (DLSA) office located in any district court complex.',
      'Call the NALSA National Legal Aid Helpline: 15100 (Toll-Free, 24/7).',
      'An empaneled legal advocate will be assigned to draft petitions and represent you in court at zero government cost.',
    ],
  },
  {
    id: 'custody_children',
    title: 'Temporary Custody of Children',
    queryMatch: ['child', 'children', 'custody', 'kid', 'son', 'daughter', 'separated'],
    summary:
      'Under Section 21 of PWDVA 2005, the court may grant temporary custody of any child or children to the aggrieved woman at any stage of the application and specify visitation arrangements only if safe.',
    statutoryProvisions: [
      'Section 21, PWDVA (Custody Orders)',
      'Guardians and Wards Act, 1890',
      'Welfare of the Child doctrine',
    ],
    actionSteps: [
      'File an interim custody application under Section 21 to prevent the respondent from forcibly snatching or removing children.',
      'The Magistrate can ban all visitations if direct access is harmful to the moral or physical safety of the children.',
    ],
  },
  {
    id: 'police_fir',
    title: 'Filing Police Complaints & Zero FIR Safely',
    queryMatch: ['police', 'fir', 'zero fir', 'complaint', 'station', 'report', 'officer', 'arrest'],
    summary:
      'You can register a "Zero FIR" at ANY police station in India, regardless of where the incident occurred. The station must accept the complaint, assign an FIR number, and transfer it to the concerned precinct.',
    statutoryProvisions: [
      'Section 173(1), Bharatiya Nagarik Suraksha Sanhita (BNSS) / Section 154 CrPC',
      'Section 85 & 86, Bharatiya Nyaya Sanhita (BNS) (Cruelty by husband or relatives)',
      'Section 74, BNS (Assault or use of criminal force with intent to outrage modesty)',
    ],
    actionSteps: [
      'Women have the right to be examined by female police officers at their residence or chosen safe place.',
      'You are entitled to a FREE signed copy of the registered FIR immediately.',
      'If the local station refuses to register an FIR, you can submit the complaint directly in writing to the Superintendent of Police (SP) or file a private complaint before the Magistrate.',
    ],
  },
];

export function getLegalAdvice(userQuery: string): string {
  const queryLower = userQuery.toLowerCase();

  for (const topic of LEGAL_TOPICS) {
    const isMatch = topic.queryMatch.some((keyword) =>
      queryLower.includes(keyword)
    );
    if (isMatch) {
      return `### ${topic.title}

${topic.summary}

#### Statutory Provisions & Rights
${topic.statutoryProvisions.map((item) => `- **${item}**`).join('\n')}

#### Recommended Action Steps
${topic.actionSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

${
  topic.emergencyNotes
    ? `> **Emergency Notice:** ${topic.emergencyNotes}\n\n`
    : ''
}
*Need official assistance? Call the National Women's Helpline at **181** or Police Emergency at **112**.*`;
    }
  }

  // Comprehensive Default Legal Overview
  return `### Sakhi Legal Rights Advisory

In India, domestic abuse is strictly prohibited by civil and criminal statutory law. You have comprehensive legal remedies:

1. **Protection of Women from Domestic Violence Act (PWDVA 2005)**:
   - Provides civil remedies including immediate **Protection Orders (Sec 18)**, **Residence Orders against eviction (Sec 19)**, **Monetary Relief (Sec 20)**, and **Child Custody (Sec 21)**.
   - Applications can be filed through a Protection Officer, Service Provider, or directly before the Judicial Magistrate.

2. **Criminal Safeguards (BNS Sec 85 / IPC 498A)**:
   - Physical cruelty, mental torture, or harassment for dowry/property is a cognizable, non-bailable offense.
   - You can register a **Zero FIR** at any nearby police station.

3. **Free Legal Assistance**:
   - Under Section 12(c) of the Legal Services Authorities Act, you are entitled to a free court lawyer through your **District Legal Services Authority (DLSA)** or by calling **15100**.

*Ask specifically about: "Protection order", "Can they evict me?", "Child custody", "Filing an FIR", or "Free lawyer".*`;
}
