# Module 3: Understanding AI-Assisted Development

## Course: AI for Development Firm Executives
### Duration: 60-75 minutes
### Format: Presentation with demonstrations and discussion

---

## Learning Objectives

By the end of this module, participants will be able to:

1. Understand what AI-assisted coding actually looks like in daily developer workflows
2. Explain the key use cases: code generation, debugging, refactoring, and documentation
3. Set realistic expectations for AI's impact on developer productivity
4. Articulate what AI can and cannot do in software development
5. Ask informed questions to development leads about AI tool adoption
6. Evaluate claims about AI-augmented team productivity

---

## Section 1: What AI-Assisted Coding Actually Looks Like

### The Reality vs. The Hype

**What executives often imagine:**
> "AI writes the code, developers review it, projects finish in half the time"

**What actually happens:**
> "AI is a powerful collaborator that handles routine tasks, suggests approaches, and accelerates specific activities—but developers still drive decisions, architecture, and quality"

### A Day in the Life: AI-Augmented Developer

**Morning: Starting a new feature**

| Without AI | With AI |
|------------|---------|
| Read spec, plan approach (30 min) | Read spec, ask AI to suggest approach, refine (20 min) |
| Look up API documentation (15 min) | Ask AI to explain API usage with examples (5 min) |
| Write boilerplate code (20 min) | AI generates boilerplate, developer reviews (8 min) |
| **Total: 65 minutes** | **Total: 33 minutes** |

**Midday: Debugging an issue**

| Without AI | With AI |
|------------|---------|
| Reproduce issue (15 min) | Reproduce issue (15 min) |
| Read error messages, Google solutions (20 min) | Paste error to AI, get explanations (5 min) |
| Try fixes, iterate (30 min) | AI suggests targeted fixes, faster iteration (15 min) |
| **Total: 65 minutes** | **Total: 35 minutes** |

**Afternoon: Code review and documentation**

| Without AI | With AI |
|------------|---------|
| Review PR manually (30 min) | AI pre-reviews, highlights issues (20 min) |
| Write documentation (45 min) | AI generates docs, developer edits (20 min) |
| **Total: 75 minutes** | **Total: 40 minutes** |

**Key insight for Tim to share:** *"AI doesn't replace the thinking—it reduces the friction between thinking and doing. The developer still needs to know what good code looks like, but they spend less time typing it."*

### Live Demo Concept (if possible)

**Show a brief demonstration of:**
1. Opening a coding assistant (Copilot, Cursor, or Claude)
2. Describing a function in plain English
3. AI generating code
4. Developer reviewing and adjusting
5. Using AI to add tests and documentation

*If live demo isn't possible, use screenshots or a pre-recorded video*

---

## Section 2: Code Generation, Debugging, Refactoring, and Documentation

### Code Generation

**What AI does well:**
- Boilerplate code (setup, configuration, standard patterns)
- CRUD operations (create, read, update, delete)
- Common algorithms and data structures
- API integrations using well-documented APIs
- Converting pseudocode or descriptions into working code
- Generating similar code from examples ("write another function like this one")

**What AI struggles with:**
- Novel algorithms or unique business logic
- Complex system architecture decisions
- Code that requires deep domain knowledge
- Performance-critical code optimization
- Security-sensitive implementations
- Code that must integrate with poorly documented legacy systems

**Realistic productivity impact:**
- **Boilerplate/routine code:** 50-70% time reduction
- **Standard features:** 30-40% time reduction
- **Complex/novel features:** 10-20% time reduction (mostly research/exploration)
- **Architecture decisions:** Minimal impact (AI can suggest, human must decide)

### Debugging

**How developers use AI for debugging:**

1. **Error explanation**
   ```
   Developer: "What does this error mean and how do I fix it?"
   [pastes error message and relevant code]
   
   AI: [explains error, identifies likely causes, suggests fixes]
   ```

2. **Rubber duck debugging (AI as thinking partner)**
   ```
   Developer: "This function should return X but it's returning Y. 
   Here's the code... Walk me through what's happening."
   
   AI: [traces through logic, identifies where behavior diverges from intent]
   ```

