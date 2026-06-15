# SAGO Media Groups — AI Automation Intern Course
## 30-Day Production Curriculum | Rebuilt from Scratch

---

## First: What Was Wrong with the Gemini Version

Before the new structure, here's an honest diagnosis of why the previous version felt hollow:

| Problem | Why It Breaks the Course |
|---|---|
| **5 different restructures, no final decision** | Every time you pushed back, Gemini added a new version. The result is fragments, not a curriculum. |
| **Python Agent SDK in Week 2** | The intern just learned what a token is on Day 1. Asking her to write SDK scripts with tool permissions by Day 8 is a 3-month skill gap in one week. |
| **Too many tools** | Cursor + Claude Code CLI + n8n + Vercel + Python SDK + Git + Webhooks + JSON schemas + PostToolUse hooks = 10 tools for a beginner in 30 days. Impossible. |
| **"Master Project" was mentioned but never drove daily tasks** | Every week had a different project. The "unified" project was added last as a patch, not as the foundation. |
| **AI Foundations was one day** | Tokens, context windows, parameters, open vs closed source — all on Day 1. That's a week of content. |
| **Written for a developer, not a beginner** | Terms like "PostToolUse lifecycle hook," "async state orchestration," "BGA reballing" entered the conversation as if the intern already knows these. She doesn't. |

**The core mistake:** Gemini was optimizing for impressiveness, not for what a beginner can actually absorb in 90 hours.

---

## The Honest Constraints

**Total time:** 30 days × 3 hrs/day = **90 hours**

**What is actually possible in 90 hours for a CS student beginner:**
- ✅ Understand what LLMs are and how to communicate with them effectively
- ✅ Build and deploy a real website using AI-assisted coding
- ✅ Understand what APIs and JSON are at a working level
- ✅ Build a simple n8n automation workflow that runs reliably
- ✅ Make Claude automatically process a form submission
- ✅ Send a notification with the AI-generated output

**What is NOT possible in 90 hours starting from beginner:**
- ❌ Writing production Python Agent SDK scripts
- ❌ Complex agentic loops with memory and state management
- ❌ Advanced HITL with Wait/Form nodes in n8n
- ❌ Mastering Git workflows deeply
- ❌ Custom API error handling and retry logic
- ❌ PostToolUse hooks, audit logs, and observability

If you try to teach what's in the ❌ list, the intern finishes the month knowing nothing deeply. She will have touched 12 things and mastered zero.

---

## The Core Tool Stack (Final, No More Changes)

| Tool | What It Does | Why This One |
|---|---|---|
| **Cursor** | AI-powered code editor | Writes the code for her; she directs |
| **Claude.ai / API** | The AI brain | Reads client data, writes proposals |
| **n8n (local)** | Automation / the pipes | Connects the website to Claude |
| **Vercel** | Deploys the website live | One-click deployment from GitHub |
| **GitHub** | Saves and versions the code | Basic, essential |

That's 5 tools. That's the ceiling. No Python SDK. No Claude Code CLI until she is confident in the above 5.

---

## The One Master Project

**SAGO Client Autopilot**

A real, live, production system where:
1. A client visits SAGO's website and fills out a project inquiry form
2. n8n catches the submission automatically
3. Claude reads the messy form data and writes a professional proposal
4. Gokul receives an email with the proposal for review

**That's the finish line. Every single day builds one part of this machine.**

---
---

## WEEK 1: AI FOUNDATIONS
### "Understand the engine before you drive it"
**Goal:** By Day 5, Vaishnavadevi can explain what an LLM is, what tokens are, why prompt quality matters, and what each tool in the stack does — in her own words, without notes.

**Format every day:** 1 hour concept (whiteboard, no laptops) → 2 hours hands-on

---

### Day 1: What Is AI? What Are LLMs?

**Hour 1 — Concept (Whiteboard)**

Core question to answer: *"When you type into Claude, what is actually happening?"*

Topics:
- What is machine learning? Simple analogy: a child learning to recognize a cat by seeing 10,000 cats. A model learns patterns by reading billions of pages.
- What is an LLM (Large Language Model)? It predicts the next most likely word, then the next, then the next. That's it. No magic.
- LLMs vs image models vs voice models — different jobs, different tools. We're only using LLMs.
- Examples of LLMs: Claude (Anthropic), GPT-4 (OpenAI), Gemini (Google), Llama (Meta)
- What is "training"? What is "inference"? Training = learning phase (done once, by the company). Inference = using it (what happens every time you type a message).

