import { anthropic } from '../lib/anthropic.js'

export const summaryService = {
  summarizeIncident: async (prisma, id) => {
    // Fetch incident with all related data
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        errors: true,
        events: true,
      },
    })

    if (!incident) throw new Error(`Incident ${id} not found`)

    // Build a structured prompt from real data
    const prompt = `
You are an expert site reliability engineer analyzing an incident report.

INCIDENT:
- Title: ${incident.title}
- Severity: ${incident.severity}
- Status: ${incident.status}
- Service: ${incident.service || 'unknown'}
- Assignee: ${incident.assignee || 'unassigned'}
- Created: ${incident.createdAt}
- Resolved: ${incident.resolvedAt || 'not yet resolved'}
- Description: ${incident.description || 'none provided'}

LINKED ERRORS (${incident.errors.length}):
${incident.errors.length > 0
  ? incident.errors.map(e => `- [${e.status}] ${e.message} (service: ${e.service}, count: ${e.count})`).join('\n')
  : '- No linked errors'}

LINKED EVENTS (${incident.events.length}):
${incident.events.length > 0
  ? incident.events.map(e => `- [${e.type}] ${e.message} (service: ${e.service})`).join('\n')
  : '- No linked events'}

Please provide:
1. A concise plain-English summary of what happened (2-3 sentences)
2. Root cause assessment based on the available data
3. Current impact assessment
4. Recommended next steps (3-5 actionable items)
5. A risk score from 1-10 based on severity and error count

Format your response as JSON with these exact keys:
{
  "summary": "...",
  "rootCause": "...",
  "impact": "...",
  "nextSteps": ["...", "...", "..."],
  "riskScore": 7
}
`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    // Parse the JSON response
    const text = message.content[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  },
}