3. **Suggesting debugging approaches**
   ```
   Developer: "The app crashes intermittently when users upload files. 
   What should I check?"
   
   AI: [suggests systematic debugging approach, common causes for file upload issues]
   ```

**Important limitation:** AI can't run code or observe actual runtime behavior. It analyzes code statically and makes inferences based on patterns.

### Refactoring

**High-value AI refactoring tasks:**

1. **Code modernization**
   - Converting callbacks to async/await
   - Updating deprecated API usage
   - Applying new language features

2. **Pattern application**
   - Extracting repeated code into functions
   - Applying design patterns
   - Improving code organization

3. **Code cleanup**
   - Renaming variables for clarity
   - Simplifying complex conditionals
   - Removing dead code

**Example prompt for refactoring:**
```
"Refactor this function to:
1. Use modern JavaScript (ES6+)
2. Handle errors more gracefully
3. Make it more testable
4. Improve readability

Explain each change you make and why.

[paste code]"
```

### Documentation

**AI is exceptionally good at documentation:**

1. **Code comments**
   - Explain what functions do
   - Document parameters and return values
   - Add inline comments for complex logic

2. **README files**
   - Generate project documentation from code
   - Create setup instructions
   - Document API endpoints

3. **Technical specifications**
   - Convert code into technical documentation
   - Generate architecture diagrams (in text form, like Mermaid)
   - Create API documentation

4. **User documentation**
   - Write user guides from technical specs
   - Create FAQ sections
   - Generate help content

**Productivity impact on documentation:** 60-80% time reduction

**Why this matters for executives:** Documentation is often neglected because it's time-consuming. AI makes it practical to maintain good documentation, which improves knowledge transfer, onboarding, and maintainability.

---

## Section 3: How AI Changes Developer Workflows and Velocity

### The New Development Workflow

**Traditional workflow:**
```
Think → Search → Type → Debug → Repeat
```

**AI-augmented workflow:**
```
Think → Describe → Review → Refine → Verify
```

**Key shift:** Developers move from "writing code" to "directing code generation and ensuring quality"

### Velocity Impacts by Activity

| Activity | Traditional Time | AI-Assisted Time | Productivity Gain |
|----------|------------------|------------------|-------------------|
| Writing new features | 100% | 60-70% | 30-40% faster |
| Bug fixes | 100% | 65-75% | 25-35% faster |
| Code reviews | 100% | 70-80% | 20-30% faster |
| Documentation | 100% | 25-40% | 60-75% faster |
| Learning new tech | 100% | 50-60% | 40-50% faster |
| Testing/test writing | 100% | 60-70% | 30-40% faster |

**Overall expected productivity improvement: 25-40%**

*Sources: Based on GitHub's research (Copilot studies), Microsoft Research, and industry reports from 2023-2024*

### What Doesn't Change

**AI doesn't speed up:**
- Requirement gathering and clarification
- Architecture and design decisions
- Stakeholder communication
- Meetings and coordination
- Understanding complex business domains
- Security reviews and compliance verification
- Integration testing with external systems

**Critical insight:** If your projects are delayed by unclear requirements, scope changes, or communication issues, AI won't fix that. AI accelerates the coding part of software development, which is often only 30-40% of total project time.

### Team Dynamics

**How AI changes team composition:**

| Before AI | With AI |
|-----------|---------|
| More juniors for routine work | Juniors leverage AI for speed, seniors still needed for judgment |
| Clear "typing speed" productivity differences | Productivity based more on problem-solving ability |
| Documentation specialists sometimes needed | Documentation becomes part of normal workflow |
| Heavy code review burden on seniors | AI pre-screens, seniors focus on architecture/design review |

**The experience paradox:** AI helps junior developers most with routine tasks, but seniors benefit most because they can better evaluate and direct AI output.

---

## Section 4: Setting Realistic Expectations

### What to Expect from AI-Augmented Teams