**Feynman Check:** Ask her: *"Explain what an LLM is to someone who has never heard of it. Use one analogy."* She must do this before the laptop opens.

**Hours 2-3 — Hands-on**
- Create accounts: Claude.ai, ChatGPT (free), Gemini
- Task: Ask each one the same question — "Write a 3-sentence pitch for a media agency that does AI automation"
- Compare the three outputs side by side
- Write down: What was different? Which was better? Why?
- Observation log: She writes one paragraph on what she noticed

---

### Day 2: Tokens, Context Windows, and Model Size

**Hour 1 — Concept (Whiteboard)**

Core question: *"Why does the AI sometimes 'forget' what you said earlier? Why do different AI models cost different amounts?"*

Topics:
- **What is a token?** Not a word — roughly ¾ of a word. "hamburger" = 3 tokens. The AI doesn't read English, it reads numbers (token IDs).
- **Why tokens matter:** Every API call costs money per token. Knowing this = knowing how to build cheap, efficient systems.
- **Context window = short-term memory.** Claude Sonnet = ~200,000 tokens. That's ~500 pages. If you exceed this, the AI forgets the beginning of the conversation. This is why we don't dump entire codebases into one prompt.
- **Parameters = brain size.** More parameters = more capable but slower and costlier. A 7 billion parameter model is good for simple tasks. A 100B+ model (like Claude Sonnet/Opus) is needed for reasoning and writing.
- **Practical rule for SAGO:** Use the smallest model that does the job. Save the big models for complex tasks.

**Feynman Check:** *"If a client sends us a 200-page PDF of meeting notes, what problem does that create for the AI? How would you solve it?"* (Expected answer: it might exceed the context window. Solution: summarize sections before sending.)

**Hours 2-3 — Hands-on**
- Open: platform.openai.com/tokenizer (or similar token counter)
- Task 1: Paste different texts, count the tokens. See how long a SAGO proposal would be in tokens.
- Task 2: Deliberately try to break the context window — paste a very long document into Claude, ask it a question about the beginning. See if it answers accurately.
- Task 3: Look up Claude API pricing at anthropic.com. Calculate: if 1,000 client intakes come in per month, how much would processing them cost?
- Write a one-paragraph reflection: "What surprised me?"

---

### Day 3: Prompt Engineering — The Core Skill

**Hour 1 — Concept (Whiteboard)**

Core question: *"Why does the same AI give great answers sometimes and terrible answers other times?"*

Topics:
- **What is a prompt?** The instruction you give the AI. Garbage in = garbage out.
- **System prompt vs user prompt:** System prompt = the law the AI must follow always. User prompt = the specific task right now.
- **The anatomy of a strong prompt:**
  1. Role — "You are a professional proposal writer for a media agency"
  2. Context — "SAGO Media Groups is a 2-person AI automation agency in India"
  3. Task — "Write a project proposal based on the following client brief"
  4. Format — "Use this structure: Summary, Deliverables, Timeline, Price"
  5. Constraints — "Keep it under 300 words. Do not add anything not mentioned in the brief."
- **What is hallucination?** The model generates confident-sounding text that is wrong. It happens because the model is predicting likely next words, not retrieving facts. Solution: give it the facts in the prompt instead of asking it to recall them.
- **Zero-shot vs Few-shot:** Zero-shot = just instructions. Few-shot = instructions + examples. Examples dramatically improve quality.

**Feynman Check:** Write two prompts for the same task on the whiteboard. A bad one and a good one. Ask her to explain why one is better.

**Hours 2-3 — Hands-on**
- Prompt challenge: get Claude to write a SAGO proposal for a client who wants "a website with animations and modern design"
  - Round 1: Vague prompt — see a vague output
  - Round 2: Add role + context — see improvement
  - Round 3: Add format + constraints + a few-shot example — see a professional output
- Write SAGO's first "master system prompt" for client proposal generation
- Save it in a text file: `sago_system_prompt_v1.txt`

---

### Day 4: The Tool Map — What Does What, and Why

**Hour 1 — Concept (Whiteboard)**

