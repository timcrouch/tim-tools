# Module 7: Risk, Governance, and Responsible Use

## Learning Objectives

By the end of this module, participants will be able to:
- Identify data privacy and confidentiality risks when using AI tools
- Distinguish between appropriate and inappropriate data sharing with AI systems
- Understand intellectual property implications of AI-generated content
- Develop client data handling policies for AI use
- Recognize when AI output requires mandatory human review
- Create foundational internal AI use policies for their organizations

---

## 1. Data Privacy and Confidentiality Considerations

### The Core Challenge

When you use AI tools, you're potentially sharing data with third-party systems. Understanding what happens to that data is critical for executive decision-making.

### How AI Tools Handle Data

#### Cloud-Based AI Services (Claude, ChatGPT, etc.)

**Data Processing:**
- Your prompts are sent to remote servers for processing
- Responses are generated and returned to you
- The critical question: What happens to your data after?

**Training Data Policies (as of 2025-2026):**

| Provider | Consumer Products | Business/Enterprise Tiers |
|----------|------------------|---------------------------|
| Anthropic (Claude) | May use for training (opt-out available) | Never used for training |
| OpenAI (ChatGPT) | May use for training (opt-out available) | Never used for training with Enterprise |
| Microsoft Copilot | Varies by product | Enterprise data protected |
| Google (Gemini) | Consumer data may be used | Workspace data protected |

**Key Insight:** Business and Enterprise tiers typically offer stronger data protection guarantees. This is a primary reason to invest in paid tiers beyond just feature access.

### Data Residency and Compliance

**Geographic Considerations:**
- Where are AI provider servers located?
- Does data cross international boundaries?
- GDPR, CCPA, and other regulatory implications

**Compliance Frameworks to Consider:**
- SOC 2 Type II certification
- ISO 27001 compliance
- GDPR data processing agreements
- Industry-specific requirements (HIPAA, FINRA, etc.)

**Questions to Ask AI Vendors:**
1. Where is my data processed and stored?
2. Is my data used to train models?
3. How long is my data retained?
4. Can I request data deletion?
5. What certifications do you hold?

### Practical Risk Assessment Matrix

| Data Type | Risk Level | AI Tool Guidance |
|-----------|------------|------------------|
| Public information | Low | Generally safe for any AI tool |
| Internal procedures (non-sensitive) | Low-Medium | Safe with business-tier tools |
| Client names/basic info | Medium | Use enterprise tools with caution |
| Financial projections | Medium-High | Enterprise tools only, sanitize when possible |
| Client confidential data | High | Generally avoid; use on-premise solutions if needed |
| PII (Social Security, health data) | Critical | Do not use with cloud AI |
| Trade secrets | Critical | Do not use with cloud AI |

---

## 2. What Can (and Cannot) Be Shared with AI Tools

### Safe to Share

✅ **Generally Acceptable:**
- Publicly available information
- Generic templates and frameworks
- Anonymized or synthetic data
- Internal process documentation (non-confidential)
- General industry questions
- Coding problems with sanitized examples
- Writing assistance for non-sensitive content

### Proceed with Caution

⚠️ **Requires Judgment:**
- Client project descriptions (anonymize first)
- Internal meeting notes (remove names/specifics)
- Financial models (use dummy data)
- Strategic plans (generalize details)
- Performance reviews (strip identifying information)

### Never Share

❌ **Prohibited:**
- Client confidential information (without explicit permission)
- Personally Identifiable Information (PII)
- Protected Health Information (PHI)
- Financial account numbers
- Passwords or access credentials
- Trade secrets or proprietary algorithms
- Attorney-client privileged communications
- Information under NDA without permission

### The Sanitization Approach

**Before sharing sensitive context, sanitize it:**