**Reasonable expectations:**
- **First week:** Learning curve, possible slowdown as developers adapt
- **First month:** Modest productivity gains (10-20%) as workflows adjust
- **3 months:** Significant gains (25-35%) as best practices emerge
- **6 months:** Full productivity potential (30-40%) with mature workflows

**Unreasonable expectations:**
- ❌ "We can do the same work with half the team"
- ❌ "Projects will be done in half the time"
- ❌ "We don't need senior developers anymore"
- ❌ "We can skip code reviews because AI wrote it"
- ❌ "AI will eliminate bugs"

### Quality Considerations

**AI-generated code requires review because:**

1. **AI can introduce subtle bugs**
   - Logic errors that look correct
   - Edge cases not handled
   - Incorrect assumptions about requirements

2. **AI doesn't know your codebase context**
   - May suggest patterns inconsistent with existing code
   - Doesn't understand your team's conventions
   - Can't see the full system architecture

3. **Security vulnerabilities**
   - AI may use insecure patterns from training data
   - Can introduce injection vulnerabilities
   - May expose sensitive data in logging

4. **AI hallucinates**
   - May use APIs that don't exist
   - Can suggest libraries that have been deprecated
   - May invent function signatures

**Key message for Tim:** *"AI-generated code is like a first draft from a junior developer who has read a lot but doesn't know your specific system. It's a great starting point, but it needs experienced review."*

### Evaluating AI-Assisted Output

**Quality checklist for AI-generated code:**

- [ ] Does it correctly implement the requirements?
- [ ] Does it handle edge cases and errors?
- [ ] Is it consistent with our coding standards?
- [ ] Are there security implications?
- [ ] Is it maintainable and readable?
- [ ] Does it have appropriate tests?
- [ ] Is it properly documented?

**The "10x review" rule:** AI might generate code 10x faster, but don't reduce review time. The code still needs the same scrutiny.

---

## Section 5: Questions to Ask Your Development Leads

### Understanding Current State

**Questions to assess readiness:**

1. "What AI coding tools are our developers currently using, if any?"
2. "What's blocking us from using AI tools more extensively?"
3. "What concerns do developers have about AI assistance?"
4. "Where do developers spend most of their time that AI could help with?"

### Planning for Adoption

**Questions about implementation:**

1. "What's a reasonable pilot project to test AI tools?"
2. "How should we measure the impact of AI tools?"
3. "What security and compliance considerations do we need to address?"
4. "What training do our developers need?"
5. "How will code review processes need to change?"

### Setting Expectations

**Questions about productivity:**

1. "Realistically, what productivity improvement should we expect?"
2. "What tasks will see the biggest gains? The least?"
3. "How long before we see meaningful improvement?"
4. "What could go wrong, and how do we mitigate it?"

### Evaluating Claims

**If a team claims significant AI productivity gains, ask:**

1. "How are you measuring this? What's the baseline?"
2. "What tasks specifically are faster?"
3. "How is quality? Are we seeing more bugs or issues?"
4. "Is this sustainable, or is there burnout risk?"
5. "What's not in these numbers? (requirements, reviews, testing, etc.)"

---

## Section 6: The Executive's Guide to AI Development Metrics

### Metrics That Matter

**Good metrics to track:**

| Metric | What It Tells You | How to Measure |
|--------|-------------------|----------------|
| Cycle time | Time from code start to production | Track in project management tool |
| Deployment frequency | How often code ships | Count deployments per period |
| Bug escape rate | Quality of shipped code | Bugs found in production vs testing |
| Developer satisfaction | How people feel about tools | Regular surveys |
| Documentation coverage | Completeness of docs | Audit or automated measurement |

**Avoid these vanity metrics:**

| Metric | Why It's Misleading |
|--------|---------------------|
| Lines of code | AI can generate lots of code; quantity ≠ quality |
| Commit frequency | More commits doesn't mean better work |
| "AI-generated code percentage" | Meaningless without quality context |
| Hours saved (self-reported) | Often inflated, hard to verify |

### Building a Dashboard

**Recommended KPIs for AI-augmented development:**

1. **Delivery velocity** - Are we shipping features faster?
2. **Quality** - Are bugs and incidents stable or decreasing?
3. **Developer experience** - Are developers happy and productive?
4. **Cost efficiency** - Cost per feature or story point trending down?