Core question: *"What is each tool's job? Why are we using these 5 and not the other 50 that exist?"*

Draw this on the whiteboard and walk through it:

```
[Client fills form on SAGO Website]
         ↓
[Vercel serves the website]  ←  [GitHub holds the code]  ←  [Cursor wrote the code]
         ↓
[n8n catches the form data via Webhook]
         ↓
[n8n sends the data to Claude API]
         ↓
[Claude writes the proposal]
         ↓
[n8n emails Gokul the proposal]
```

Explain each tool's job:
- **Cursor** — the code editor. AI helps write the website code. She is the art director, not the typist.
- **GitHub** — version history. If the AI breaks the code, she rolls back to the last save.
- **Vercel** — puts the website on the internet. Watches GitHub for changes and publishes automatically.
- **n8n** — the automation plumber. Catches the form, talks to Claude, sends the email. No coding required.
- **Claude API** — the brain. Reads the messy client brief, writes the professional proposal.

Why NOT using Python SDK right now:
- It requires knowing Python syntax, library management, async programming
- n8n does the same job visually, reliably, with less failure risk
- After 30 days, if she wants to go deeper — Python is the next step

**Hours 2-3 — Hands-on**
- Install everything:
  - Node.js (nodejs.org) — required for Cursor and n8n
  - Cursor IDE (cursor.sh)
  - Create GitHub account
  - Create Vercel account (vercel.com)
  - Create Anthropic account (console.anthropic.com), get API key
- Store the API key safely in a `.env` file
- Lesson: **NEVER put API keys in code. Never push a .env file to GitHub.** Show her what happens if someone finds a leaked API key.
- Verify everything works: open Cursor, ask it a question in the AI panel

---

### Day 5: Week 1 Review + The Feynman Final Test

**Hour 1 — Concept (No Whiteboard — She Teaches)**

Role reversal: Vaishnavadevi teaches Gokul.

She must explain, without notes:
1. What is an LLM and how does it work?
2. What is a token? Why does it matter for building systems?
3. What is a context window? What happens if you exceed it?
4. What is the difference between a system prompt and a user prompt?
5. Draw the master project architecture from memory
6. What does each tool do in the stack?

If she can't explain something clearly → that's what gets reviewed in Hours 2-3.

**Hours 2-3 — Consolidation**
- She writes a "Week 1 Summary" document in her own words (not copy-paste from notes)
- She draws the master project architecture and labels every arrow
- Practice prompt: write a SAGO system prompt from scratch for proposal generation
- Preview: "Next week, we're building the website where this all starts."

**Week 1 Milestone:**
> She can explain what an LLM is, what tokens and context windows are, why prompt quality matters, and what each tool does — without notes. All 5 tools are installed and working.

---
---

## WEEK 2: THE INPUT LAYER — Build the Website + Form
### "If there's no form, there's no data. If there's no data, nothing works."
**Goal:** By Day 10, SAGO's website is live on the internet. The client intake form works. A fake client can submit a project request, and the data saves correctly.

---

### Day 6: How the Web Works (Simplified)

**Hour 1 — Concept**
- What is HTML, CSS, JavaScript — in plain English only
- What is a component? (A reusable block — like a LEGO brick)
- What is Next.js? A framework — a pre-built set of LEGO rules so we don't start from scratch
- What is Tailwind CSS? Styling using class names instead of writing raw CSS
- What is "responsive design"? The site adapts to mobile, tablet, desktop
- What is "dark mode"? And why it suits SAGO's aesthetic

**Hours 2-3 — Hands-on**
- Open Cursor, run: `npx create-next-app@latest sago-website`
- Explore the file structure — she asks Cursor's AI "What does this file do?" for each file
- Make one small change using Cursor AI: change the homepage heading to say "SAGO Media Groups"
- See it update in the browser

---

### Day 7: Building the SAGO Landing Page

**Hour 1 — Concept**
- What makes a good agency website? (Hierarchy, whitespace, clear call-to-action)
- "Vibe Coding" = you are the art director, AI is the developer
- How to give visual instructions to AI: be specific about color, layout, mood
- What is a Hero section? Services section? About section?

**Hours 2-3 — Hands-on**
- Use Cursor AI to build the landing page:
  - Hero: "SAGO Media Groups — We Build AI-Powered Media Systems"
  - Services section: 3 service cards
  - About section: 2-person team, bootstrapped MSME