**Original (DON'T SHARE):**
> "Acme Corp is acquiring Beta Inc for $50M. Draft the due diligence checklist focusing on their Seattle office with 200 employees."

**Sanitized (SAFE TO SHARE):**
> "A mid-size company is acquiring a smaller competitor for an undisclosed amount. Draft a due diligence checklist for an acquisition involving a regional office with approximately 200 employees."

**Practical Exercise:** Have participants practice sanitizing a real scenario from their work.

---

## 3. Intellectual Property Implications

### Who Owns AI-Generated Content?

**The Legal Landscape (2025-2026):**

The legal framework around AI-generated content ownership is still evolving. Current understanding:

**Generally Accepted:**
- You own the output when you provide substantial creative input/direction
- Pure AI generation with minimal human input has unclear ownership
- Most commercial AI terms of service grant you rights to outputs

**Provider Terms Comparison:**

| Provider | Output Ownership | Commercial Use |
|----------|-----------------|----------------|
| Anthropic (Claude) | User owns outputs | Permitted |
| OpenAI (ChatGPT) | User owns outputs | Permitted |
| Microsoft Copilot | User owns outputs | Permitted |
| GitHub Copilot | Complex - see below | Permitted with caveats |

### Code-Specific IP Concerns

**GitHub Copilot Considerations:**
- Trained on public repositories (including copyleft-licensed code)
- Potential for generating code similar to training data
- Risk of inadvertent license violations

**Mitigation Strategies:**
1. Enable duplicate detection features
2. Review generated code for suspicious similarities
3. Maintain clear documentation of AI assistance
4. Consider code scanning tools for license compliance

### Client Work IP Issues

**Key Questions:**
- Does your client contract address AI tool usage?
- Who owns AI-assisted deliverables?
- Are there disclosure requirements?

**Recommended Contract Language:**
> "Contractor may utilize AI-assisted tools in the performance of services. All deliverables, regardless of tools used in their creation, shall be owned by Client pursuant to the work-for-hire provisions of this agreement. Contractor warrants that all deliverables represent original work and do not infringe third-party rights."

### Documentation Best Practices

**Maintain Records Of:**
- Which AI tools were used
- What prompts/inputs were provided
- Level of human modification to outputs
- Final human review and approval

---

## 4. Client Data Handling Policies

### Building a Client Data Policy for AI Use

**Policy Framework Components:**

#### 1. Data Classification
Define categories for client data:
- Public
- Internal
- Confidential
- Restricted

#### 2. Tool Authorization
Which AI tools are approved for which data classifications?

| Tool | Public | Internal | Confidential | Restricted |
|------|--------|----------|--------------|------------|
| Claude Team/Enterprise | ✅ | ✅ | ⚠️ Limited | ❌ |
| ChatGPT Enterprise | ✅ | ✅ | ⚠️ Limited | ❌ |
| Consumer AI tools | ✅ | ❌ | ❌ | ❌ |
| On-premise AI | ✅ | ✅ | ✅ | ⚠️ Case-by-case |

#### 3. Client Consent Requirements
- When is client notification required?
- When is explicit consent needed?
- How should consent be documented?

#### 4. Incident Response
- What constitutes an AI-related data incident?
- Reporting procedures
- Remediation steps

### Sample Policy Statement

> **AI Tool Usage Policy for Client Data**
>
> [Firm Name] may utilize AI-assisted tools to enhance service delivery. When handling client data:
>
> 1. Only enterprise-grade AI tools with data protection guarantees may be used
> 2. Client confidential information must be anonymized before AI processing
> 3. AI tools shall not be used with restricted data categories
> 4. All AI-assisted work products undergo human review before delivery
> 5. Clients will be informed of AI tool usage upon request
>
> Violations of this policy should be reported to [designated contact].

---

## 5. When AI Output Requires Human Review

### Mandatory Review Scenarios

**Always Require Human Review:**

1. **Legal or Compliance Content**
   - Contract language
   - Regulatory filings
   - Legal opinions
   - Compliance documentation

2. **Financial Outputs**
   - Financial statements
   - Audit workpapers
   - Tax calculations
   - Investment recommendations

3. **Client-Facing Deliverables**
   - Reports and presentations
   - Recommendations
   - Strategic advice
   - Any document bearing firm name

4. **Technical Decisions**
   - Architecture recommendations
   - Security configurations
   - Production code deployment
   - Infrastructure changes

5. **Personnel Matters**
   - Performance evaluations
   - Hiring decisions
   - Compensation recommendations
   - Disciplinary actions

### Review Depth Framework

| Output Type | Review Level | Reviewer Qualification |
|-------------|--------------|----------------------|
| Internal drafts | Light review | Any team member |
| Client communications | Standard review | Project lead |
| Deliverables | Thorough review | Senior manager |
| Legal/financial | Expert review | Subject matter expert |
| Strategic recommendations | Executive review | Partner/Director |

### Common AI Errors to Watch For

**Factual Errors:**
- "Hallucinated" citations or references
- Incorrect statistics or dates
- Misattributed quotes
- Non-existent case law or regulations

**Logical Errors:**
- Circular reasoning
- False equivalencies
- Overgeneralization
- Missing edge cases

**Context Errors:**
- Applying wrong jurisdiction's rules
- Outdated information presented as current
- Industry-specific nuances missed
- Cultural context misunderstandings

**Quality Issues:**
- Inconsistent tone or style
- Repetitive phrasing
- Generic content lacking specificity
- Missing client-specific requirements

---

## 6. Building Internal AI Use Policies

### Policy Development Framework

#### Step 1: Assess Current State
- What AI tools are already being used?
- What data is being shared?
- What gaps exist in current practices?

#### Step 2: Define Objectives
- Enable productivity benefits
- Protect client and firm data
- Ensure quality standards
- Maintain compliance

#### Step 3: Engage Stakeholders
- IT/Security team
- Legal/Compliance
- Operations leadership
- Representative end users

#### Step 4: Draft Core Policies

**Essential Policy Components:**

1. **Purpose and Scope**
   - Why this policy exists
   - Who it applies to
   - What tools/activities it covers

2. **Approved Tools List**
   - Vetted and authorized AI tools
   - Process for requesting new tools
   - Prohibited tools/services

3. **Data Handling Rules**
   - What can be shared with AI
   - Required sanitization procedures
   - Prohibited data types

4. **Quality Assurance Requirements**
   - Mandatory review processes
   - Documentation standards
   - Error reporting procedures

5. **Training Requirements**
   - Initial training for new users
   - Ongoing education
   - Competency verification

6. **Compliance and Enforcement**
   - Monitoring approach
   - Violation consequences
   - Appeals process

#### Step 5: Implement and Train
- Roll out with clear communication
- Provide practical training
- Establish feedback channels

#### Step 6: Monitor and Iterate
- Track policy effectiveness
- Gather user feedback
- Update as tools and risks evolve

### Sample Policy Template Outline

```
AI ACCEPTABLE USE POLICY

1. INTRODUCTION
   1.1 Purpose
   1.2 Scope
   1.3 Definitions

2. AUTHORIZED AI TOOLS
   2.1 Approved Tools List
   2.2 Tool Request Process
   2.3 Prohibited Tools

3. DATA HANDLING
   3.1 Data Classification
   3.2 Permitted Uses by Classification
   3.3 Sanitization Requirements
   3.4 Prohibited Data

4. QUALITY AND REVIEW
   4.1 Output Review Requirements
   4.2 Documentation Standards
   4.3 Error Handling

5. CLIENT CONSIDERATIONS
   5.1 Client Notification
   5.2 Consent Requirements
   5.3 Confidentiality Obligations

6. SECURITY
   6.1 Authentication Requirements
   6.2 Access Controls
   6.3 Incident Reporting

7. COMPLIANCE
   7.1 Regulatory Considerations
   7.2 Audit Trail Requirements
   7.3 Records Retention

8. TRAINING AND AWARENESS
   8.1 Initial Training
   8.2 Ongoing Education
   8.3 Competency Requirements

9. ENFORCEMENT
   9.1 Monitoring
   9.2 Violations
   9.3 Appeals

10. POLICY MAINTENANCE
    10.1 Review Schedule
    10.2 Update Process
    10.3 Version Control
```

---

## Hands-On Exercise: Policy Gap Analysis

**Duration:** 20 minutes

**Instructions:**

1. **Current State Assessment (10 minutes)**
   
   Answer these questions about your organization:
   - What AI tools are currently in use?
   - Is there any existing policy or guidance?
   - Have there been any AI-related incidents or concerns?
   - What client contracts mention AI or data handling?

2. **Gap Identification (5 minutes)**
   
   Based on this module, identify your top 3 policy gaps:
   - Gap 1: _______________
   - Gap 2: _______________
   - Gap 3: _______________

3. **Priority Action (5 minutes)**
   
   What is the single most important policy action you should take in the next 30 days?

**Discussion:** Share findings with a partner or small group.

---

## Key Takeaways

1. **Data privacy is non-negotiable** — Understand exactly what happens to data you share with AI tools

2. **Business tiers matter** — Enterprise AI products offer meaningful data protection that consumer products don't

3. **When in doubt, sanitize** — Remove identifying details before sharing context with AI

4. **IP ownership is evolving** — Document AI usage and maintain clear ownership records

5. **Human review is mandatory** — AI outputs, especially for client work, require qualified human review

6. **Policies enable adoption** — Clear guidelines help staff use AI confidently and appropriately

7. **Start somewhere** — A basic policy today is better than a perfect policy never

---

## Additional Resources

### Regulatory Guidance
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- EU AI Act Overview: https://artificialintelligenceact.eu/
- FTC AI Guidance: https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check

### Industry Frameworks
- ISO/IEC 42001 - AI Management System Standard
- IEEE 7000 Series - Ethical AI Standards
- Partnership on AI Guidelines: https://partnershiponai.org/

### Vendor Security Documentation
- Anthropic Security: https://www.anthropic.com/security
- OpenAI Enterprise Privacy: https://openai.com/enterprise-privacy
- Microsoft Copilot Trust Center: https://www.microsoft.com/en-us/trust-center

### Books and Reports
- "The AI Organization" by David Carmona (O'Reilly)
- McKinsey: "The State of AI in 2025"
- Gartner: "AI TRiSM Framework" (AI Trust, Risk and Security Management)

---

## Discussion Questions

1. What's the most sensitive type of data your firm handles, and how would you approach AI tool usage with it?

2. How would you handle a situation where a team member inadvertently shared client confidential information with a consumer AI tool?

3. What's the right balance between enabling AI productivity and maintaining appropriate controls?

4. How should you communicate AI usage policies to clients?

---

*Module 7 Complete — Proceed to Module 8: Measuring AI ROI*