---

## Discussion Scenarios

### Scenario 1: The Skeptical Senior Developer

*"My senior developer says AI tools slow her down and she refuses to use them. How should I handle this?"*

**Discussion points:**
- Senior developers have valid concerns about quality and review time
- Don't mandate—encourage experimentation
- Start with documentation or testing where benefits are clearest
- Her expertise is crucial for evaluating AI output—position it that way

### Scenario 2: The Over-Optimistic Estimate

*"Our team says they can deliver the next project in half the time because they're using AI tools. Should I believe them?"*

**Discussion points:**
- Half the time is extremely aggressive
- What assumptions are they making?
- Have they measured actual productivity gains?
- What if it doesn't work out—do we have a realistic fallback?
- Better to be conservative and exceed expectations

### Scenario 3: Client Concerns

*"A client asked if we use AI tools and whether they should be worried about code quality. How do I respond?"*

**Discussion points:**
- Transparency builds trust
- Explain that AI is a tool used by developers, not a replacement
- Emphasize that all code goes through the same review process
- Highlight that AI can actually improve documentation and consistency
- Offer to discuss their specific concerns

---

## Key Takeaways

1. **AI is a power tool, not a replacement** - Developers use AI to work faster, but still need expertise to direct it and evaluate output

2. **Expect 25-40% productivity gains** - Not 2x or 3x. Gains are real but moderate, and take time to materialize

3. **Quality requires vigilance** - AI-generated code needs the same review as human-written code, maybe more scrutiny initially

4. **The biggest gains aren't in coding** - Documentation, learning, and routine tasks see the largest improvements

5. **AI amplifies capability, not replaces it** - Senior developers get more benefit because they can better direct and evaluate AI

6. **Measure outcomes, not AI usage** - Track delivery speed, quality, and satisfaction—not how much AI was used

---

## Resources

### Research and Data
- GitHub Copilot Research: https://github.blog/2022-09-07-research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/
- Microsoft Research on AI and Developers: https://www.microsoft.com/en-us/research/project/ai-assisted-software-development/

### Industry Reports
- Stack Overflow Developer Survey (annual): https://survey.stackoverflow.co/
- JetBrains Developer Ecosystem Survey: https://www.jetbrains.com/lp/devecosystem/

### Books
- "The Pragmatic Programmer" (20th Anniversary Edition) - Hunt & Thomas
- "Software Engineering at Google" - Winters, Manshreck, Wright

---

## Facilitator Notes for Tim

### Timing
- Section 1 (Reality of AI Coding): 15 minutes
- Section 2 (Use Cases): 15 minutes
- Section 3 (Workflows and Velocity): 10 minutes
- Section 4 (Expectations): 10 minutes
- Section 5 (Questions): 10 minutes
- Section 6 (Metrics): 5 minutes
- Discussion Scenarios: 10-15 minutes

### Key Points to Emphasize

1. **This is not a coding module** - Participants don't need to understand code, just how AI changes how it's created

2. **Be realistic about gains** - Temper expectations; 25-40% is still significant but not revolutionary

3. **Quality is paramount** - Don't sacrifice quality for speed; AI makes bad code faster too

4. **Developer buy-in matters** - Tools only work if developers want to use them

### Potential Questions and Answers

**"Should we require all developers to use AI tools?"**
> Make them available and encourage adoption, but don't mandate. Some tasks are faster without AI, and developer judgment matters.

**"Can junior developers now do senior-level work with AI?"**
> No. AI helps juniors do junior work faster and learn faster. Senior judgment comes from experience, not AI.

**"Is this going to eliminate developer jobs?"**
> Not in the near term. Demand for software continues to grow. AI raises the floor on productivity, and the work expands to fill it.

**"How do we know the AI isn't introducing security vulnerabilities?"**
> Same way you know human code doesn't—code review, security testing, and best practices. AI doesn't change the need for these.

---

*Module 3 of 8 | AI for Development Firm Executives*
*Version 1.0 | 2025*
