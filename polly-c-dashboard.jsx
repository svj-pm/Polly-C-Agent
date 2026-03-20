import { useState } from 'react'
import {
  Shield, AlertTriangle, ChevronDown, ChevronUp, Clock, CheckCircle,
  XCircle, ArrowUpRight, MessageSquare, AlertCircle, TrendingDown,
  Activity, Send, X
} from 'lucide-react'

// ─── DATA LAYER ──────────────────────────────────────────────────────────────

const ALERTS = [
  {
    id: 'ALT-2026-04891',
    severity: 'critical',
    riskScore: 96,
    aiConfidence: 93,
    aiRecommendation: 'escalate',
    scenario: 'MNPI Sharing',
    channel: 'Bloomberg Chat',
    trader: { name: 'Marcus Whitfield', desk: 'Equity Derivatives', id: 'EQD-0441' },
    flaggedAt: '2026-03-19 08:14',
    reviewDeadline: '2026-03-19 10:00',
    status: 'pending',
    messages: [
      { sender: 'Marcus Whitfield', time: '08:03', text: 'you see the move in NovaBio this morning?', flagged: false },
      { sender: 'Derek Lam', time: '08:05', text: 'yeah weird volume. no news out', flagged: false },
      { sender: 'Marcus Whitfield', time: '08:07', text: 'my contact at the advisory shop says theres a deal getting signed friday before close. buy-side, big premium.', flagged: true },
      { sender: 'Derek Lam', time: '08:09', text: 'which advisory? GX?', flagged: false },
      { sender: 'Marcus Whitfield', time: '08:11', text: 'cant say. but you might want to look at your book before eod tomorrow. just saying.', flagged: true },
      { sender: 'Derek Lam', time: '08:12', text: 'got it. appreciate the heads up', flagged: false },
    ],
    chainOfThought: [
      {
        step: 'External Source with Privileged Access',
        reasoning: 'Whitfield explicitly references "my contact at the advisory shop" as the information source. Advisory professionals involved in M&A transactions are subject to strict confidentiality obligations; any disclosure to outside parties constitutes a potential tipper-tippee relationship under SEC Rule 10b-5. The deliberate withholding of the firm name ("cant say") further indicates consciousness of the information\'s sensitivity.'
      },
      {
        step: 'Non-Public Timing Details',
        reasoning: 'The message specifies "friday before close" as the signing date — a precise, time-sensitive detail that is non-public by definition prior to announcement. Deal timing is among the most material non-public information categories, as it directly informs the optimal trade entry window. No public filings or news sources contain this information as of flag time.'
      },
      {
        step: 'Tipping Language Detected',
        reasoning: '"You might want to look at your book before eod tomorrow" is a textbook tipping phrase — an indirect but explicit trading suggestion predicated on the non-public information. The phrase "just saying" is a known distancing hedge commonly observed in prior MNPI enforcement cases. This is not ambiguous market commentary; it is actionable direction tied to a specific catalyst.'
      },
      {
        step: 'Blotter Cross-Reference',
        reasoning: 'Subsequent review of Whitfield\'s blotter shows a 47,000-share long position initiated in NovaBio (NVB) at 08:31 this morning, 17 minutes after the conversation. Lam\'s blotter shows a 22,000-share position opened at 08:44. Both positions are outside normal trading patterns for these desks. This corroborating evidence elevates classification from suspected to near-confirmed MNPI trading.'
      }
    ],
    riskIndicators: [
      'Named external advisory source',
      'Specific acquisition timing disclosed',
      'Explicit trading directive ("look at your book")',
      'Subsequent corroborating positions in blotter',
      'Deliberate source concealment',
      'Cross-desk information propagation'
    ]
  },
  {
    id: 'ALT-2026-04887',
    severity: 'critical',
    riskScore: 91,
    aiConfidence: 89,
    aiRecommendation: 'escalate',
    scenario: 'Market Manipulation',
    channel: 'Email',
    trader: { name: 'Renata Sousa', desk: 'Fixed Income', id: 'FI-0219' },
    flaggedAt: '2026-03-19 07:52',
    reviewDeadline: '2026-03-19 09:30',
    status: 'pending',
    messages: [
      { sender: 'Renata Sousa', time: '07:41', text: 'plan for today: we need to move the 10y benchmark. start building in 200-300k clips from 9am, keep it under the 500k reporting threshold each clip.', flagged: true },
      { sender: 'Renata Sousa', time: '07:42', text: 'spread it across accounts 4, 7, 11, 18, 23, and the Cayman sub. no single account should show more than 4M by noon.', flagged: true },
      { sender: 'Renata Sousa', time: '07:44', text: 'at 3:45 we push size through. that should be enough to print above 97.40 at the fix. options book pays out at 97.35+', flagged: true },
      { sender: 'Thomas Krel', time: '07:47', text: 'understood. ill coordinate with the desk.', flagged: false },
    ],
    chainOfThought: [
      {
        step: '"Banging the Close" Pattern Identified',
        reasoning: 'The explicit reference to the 3:45 push timed to influence the 4:00 fix price is a textbook "banging the close" strategy, one of the most heavily litigated forms of benchmark manipulation. The phrase "print above 97.40 at the fix" directly ties the trading activity to a desired price outcome rather than legitimate investment rationale. This pattern matches the factual basis of CFTC v. Kraft Foods (2015) and multiple FCA enforcement actions.'
      },
      {
        step: 'Benchmark Manipulation Intent Explicit',
        reasoning: 'The stated purpose — "options book pays out at 97.35+" — makes the financial motivation for manipulation explicit in writing. Trading to influence a benchmark at which you hold a derivative position is a category-one manipulation offense under MAR Article 12 and CFTC Reg 180.2. The sequence (build position → push fix → collect options payout) is the complete manipulation loop documented in a single email chain.'
      },
      {
        step: 'Multi-Account Structuring to Avoid Detection',
        reasoning: 'Instruction to spread activity across 6 named accounts plus an offshore subsidiary, with explicit clip sizing to stay under the 500k reporting threshold, constitutes structuring — a regulatory offense independent of the underlying manipulation. The inclusion of "Cayman sub" suggests deliberate use of opaque entities. This mirrors the structuring conduct cited in LIBOR and FX-fix enforcement actions.'
      },
      {
        step: 'Written Evidence — Severity Escalation',
        reasoning: 'The manipulation plan is communicated over email in explicit operational detail, including account numbers, target price levels, and timing. The presence of a written record significantly elevates institutional exposure. Regulatory referral is warranted under FINRA Rule 9554 and the firm\'s SAR obligations. Preserving this thread under litigation hold is immediately required.'
      }
    ],
    riskIndicators: [
      'Explicit fix-window timing ("3:45 push")',
      'Named accounts for structured spreading (6 + Cayman sub)',
      'Sub-threshold clip sizing to avoid reporting',
      'Options book linked to manipulation target price',
      'Written operational detail — litigation hold required',
      '"Banging the close" lexicon match'
    ]
  },
  {
    id: 'ALT-2026-04879',
    severity: 'high',
    riskScore: 78,
    aiConfidence: 82,
    aiRecommendation: 'escalate',
    scenario: 'Front Running',
    channel: 'Microsoft Teams',
    trader: { name: 'James Okafor', desk: 'Prime Brokerage', id: 'PB-0337' },
    flaggedAt: '2026-03-19 11:05',
    reviewDeadline: '2026-03-19 15:00',
    status: 'pending',
    messages: [
      { sender: 'James Okafor', time: '10:47', text: 'Pinnacle just dropped a block — 2.4M shares ARCL, working it now. gonna take us 30-40 mins to fill.', flagged: true },
      { sender: 'James Okafor', time: '10:49', text: 'hey are you around', flagged: false },
      { sender: 'Chris Baum', time: '10:51', text: 'yeah whats up', flagged: false },
      { sender: 'James Okafor', time: '10:52', text: 'ARCL — might be worth a look on your side. just a heads up', flagged: true },
      { sender: 'Chris Baum', time: '10:53', text: 'noted, thanks', flagged: false },
    ],
    chainOfThought: [
      {
        step: 'Material Client Order Information Disclosed',
        reasoning: 'Okafor discloses a specific client (Pinnacle), the exact order size (2.4M shares), the security (ARCL), and the estimated fill window (30-40 minutes) — all elements of material non-public client order information. Under MiFID II Article 28 and FINRA Rule 5270, this information must remain within the execution workflow. Disclosure to any party outside that workflow is prohibited.'
      },
      {
        step: 'Cross-Desk Information Barrier Breach',
        reasoning: 'Chris Baum is on the Rates Trading desk — a structurally separated business with no legitimate need for Prime Brokerage client order flow information. The communication occurred over an informal Teams channel rather than any permissioned cross-desk flow. This constitutes a Chinese Wall breach regardless of whether Baum subsequently trades on the information.'
      },
      {
        step: 'Implicit Front-Running Direction',
        reasoning: '"Might be worth a look on your side" following the disclosure of a large pending buy order is an implicit instruction to trade ahead of the client. The phrase mirrors language used in the JP Morgan "dark pool" enforcement action. The timing — 5 minutes before the order began executing — places Baum in a position to profit from the anticipated price impact.'
      },
      {
        step: 'Blotter Monitoring Recommended',
        reasoning: 'No position has yet been confirmed on Baum\'s blotter at flag time, but the 10:53–11:05 window requires immediate review. If Baum establishes any long position in ARCL in this interval, the front-running sequence is complete. Preserving the Teams thread and flagging both trader blotters for the next 48 hours is required action.'
      }
    ],
    riskIndicators: [
      'Client identity disclosed (Pinnacle)',
      'Exact block size shared (2.4M shares)',
      'Cross-desk communication (PB → Rates)',
      'Implicit trading suggestion before execution',
      'Information barrier breach',
      'Fill window timing disclosed'
    ]
  },
  {
    id: 'ALT-2026-04872',
    severity: 'high',
    riskScore: 74,
    aiConfidence: 88,
    aiRecommendation: 'escalate',
    scenario: 'Conduct Risk',
    channel: 'Microsoft Teams',
    trader: { name: 'Victor Haines', desk: 'Equity Derivatives', id: 'EQD-0112' },
    flaggedAt: '2026-03-19 09:33',
    reviewDeadline: '2026-03-19 17:00',
    status: 'pending',
    messages: [
      { sender: 'Victor Haines', time: '23:14', text: 'still at your desk? you work harder than anyone else on this floor', flagged: false },
      { sender: 'Sophie Ng', time: '23:17', text: 'just finishing up the deck for tomorrow', flagged: false },
      { sender: 'Victor Haines', time: '23:19', text: 'youre exactly the kind of person who gets noticed around here. the right people are watching.', flagged: true },
      { sender: 'Victor Haines', time: '23:22', text: 'are you free for a drink after your next late night? easier to talk about your future off-site', flagged: true },
      { sender: 'Sophie Ng', time: '23:24', text: 'thanks, i appreciate it. ill think about it', flagged: false },
      { sender: 'Victor Haines', time: '23:25', text: 'dont think too long. opportunities close quickly in this business', flagged: true },
    ],
    chainOfThought: [
      {
        step: 'Power Dynamic and Seniority Differential',
        reasoning: 'Haines holds a Managing Director title; Ng is a first-year analyst. This seniority differential creates an inherent power imbalance that makes the solicitation of a private meeting coercive by context even in the absence of explicit threats. The reference to "the right people are watching" invokes Haines\'s perceived influence over Ng\'s career — a form of implicit quid pro quo framing.'
      },
      {
        step: 'After-Hours Escalation Pattern',
        reasoning: 'This exchange occurred between 23:14 and 23:25 — a late-night window that is behaviorally significant in conduct risk analysis. Review of the prior 30 days shows 7 additional late-night message threads between Haines and Ng, averaging 22:48. This pattern of after-hours contact with a junior subordinate is a recognized precursor in workplace misconduct cases and triggers enhanced monitoring under the firm\'s Code of Conduct.'
      },
      {
        step: 'Solicitation of Private Off-Site Meeting',
        reasoning: '"Easier to talk about your future off-site" is a direct solicitation to move the relationship outside monitored, professional channels. This phrasing is functionally equivalent to removing the interaction from the firm\'s surveillance perimeter. The stated pretext (career discussion) does not alter the risk classification; grooming language frequently frames off-channel contact in professional terms.'
      },
      {
        step: 'Pressure Framing — "Opportunities Close Quickly"',
        reasoning: '"Don\'t think too long. Opportunities close quickly in this business" applies time pressure to a solicitation already framed in career-progression terms. This closing line creates implicit urgency that limits the recipient\'s perceived agency to decline. HR escalation is warranted immediately; continued surveillance of this communication pair is required pending HR review outcome.'
      }
    ],
    riskIndicators: [
      'MD-to-analyst power differential',
      'Late-night message pattern (7 prior instances)',
      'Career-linked quid pro quo framing',
      'Solicitation of off-site private meeting',
      'Time-pressure language ("don\'t think too long")',
      'Implicit threat to career advancement'
    ]
  },
  {
    id: 'ALT-2026-04861',
    severity: 'medium',
    riskScore: 44,
    aiConfidence: 76,
    aiRecommendation: 'dismiss',
    scenario: 'Off-Channel Comms',
    channel: 'Microsoft Teams',
    trader: { name: 'Priya Mehta', desk: 'Wealth Management', id: 'WM-0508' },
    flaggedAt: '2026-03-19 14:22',
    reviewDeadline: '2026-03-19 18:00',
    status: 'pending',
    messages: [
      { sender: 'Priya Mehta', time: '14:09', text: 'my laptop crashed this morning and IT is still sorting it. can you forward the Hargrove account summary to my gmail? priya.mehta88@gmail.com', flagged: true },
      { sender: 'Colin Shaw', time: '14:11', text: 'ah man. i can do that, one sec', flagged: false },
      { sender: 'Priya Mehta', time: '14:13', text: 'actually wait — IT just gave me a loaner. never mind, ill pull it from the share drive', flagged: false },
      { sender: 'Colin Shaw', time: '14:14', text: 'oh good timing, hadnt sent it yet', flagged: false },
      { sender: 'Priya Mehta', time: '14:15', text: 'thanks anyway, sorted now', flagged: false },
    ],
    chainOfThought: [
      {
        step: 'Off-Channel Request Identified',
        reasoning: 'The request to forward a client account summary to a personal Gmail address constitutes a potential off-channel data exfiltration event. Under Reg S-P and firm data handling policy, client account information must remain within firm-controlled systems. The request, if fulfilled, would have produced an unarchived communication containing client PII outside the surveillance perimeter.'
      },
      {
        step: 'Self-Correction Before Execution',
        reasoning: 'Critically, the document was never forwarded — Mehta withdrew the request before Shaw acted, and the resolution was achieved through approved IT channels (loaner device + share drive). The self-correction occurred within 4 minutes of the initial request and was unprompted. This is a meaningful mitigating factor; no actual data left the firm\'s controlled environment.'
      },
      {
        step: 'Intent Assessment — Convenience vs. Evasion',
        reasoning: 'The contextual framing (laptop failure, IT remediation in progress) is consistent with a convenience-driven workaround rather than deliberate evasion. There is no history of off-channel requests on Mehta\'s record in the prior 12 months, no sensitive deal-related content involved, and the personal email address is consistent with her known identity. The risk profile is low-moderate absent corroborating signals.'
      },
      {
        step: 'Recommendation: Dismiss with Monitoring Flag',
        reasoning: 'This alert does not meet the threshold for regulatory escalation or formal disciplinary action. The appropriate disposition is dismissal with a 90-day monitoring flag on the Mehta-Shaw communication pair and a reminder to Mehta of approved data handling procedures. If a second off-channel request surfaces within the monitoring window, re-escalate.'
      }
    ],
    riskIndicators: [
      'Personal email address solicited (Gmail)',
      'Client account document in scope',
      'Request self-corrected before execution',
      'No prior off-channel history',
      'IT-documented device failure context'
    ]
  },
  {
    id: 'ALT-2026-04854',
    severity: 'medium',
    riskScore: 38,
    aiConfidence: 81,
    aiRecommendation: 'dismiss',
    scenario: 'MNPI Sharing',
    channel: 'Email',
    trader: { name: 'Daniel Cho', desk: 'Rates Trading', id: 'RT-0622' },
    flaggedAt: '2026-03-19 10:48',
    reviewDeadline: '2026-03-19 17:00',
    status: 'pending',
    messages: [
      { sender: 'Daniel Cho', time: '10:31', text: 'been hearing things in the rates space lately. sector feels like its building to something but hard to say what.', flagged: true },
      { sender: 'Amir Patel', time: '10:35', text: 'yeah the duration positioning has been weird. probably macro driven', flagged: false },
      { sender: 'Daniel Cho', time: '10:37', text: 'maybe. just a general feel, nothing concrete. could be nothing.', flagged: false },
    ],
    chainOfThought: [
      {
        step: 'Lexicon Trigger: "Hearing Things"',
        reasoning: 'The phrase "hearing things" triggered the MNPI lexicon model, which pattern-matches on phrases associated with information receipt from external sources. This is the correct trigger behavior. However, lexicon matching alone is insufficient for MNPI classification — the downstream context must establish (1) specificity of information, (2) source identification, and (3) trading nexus.'
      },
      {
        step: 'No Specific Information Present',
        reasoning: 'The message contains no company name, no deal type, no source attribution, no timing detail, and no trading suggestion. "Sector feels like its building to something" is market intuition language, not information disclosure. This is consistent with the kind of vague market sentiment commentary that compliance teams encounter at high volume and that courts have repeatedly declined to classify as MNPI.'
      },
      {
        step: 'No Source Attribution or Trading Nexus',
        reasoning: 'There is no "contact at [firm]" reference, no specific catalyst mentioned, and no suggestion to trade. Cho\'s own follow-up ("could be nothing") is a further distancing qualifier. Without a source or trading direction, the tipping chain required for MNPI liability under Dirks v. SEC cannot be established. This alert is a false positive driven by surface-level lexicon matching.'
      },
      {
        step: 'Classification: Below MNPI Threshold',
        reasoning: 'This conversation does not meet the materiality or specificity requirements for MNPI under SEC Rule 10b-5 or MAR Article 7. The AI recommends dismissal. A monitoring flag is not warranted given the absence of corroborating signals in Cho\'s blotter or communication history. Dismissing this correctly is itself valuable feedback for model calibration.'
      }
    ],
    riskIndicators: [
      'Lexicon match: "hearing things"',
      'No company or deal specificity',
      'No source attribution',
      'No trading suggestion present',
      'Vague market sentiment language only'
    ]
  },
  {
    id: 'ALT-2026-04848',
    severity: 'high',
    riskScore: 77,
    aiConfidence: 85,
    aiRecommendation: 'escalate',
    scenario: 'Conflicts of Interest',
    channel: 'Email',
    trader: { name: 'Laura Fenwick', desk: 'Wealth Management', id: 'WM-0391' },
    flaggedAt: '2026-03-19 12:17',
    reviewDeadline: '2026-03-19 16:00',
    status: 'pending',
    messages: [
      { sender: 'Laura Fenwick', time: '12:02', text: 'just so you know i picked up another 5,000 shares of Veridian Health this morning. im at about 40k shares now across personal and family accounts.', flagged: true },
      { sender: 'Laura Fenwick', time: '12:04', text: 'still running Veridian as a top pick in the managed portfolios — have about 14 client accounts with positions ranging 2-8% allocation.', flagged: true },
      { sender: 'Marcus Webb', time: '12:08', text: 'is that disclosed anywhere? sounds like a lot of overlap', flagged: false },
      { sender: 'Laura Fenwick', time: '12:10', text: 'its in my annual disclosure but i havent updated it since i added the last tranche in january. should be fine though.', flagged: true },
    ],
    chainOfThought: [
      {
        step: 'Personal and Professional Position Overlap',
        reasoning: 'Fenwick holds ~40,000 shares of Veridian Health across personal and family accounts while simultaneously recommending the same security as a "top pick" in 14 managed client portfolios. This creates a direct financial conflict: Fenwick profits from client buying pressure on the same security she holds. Under SEC Reg BI and FINRA Rule 3110, advisors must manage and disclose this conflict proactively.'
      },
      {
        step: 'Disclosure Obligation Breach',
        reasoning: 'Fenwick acknowledges her Form U4 disclosure was last updated before her January tranche acquisition, meaning her current holding is materially understated in regulatory filings. The casual framing ("should be fine though") indicates insufficient awareness of the ongoing disclosure obligation. FINRA Rule 3240 requires prompt disclosure of any changes to personal securities holdings that conflict with client recommendations.'
      },
      {
        step: 'Suitability and Reg BI Implications',
        reasoning: 'The combination of personal financial interest and client recommendation creates a Reg BI best-interest obligation concern: was Veridian recommended because it is in clients\' best interest, or because it benefits Fenwick\'s personal portfolio? With 2-8% allocations across 14 accounts, the aggregate client exposure is material. A conflict-tainted recommendation may constitute a suitability violation regardless of whether the security ultimately performs.'
      },
      {
        step: 'Remediation Path',
        reasoning: 'Immediate actions required: (1) Fenwick must update her disclosure filing to reflect current holdings, (2) Compliance must review the 14 client accounts for suitability documentation, (3) future Veridian recommendations must go through the conflicts review workflow until the personal position is reduced or disclosed to clients. Escalation to the COI committee is warranted given the scale of overlap.'
      }
    ],
    riskIndicators: [
      '40,000-share personal position in recommended security',
      'Stale disclosure filing (pre-January tranche)',
      'Active client recommendation during personal accumulation',
      '14 client accounts with Veridian exposure',
      'Reg BI best-interest obligation implicated',
      'Self-reported casual framing of disclosure gap'
    ]
  },
  {
    id: 'ALT-2026-04831',
    severity: 'low',
    riskScore: 8,
    aiConfidence: 97,
    aiRecommendation: 'dismiss',
    scenario: 'Off-Channel Comms',
    channel: 'SMS',
    trader: { name: 'Tom Breckenridge', desk: 'Prime Brokerage', id: 'PB-0104' },
    flaggedAt: '2026-03-19 13:45',
    reviewDeadline: '2026-03-19 18:00',
    status: 'pending',
    messages: [
      { sender: 'Tom Breckenridge', time: '13:22', text: 'lol did you see the insider_trading_meme.jpg Chen posted in the group chat', flagged: true },
      { sender: 'Ryan Park', time: '13:24', text: 'haha yes. classic', flagged: false },
      { sender: 'Tom Breckenridge', time: '13:25', text: 'we need a dedicated meme channel at this point', flagged: false },
    ],
    chainOfThought: [
      {
        step: 'Lexicon Trigger: "insider" in Filename',
        reasoning: 'The automated flag was triggered by the string "insider" appearing in the filename "insider_trading_meme.jpg" within a monitored SMS thread. This is expected behavior for the lexicon model, which is configured to flag any occurrence of "insider," "MNPI," or "non-public" in communications. The trigger mechanism functioned correctly; the classification requires human review.'
      },
      {
        step: 'Context Assessment: Social/Meme Content',
        reasoning: 'The full message context makes clear this is a reference to a humorous image shared in an informal group chat. The filename structure ("_meme.jpg"), the laughing acknowledgment from the recipient, and the follow-up suggesting a dedicated meme channel are all strong contextual signals that no actual insider trading information was shared. The word "insider" appears only in the filename, not in any substantive message.'
      },
      {
        step: 'No Substantive Information Transfer',
        reasoning: 'There is no company-specific information, no trading discussion, no source reference, and no action taken or suggested. The image file itself was not captured for review (SMS image content is not retained under current archiving configuration), but the surrounding text provides sufficient context for classification. Risk score: 8/100.'
      },
      {
        step: 'Classification: Noise — Dismiss with High Confidence',
        reasoning: 'This alert is a false positive resulting from keyword matching on a colloquial filename. Dismissal is recommended with 97% confidence. This alert type is a known false positive category; a lexicon exception rule for "_meme" filename patterns would reduce noise in future batches. This data point should be routed to the model tuning pipeline.'
      }
    ],
    riskIndicators: [
      'Lexicon match: "insider" in filename only',
      'No substantive information in message text',
      'Social/casual context confirmed',
      'Image content not retrievable (SMS archiving gap)'
    ]
  }
]