- Prompt example for Cursor: *"Build a dark-mode responsive Hero section for SAGO Media Groups, a 2-person AI automation agency. Use Tailwind CSS. Include a headline, a subheadline, and a 'Get Started' button."*
- Review output → give feedback → iterate at least 2 rounds
- She is practicing: communicate visual intent → review → correct

---

### Day 8: Building the Client Intake Form

**Hour 1 — Concept**
- What is a form? What is "form state"?
- What happens when someone clicks Submit? (Data goes somewhere)
- What is JSON? Why APIs speak JSON, not plain English
- Connect the dots: Form → JSON data → n8n (next week) → Claude

**Hours 2-3 — Hands-on**
- Build the client intake form with these fields:
  - Client Name (text)
  - Company Name (text)
  - Project Type (dropdown: Website / App / Automation / Other)
  - Project Description (large text area — clients type messy here)
  - Budget Range (dropdown)
  - Contact Email (email field)
- Wire up basic form state using Cursor AI
- On submit: `console.log` the data as JSON first, just to see it
- Test: fill in a fake client submission, confirm data appears correctly

---

### Day 9: Git + GitHub + Vercel Deployment

**Hour 1 — Concept**
- Git = save game checkpoints for code. If AI breaks something, you roll back.
- 3 commands she needs to know: `git add`, `git commit`, `git push`
- GitHub = cloud storage for code (+ collaboration)
- Vercel = watches GitHub, publishes automatically when code is pushed
- What is a domain? (She'll use the auto-generated Vercel URL for now)

**Hours 2-3 — Hands-on**
- `git init` in the project folder
- Create `.gitignore`, add `.env` to it (API key protection)
- `git add .` → `git commit -m "SAGO website v1"` → push to GitHub
- Connect GitHub repo to Vercel
- Watch the live URL generate
- **The test:** Go to the live URL. Fill out the intake form as a fake client. Does everything work?

---

### Day 10: Week 2 Polish + Review

**Hour 1 — Concept**
- What is debugging? Systematic approach: reproduce → isolate → fix → test
- Code review: what to look for (broken on mobile? missing labels? confusing fields?)

**Hours 2-3 — Hands-on**
- Review the live site critically — what's broken? What's confusing?
- Use Cursor AI to fix visual issues
- Improve form UX: better placeholder text, required field validation
- Push changes to GitHub → auto-deploys to Vercel
- Add SAGO logo/branding if ready

**Week 2 Milestone:**
> SAGO's website is live on the internet. The client intake form works. A fake client can submit their project details. The data appears correctly. GitHub and Vercel are connected.

---
---

## WEEK 3: THE BRAIN + THE PIPES
### "Wire everything together. Make it run without a human."
**Goal:** By Day 15, the full automation works: client submits form → n8n catches it → Claude reads it and writes a proposal → output is visible in n8n.

---

### Day 11: What Is an API?

**Hour 1 — Concept**
- API = a waiter between two kitchens. You order (request), the kitchen cooks (processes), the waiter brings food (response).
- What is a request? What is a response?
- What is a Webhook? — "Don't call me, I'll call you." Instead of checking constantly if new data arrived, you register a URL that gets called automatically when something happens.
- JSON format: key-value pairs. This is the language APIs speak.

**Hours 2-3 — Hands-on**
- Use browser or Postman to make a direct Claude API call manually
- Send a raw prompt via API, see the JSON response structure
- Read the response: `data.content[0].text` — where is the actual answer?
- Manually send the fake client intake data from Day 8 to Claude via API
- See what Claude returns as a raw API response

---

### Day 12: Introduction to n8n

**Hour 1 — Concept**
- What is n8n? Visual automation — connect services without writing code
- What is a "node"? A single action (receive data, send email, call API, etc.)
- What is a "workflow"? A chain of nodes
- n8n in the master project: it sits between the website and Claude
- Tour the n8n interface: Canvas, nodes, connections, execution log

**Hours 2-3 — Hands-on**
- Install n8n locally: `npx n8n`
- Open `localhost:5678` in browser
- Build Workflow 1 (simplest possible): Manual Trigger → Set node (set a value) → see it in execution
- Build Workflow 2: Webhook trigger → Respond with "Hello, SAGO"
- Test Workflow 2: trigger the webhook from the browser, see the response

---

### Day 13: Catching Form Data with n8n

**Hour 1 — Concept**
- Recap: how does the form data get TO n8n? Answer: the form POSTs to a webhook URL
- What is POST vs GET?
- Data mapping: n8n receives all the form fields, she picks what to use
- Error handling basics: what if a field is missing?

**Hours 2-3 — Hands-on**
- In n8n: create a Webhook node, copy its URL
- In the Next.js project: update the form submit function to POST to the n8n webhook URL
- Fill out the form on the live site → watch n8n receive the data in real time
- Add a "Set" node to extract just the project description field
- Add an "If" node: if the description is less than 10 words, stop — the submission is incomplete

---

### Day 14: Connecting n8n to Claude

**Hour 1 — Concept**
- How does n8n talk to Claude? HTTP Request node → Anthropic API endpoint
- How to build the prompt inside n8n using the form data
  - System prompt: set the rules for Claude (write a proposal for SAGO)
  - User prompt: the actual client data from the form
- What should Claude output? A proposal with: Summary, Deliverables, Timeline, Estimated Price
- Introduce few-shot prompting in the n8n prompt: give Claude one example of a good proposal

**Hours 2-3 — Hands-on**
- Add an HTTP Request node in n8n
- Configure it to POST to `https://api.anthropic.com/v1/messages`
- Set headers: `x-api-key`, `anthropic-version`, `content-type`
- Build the prompt using n8n's expression syntax to inject form data:
  ```
  System: You are a proposal writer for SAGO Media Groups, a 2-person AI automation agency.
  Write a professional project proposal based on this client intake:
  Client: {{$json["clientName"]}}
  Company: {{$json["company"]}}
  Description: {{$json["description"]}}
  Output format: Project Summary / Deliverables / Timeline / Price Range
  ```
- Run the full flow: Form → n8n → Claude → See the proposal output in n8n's execution panel

---

### Day 15: Full Flow Test + Week 3 Polish

**Hour 1 — Concept**
- Systematic testing: what are the failure points in this chain?
  1. Form doesn't submit → check the fetch URL
  2. n8n doesn't receive → check webhook is active
  3. Claude doesn't respond → check API key and headers
  4. Proposal looks bad → improve the prompt
- How to read n8n error messages

**Hours 2-3 — Hands-on**
- Test with 3 different fake client submissions: simple, complex, and messy/incomplete
- Evaluate proposal quality — is it actually useful for SAGO?
- Refine the prompt based on what Claude produces
- Bonus: add a Google Sheets node at the end — log every submission with client name, date, and the proposal

**Week 3 Milestone:**
> The full automation runs without human involvement. Client fills form → n8n catches it → Claude generates a proposal → visible in n8n execution log.

---
---

## WEEK 4: THE OUTPUT + POLISH + DEMO
### "Make it production-ready. Then prove it works."
**Goal:** By Day 20, Gokul receives an email with the AI-generated proposal whenever a client submits. The system handles bad inputs. Vaishnavadevi demos the full product live.

---

### Day 16: Email Notifications

**Hour 1 — Concept**
- The final missing piece: making the output reach a human
- What is SMTP? What is an email API?
- Options: Gmail node in n8n (easiest), or Resend (cleaner for production)
- The SAGO notification email structure: Subject, proposal body, client details

**Hours 2-3 — Hands-on**
- Add Gmail node to n8n (connect Google account via OAuth)
- Configure email:
  - To: Gokul's email
  - Subject: `New SAGO Client Proposal — {{$json["clientName"]}}`
  - Body: the Claude-generated proposal
- Test: submit form → email arrives in Gokul's inbox with the full proposal
- Review the email — does it look professional? Is anything missing?

---

### Day 17: Improving Proposal Quality

**Hour 1 — Concept**
- Few-shot prompting in depth: showing Claude an example of the ideal output
- Prompt engineering as iteration: treat each version as v1, v2, v3
- Structured output: making Claude follow a rigid format consistently

**Hours 2-3 — Hands-on**
- Improve the Claude prompt — add a complete example of a good SAGO proposal
- Run 3 different client submissions, compare old vs new proposal quality
- Iterate until the proposal looks like something Gokul would actually send to a real client
- Save the final prompt as the official `sago_proposal_prompt_v2.txt`

---

### Day 18: Edge Cases + Input Validation

**Hour 1 — Concept**
- What is an "edge case"? Things you didn't plan for
- Examples: empty form, one-word description, gibberish text, a 5,000-word essay
- Two places to add protection: the frontend form (validation) and the n8n workflow (filtering)
- Why this matters in production: one bad input can break the whole chain

**Hours 2-3 — Hands-on**
- Frontend: add required field validation to the form — can't submit without name, email, description
- n8n: add an "If" node — if description word count < 15 words, send a different email: "Incomplete brief received — please follow up with client"
- Test all edge cases deliberately:
  - Empty form → blocked by validation
  - 3-word description → caught by n8n filter
  - 1,000-word description → Claude handles it, check output quality

---

### Day 19: Documentation + Full System Test

**Hour 1 — Concept**
- What is documentation? Why does it matter?
- 6 months from now, Vaishnavadevi or Gokul needs to fix something. Will they remember how it works?
- A simple "How This Works" doc is enough — no need for enterprise-level documentation

**Hours 2-3 — Hands-on**
- Full end-to-end test with 3 completely new fake client scenarios (don't reuse old ones)
- Vaishnavadevi writes a 1-page "SAGO Client Autopilot — How It Works" document:
  - What each part does
  - How to update the Claude prompt
  - How to restart n8n if it stops
  - How to deploy a new website update
- Fix any remaining bugs found during the final test
- Take screenshots of n8n workflow, the email output, and the live site

---

### Day 20: Demo Day

**Hour 1 — Reflection + Preparation**
- What did she learn this month?
- What was the hardest part and why?
- What would she build differently?
- Preview: what would Month 2 look like? (Python, Claude SDK, advanced agents)

**Hours 2-3 — Live Demo**
- Vaishnavadevi runs the full demo to Gokul:
  - She explains every component: what it is, why it exists, how it connects to the next piece
  - She shows the n8n workflow
  - She shows the Claude prompt and explains why it's written that way
  - Gokul fills in the form as a real client with a realistic brief
  - The full system runs live: form → n8n → Claude → email
  - Gokul reviews the email: is this something he'd actually send to a client?

**Final Evaluation:**
| Criterion | Pass Condition |
|---|---|
| AI Literacy | Can explain tokens, context, prompts without notes |
| Website | Live on Vercel, form works, looks professional |
| Automation | n8n workflow runs without errors |
| Proposal Quality | Email output is usable as a real SAGO proposal |
| Edge Cases | Invalid inputs handled correctly |
| Documentation | 1-page system doc exists |

**Week 4 / Course Milestone:**
> SAGO Media Groups has a live, working AI-automated client intake system. Zero manual work required between a client submitting their brief and Gokul receiving a ready-to-send proposal.

---
---

## What Comes After (Month 2 Roadmap — If She Continues)

If Vaishnavadevi completes this and wants to go deeper, here's a realistic Month 2:

**Week 1:** Python basics — variables, functions, loops, reading files. (She now has real context for WHY she's learning this.)

**Week 2:** Claude Python SDK — the programmatic version of what n8n did visually. Same concept, more control.

**Week 3:** RAG basics — giving Claude a knowledge base. Connect a SAGO document library so Claude answers questions from real company data.

**Week 4:** Advanced agents — tool calling, multi-step reasoning, state management with LangGraph or n8n's advanced AI nodes.

This sequencing matters. None of Month 2 would make sense without Month 1 as the foundation.

---

## Quick Comparison: Old vs New

| Old (Gemini Version) | New (This Version) |
|---|---|
| Python SDK in Week 2 | No Python SDK — n8n handles Claude API calls visually |
| 10+ tools introduced | 5 tools, used deeply |
| Complex HITL with Wait nodes | Simple email notification — human reviews, replies if needed |
| Agentic loops and PostToolUse hooks | Not in this course — Month 2 content |
| "Master project" added as an afterthought | Every day builds one piece of the master project |
| 1 day for AI foundations | 5 full days for proper AI foundations |
| Multiple restructures, no final direction | One structure, no changes |

---

*Course designed for SAGO Media Groups — June 10 to July 10, 2026*
*Intern: Vaishnavadevi S M | Mentor: Gokul*
