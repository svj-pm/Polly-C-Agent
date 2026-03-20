<!-- Personal context: ~/.agents/personal/ -->
<!-- Skills active: agent-architecture -->

<!-- Personal context: ~/.agents/personal/ -->
<!-- Skills active: claude-api-integration -->

# Communications Surveillance AI — Alert Triage & Model Performance Dashboard

## What this is
A single-file React (JSX) prototype demonstrating two products for a communications compliance SaaS platform:
1. An analyst-facing alert triage dashboard with AI chain-of-thought reasoning
2. An internal metrics dashboard with three persona views (compliance, product, data science)

## Domain context
Enterprise banks use communications surveillance tools (like Smarsh, Global Relay) to monitor trader/employee communications for regulatory violations. These tools capture messages across Bloomberg, Teams, email, voice, SMS and flag potential risks like insider trading (MNPI), market manipulation, off-channel communications, and conduct violations. FINRA and the SEC require firms to surveil communications and document their review process.

The AI layer analyzes flagged alerts, produces chain-of-thought reasoning explaining why a message is risky, assigns confidence scores, and recommends actions. Human analysts review the AI output, agree or disagree, and dispose of alerts. Their feedback trains the model.

## Tech stack
- Single JSX file, default export React component
- Tailwind utility classes for layout and styling
- Recharts for all charts (LineChart, BarChart, AreaChart, RadarChart, ResponsiveContainer)
- Lucide-react for icons
- No external API calls, no localStorage — all data is hardcoded synthetic constants
- Dark theme throughout

## Design direction
Dark background (#0B0E11 / #0D1117 range). Monospace font for IDs, metrics, timestamps. Sans-serif for everything else. Severity is the only color signal in the analyst view: critical=red-500, high=amber-500, medium=yellow-500, low=slate-400. Internal dashboard uses blue/teal/purple for categorical encoding. No gradients, no shadows heavier than shadow-sm. Professional terminal aesthetic — this is a tool for compliance professionals at top-tier banks, not a consumer app.

## Architecture
Four top-level tabs in a horizontal nav bar:
1. Alert Triage (analyst-facing)
2. Compliance Metrics (single-customer internal view)
3. Product Metrics (cross-customer health, head of product view)
4. Data Science Metrics (model quality fleet-wide, head of DS view)

All synthetic data lives in constants at the top of the file. State management via useState/useReducer at the App level.

## Build phases
Build and verify each phase before starting the next. Do not attempt to generate the entire file in one pass.

## Verification
After each phase: the component should render without errors, all tabs should be navigable, and all interactive elements should respond to clicks.