const DAILY_STATS = {
  queueRemaining: 37,
  avgReviewTime: '2m 14s',
  avgReviewTimeTrend: -12,
  aiAgreementRate: 89,
  escalationsToday: 4
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

const severityBg = (s) => ({
  critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
  high: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  low: 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
}[s] ?? '')

const severityBar = (s) => ({
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-yellow-500',
  low: 'bg-slate-500'
}[s] ?? 'bg-slate-500')

const severityCircle = (s) => ({
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-yellow-500',
  low: 'bg-slate-600'
}[s] ?? 'bg-slate-600')

const severityBorderColor = (s) => ({
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#eab308',
  low: '#64748b'
}[s] ?? '#64748b')

const recPill = (r) => ({
  escalate: 'bg-red-500/15 text-red-400 border border-red-500/25',
  review: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  dismiss: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
}[r] ?? '')

const recLabel = (r) => ({ escalate: 'Escalate', review: 'Review', dismiss: 'Dismiss' }[r] ?? r)

const confidenceColor = (n) =>
  n > 85
    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    : n >= 65
    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    : 'bg-red-500/20 text-red-400 border border-red-500/30'

const recActionColor = (r) => ({
  escalate: 'text-red-400',
  review: 'text-amber-400',
  dismiss: 'text-emerald-400'
}[r] ?? 'text-slate-400')

// ─── TOAST ───────────────────────────────────────────────────────────────────

function Toast({ message, onDone }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-[#0D1117] px-4 py-3 text-sm text-emerald-300 shadow-xl">
      <CheckCircle size={15} className="shrink-0" />
      {message}
      <button onClick={onDone} className="ml-2 text-slate-500 hover:text-slate-300">
        <X size={13} />
      </button>
    </div>
  )
}

// ─── PULSE STRIP ─────────────────────────────────────────────────────────────

function PulseStrip({ stats }) {
  return (
    <div className="flex gap-4 px-4 py-3 border-b border-white/5 shrink-0">
      <MetricCard label="Queue Remaining" value={stats.queueRemaining} />
      <MetricCard
        label="Avg Review Time"
        value={stats.avgReviewTime}
        sub={
          <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
            <TrendingDown size={11} />
            {Math.abs(stats.avgReviewTimeTrend)}%
          </span>
        }
      />
      <MetricCard label="AI Agreement Rate" value={`${stats.aiAgreementRate}%`} />
      <MetricCard label="Escalations Today" value={stats.escalationsToday} />
    </div>
  )
}

function MetricCard({ label, value, sub }) {
  return (
    <div className="flex-1 rounded-lg border border-white/5 bg-[#161B22] px-4 py-3 min-w-0">
      <div className="font-mono text-xl font-semibold text-white tabular-nums">{value}</div>
      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
        <span>{label}</span>
        {sub}
      </div>
    </div>
  )
}

// ─── QUEUE RAIL ──────────────────────────────────────────────────────────────

function QueueRail({ alerts, selectedId, onSelect }) {
  const sorted = [...alerts].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  )

  return (
    <div className="w-[280px] shrink-0 overflow-y-auto border-r border-slate-800 flex flex-col gap-3 p-3">
      {sorted.map(a => (
        <QueueCard
          key={a.id}
          alert={a}
          selected={a.id === selectedId}
          onClick={() => onSelect(a.id)}
        />
      ))}
      {sorted.length === 0 && (
        <div className="flex flex-1 items-center justify-center py-12 text-xs text-slate-600">
          No pending alerts
        </div>
      )}
    </div>
  )
}

function QueueCard({ alert: a, selected, onClick }) {
  const borderClass = {
    critical: 'border-red-500',
    high: 'border-amber-500',
    medium: 'border-yellow-500',
    low: 'border-slate-500'
  }[a.severity]

  return (
    <button
      onClick={onClick}
      className={`relative flex w-full overflow-hidden rounded-lg border text-left transition-colors
        ${selected
          ? `${borderClass} bg-[#1C2128]`
          : 'border-transparent bg-[#161B22] hover:bg-[#1C2128]'}`}
    >
      <div className={`w-[3px] shrink-0 self-stretch ${severityBar(a.severity)}`} />
      <div className="flex flex-col gap-1.5 p-3 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-slate-600">{a.id}</span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${severityBg(a.severity)}`}>
            {a.severity}
          </span>
        </div>
        <div className="text-[12px] font-medium text-slate-200 truncate">{a.trader.name}</div>
        <div className="text-[11px] text-slate-500 truncate">{a.scenario}</div>
        <div className={`text-[10px] font-medium ${recActionColor(a.aiRecommendation)}`}>
          AI: {recLabel(a.aiRecommendation)}
        </div>
      </div>
    </button>
  )
}

// ─── DETAIL PANEL ────────────────────────────────────────────────────────────

const DISMISS_REASONS = [
  'Legitimate business context',
  'Insufficient evidence',
  'Duplicate alert',
  'Already addressed',
  'Other'
]

function DetailPanel({ alert: a, onAction }) {
  const [threadOpen, setThreadOpen] = useState(true)
  const [dismissOpen, setDismissOpen] = useState(false)
  const [escalateOpen, setEscalateOpen] = useState(false)
  const [escalateNote, setEscalateNote] = useState('')

  if (!a) {
    return (
      <div className="flex flex-1 items-center justify-center text-xs text-slate-600">
        Select an alert to begin review
      </div>
    )
  }

  // deadline countdown (treat flaggedAt date as today)
  const [, flagTime] = a.flaggedAt.split(' ')
  const [, deadlineTime] = a.reviewDeadline.split(' ')
  const toMs = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h * 3600000 + m * 60000
  }
  const msLeft = toMs(deadlineTime) - toMs(flagTime)
  const hoursLeft = msLeft / 3600000
  const showCountdown = hoursLeft > 0 && hoursLeft < 2

  return (
    <div className="flex flex-1 flex-col min-h-0 relative overflow-hidden">
      {/* scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* Header */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-white/5 bg-[#0B0E11] px-5 py-3 mb-6">
          <span className="font-mono text-xs text-slate-500">{a.id}</span>
          <span className={`rounded px-2 py-0.5 text-xs font-semibold ${severityBg(a.severity)}`}>
            {a.severity.toUpperCase()}
          </span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{a.scenario}</span>
          <span className="text-xs font-medium text-slate-200">{a.trader.name}</span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-500">{a.trader.desk}</span>
          <span className="font-mono text-xs text-slate-600">{a.trader.id}</span>
          <span className="rounded bg-slate-800/70 px-2 py-0.5 text-xs text-slate-400">{a.channel}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1 font-mono text-xs text-slate-600">
              <Clock size={12} />
              {a.flaggedAt}
            </span>
            {showCountdown && (
              <span className="flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/25">
                <AlertTriangle size={11} />
                {Math.floor(hoursLeft)}h {Math.round((hoursLeft % 1) * 60)}m left
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6">

          {/* ── AI Analysis (hero) ── */}
          <div className="rounded-xl border border-white/5 bg-[#161B22] p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-100">AI Analysis</span>
              </div>
              <span className={`rounded-full px-3 py-1 font-mono text-sm font-medium ${confidenceColor(a.aiConfidence)}`}>
                {a.aiConfidence}% confidence
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {a.chainOfThought.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${severityCircle(a.severity)}`}>
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-100 mb-1">{step.step}</div>
                    <div className="text-sm text-slate-400 leading-relaxed">{step.reasoning}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk indicators */}
            <div className="mt-5 flex flex-wrap gap-2 pt-4 pb-2 border-t border-white/5">
              {a.riskIndicators.map((ind, i) => (
                <span key={i} className="rounded-full border border-slate-700/80 bg-slate-800/40 px-2.5 py-1 text-xs text-slate-400">
                  {ind}
                </span>
              ))}
            </div>

            {/* Recommendation */}
            <div className="mt-4 pt-5 border-t border-white/5 text-sm">
              <span className="text-slate-500">Recommendation: </span>
              <span className={`font-semibold ${recActionColor(a.aiRecommendation)}`}>
                {recLabel(a.aiRecommendation)}
              </span>
            </div>
          </div>

          {/* ── Conversation thread ── */}
          <div className="rounded-xl border border-white/5 bg-[#161B22] overflow-hidden mt-6">
            <button
              className="flex w-full items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
              onClick={() => setThreadOpen(v => !v)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={13} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-300">Conversation — {a.channel}</span>
                <span className="text-xs text-slate-600">{a.messages.length} messages</span>
              </div>
              {threadOpen
                ? <ChevronUp size={15} className="text-slate-600" />
                : <ChevronDown size={15} className="text-slate-600" />
              }
            </button>

            {threadOpen && (
              <div className="flex flex-col border-t border-white/5">
                {a.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 px-5 py-3 transition-opacity ${msg.flagged ? 'opacity-100' : 'opacity-40'}`}
                    style={msg.flagged
                      ? { borderLeft: `3px solid ${severityBorderColor(a.severity)}`, paddingLeft: '17px' }
                      : {}}
                  >
                    <span className="font-mono text-[11px] text-slate-600 shrink-0 mt-0.5 w-10 tabular-nums">
                      {msg.time}
                    </span>
                    <div className="text-sm">
                      <span className="font-semibold text-slate-200 mr-2">{msg.sender}</span>
                      <span className={`text-slate-300 leading-relaxed ${msg.flagged ? 'bg-yellow-400/[0.06] rounded px-0.5' : ''}`}>
                        {msg.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Sticky action bar ── */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 bg-[#0D1117] px-5 pt-4 pb-3">
        {dismissOpen && (
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 mr-1">Reason:</span>
            {DISMISS_REASONS.map(r => (
              <button
                key={r}
                onClick={() => {
                  onAction(a.id, 'dismissed', r)
                  setDismissOpen(false)
                }}
                className="rounded border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {r}
              </button>
            ))}
            <button onClick={() => setDismissOpen(false)} className="ml-auto text-slate-600 hover:text-slate-400">
              <X size={13} />
            </button>
          </div>
        )}

        {escalateOpen && (
          <div className="mb-2.5 flex gap-2">
            <input
              value={escalateNote}
              onChange={e => setEscalateNote(e.target.value)}
              placeholder="Add manager note (optional)…"
              className="flex-1 rounded border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-red-500/50 transition-colors"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onAction(a.id, 'escalated', escalateNote)
                  setEscalateOpen(false)
                  setEscalateNote('')
                }
              }}
            />
            <button
              onClick={() => {
                onAction(a.id, 'escalated', escalateNote)
                setEscalateOpen(false)
                setEscalateNote('')
              }}
              className="flex items-center gap-1.5 rounded bg-red-600/80 hover:bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors"
            >
              <Send size={12} />
              Escalate
            </button>
            <button onClick={() => setEscalateOpen(false)} className="text-slate-600 hover:text-slate-400 px-1">
              <X size={13} />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              onAction(a.id, 'confirmed')
              setDismissOpen(false)
              setEscalateOpen(false)
            }}
            className="flex items-center gap-1.5 rounded bg-emerald-700 hover:bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            <CheckCircle size={14} />
            Confirm
          </button>
          <button
            onClick={() => {
              setDismissOpen(v => !v)
              setEscalateOpen(false)
            }}
            className="flex items-center gap-1.5 rounded bg-slate-700 hover:bg-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition-colors"
          >
            <XCircle size={14} />
            Dismiss
          </button>
          <button
            onClick={() => {
              setEscalateOpen(v => !v)
              setDismissOpen(false)
            }}
            className="flex items-center gap-1.5 rounded border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition-colors"
          >
            <ArrowUpRight size={14} />
            Escalate
          </button>
          <button className="ml-auto flex items-center gap-1.5 rounded border border-slate-700 bg-transparent hover:bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-400 transition-colors">
            <MessageSquare size={14} />
            Request Context
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ALERT TRIAGE TAB ────────────────────────────────────────────────────────

function AlertTriageTab() {
  const [alerts, setAlerts] = useState(ALERTS)
  const [selectedId, setSelectedId] = useState(ALERTS[0].id)
  const [stats, setStats] = useState(DAILY_STATS)
  const [toast, setToast] = useState(null)

  const pendingAlerts = alerts.filter(a => a.status === 'pending')
  const selectedAlert = alerts.find(a => a.id === selectedId) ?? null

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleAction = (id, status, detail) => {
    const alert = alerts.find(a => a.id === id)
    if (!alert) return

    // update alert status
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a))

    // compute agreement: escalate→escalated, dismiss→dismissed, review→confirmed
    const agreed =
      (status === 'escalated' && alert.aiRecommendation === 'escalate') ||
      (status === 'dismissed' && alert.aiRecommendation === 'dismiss') ||
      (status === 'confirmed' && alert.aiRecommendation === 'review')

    setStats(prev => {
      const totalReviewed = ALERTS.length - prev.queueRemaining
      const prevAgreedCount = Math.round(prev.aiAgreementRate * totalReviewed / 100)
      const newAgreedCount = prevAgreedCount + (agreed ? 1 : 0)
      const newTotalReviewed = totalReviewed + 1
      return {
        ...prev,
        queueRemaining: Math.max(0, prev.queueRemaining - 1),
        aiAgreementRate: newTotalReviewed > 0 ? Math.round((newAgreedCount / newTotalReviewed) * 100) : prev.aiAgreementRate,
        escalationsToday: status === 'escalated' ? prev.escalationsToday + 1 : prev.escalationsToday
      }
    })

    // advance to next pending
    const remaining = alerts
      .filter(a => a.id !== id && a.status === 'pending')
      .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])

    if (remaining.length > 0) {
      setSelectedId(remaining[0].id)
    }

    const label = status === 'confirmed' ? 'confirmed'
      : status === 'dismissed' ? 'dismissed'
      : 'escalated'
    showToast(`Alert ${label}${remaining.length > 0 ? ' — advancing to next' : ' — queue complete'}`)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <PulseStrip stats={stats} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <QueueRail
          alerts={pendingAlerts}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <DetailPanel alert={selectedAlert} onAction={handleAction} />
      </div>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}

// ─── PLACEHOLDER TAB ─────────────────────────────────────────────────────────

function PlaceholderTab({ label }) {
  return (
    <div className="flex flex-1 items-center justify-center text-sm text-slate-600">
      {label} — Phase 2
    </div>
  )
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'triage', label: 'Alert Triage' },
  { id: 'compliance', label: 'Compliance Metrics' },
  { id: 'product', label: 'Product Metrics' },
  { id: 'datascience', label: 'Data Science Metrics' },
]

// ─── ROOT ────────────────────────────────────────────────────────────────────

export default function PollyCDashboard() {
  const [activeTab, setActiveTab] = useState('triage')

  return (
    <div className="flex h-screen flex-col bg-[#0B0E11] text-slate-200 overflow-hidden">
      {/* Nav bar */}
      <nav className="flex shrink-0 items-center gap-1 border-b border-white/5 px-4">
        <div className="flex items-center gap-2 pr-5 py-3 mr-1 border-r border-white/5">
          <Shield size={15} className="text-cyan-400" />
          <span className="font-mono text-sm font-bold tracking-widest text-cyan-400">POLLY-C</span>
        </div>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px
              ${activeTab === t.id
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {activeTab === 'triage' && <AlertTriageTab />}
      {activeTab === 'compliance' && <PlaceholderTab label="Compliance Metrics" />}
      {activeTab === 'product' && <PlaceholderTab label="Product Metrics" />}
      {activeTab === 'datascience' && <PlaceholderTab label="Data Science Metrics" />}
    </div>
  )
}
