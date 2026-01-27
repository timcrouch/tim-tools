// Survey response interface
interface SurveyResponse {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  role: string;
  company: string;
  ai_experience: string;
  prompt_skill: string;
  tools_used: string[];
  other_tools: string;
  coding_level: string;
  goals: string[];
  specific_goals: string;
  challenges: string;
  questions: string;
  referral: string;
}

// Storage key
const STORAGE_KEY = 'ai-survey-responses';

// DOM Elements
const form = document.getElementById('survey-form') as HTMLFormElement;
const steps = document.querySelectorAll('.form-step');
const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const progressFill = document.getElementById('progress-fill') as HTMLDivElement;
const progressText = document.getElementById('progress-text') as HTMLSpanElement;
const successMessage = document.getElementById('success-message') as HTMLDivElement;
const surveyContainer = document.getElementById('survey-container') as HTMLDivElement;
const adminPanel = document.getElementById('admin-panel') as HTMLDivElement;
const adminToggle = document.getElementById('admin-toggle') as HTMLButtonElement;
const closeAdmin = document.getElementById('close-admin') as HTMLButtonElement;
const exportJson = document.getElementById('export-json') as HTMLButtonElement;
const exportCsv = document.getElementById('export-csv') as HTMLButtonElement;
const responsesContainer = document.getElementById('responses-container') as HTMLDivElement;

let currentStep = 1;
const totalSteps = 5;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateProgress();
  setupNavigation();
  setupMaxCheckboxes();
  setupAdminPanel();
});

// Update progress bar
function updateProgress() {
  const progress = (currentStep / totalSteps) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `Step ${currentStep} of ${totalSteps}`;
}

// Show specific step
function showStep(step: number) {
  steps.forEach((s, i) => {
    s.classList.toggle('active', i + 1 === step);
  });
  
  currentStep = step;
  updateProgress();
  
  // Update button states
  prevBtn.disabled = currentStep === 1;
  nextBtn.classList.toggle('hidden', currentStep === totalSteps);
  submitBtn.classList.toggle('hidden', currentStep !== totalSteps);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validate current step
function validateStep(step: number): boolean {
  const currentStepEl = document.querySelector(`[data-step="${step}"]`) as HTMLElement;
  const requiredInputs = currentStepEl.querySelectorAll('[required]');
  
  let isValid = true;
  
  requiredInputs.forEach((input) => {
    const el = input as HTMLInputElement | HTMLTextAreaElement;
    
    if (el.type === 'radio') {
      // Check if any radio in the group is selected
      const name = el.name;
      const radios = currentStepEl.querySelectorAll(`input[name="${name}"]`);
      const anyChecked = Array.from(radios).some((r) => (r as HTMLInputElement).checked);
      if (!anyChecked) {
        isValid = false;
        highlightError(radios[0].closest('.form-group') as HTMLElement);
      }
    } else if (!el.value.trim()) {
      isValid = false;
      highlightError(el);
    }
  });
  
  return isValid;
}

// Highlight error
function highlightError(el: HTMLElement) {
  el.style.outline = '2px solid var(--error)';
  el.style.outlineOffset = '2px';
  
  setTimeout(() => {
    el.style.outline = '';
    el.style.outlineOffset = '';
  }, 2000);
  
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Setup navigation
function setupNavigation() {
  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      showStep(currentStep + 1);
    }
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      submitSurvey();
    }
  });
}

// Setup max 3 checkboxes for goals
function setupMaxCheckboxes() {
  const maxCheckboxes = document.querySelectorAll('.max-3');
  
  maxCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const checked = document.querySelectorAll('.max-3:checked');
      if (checked.length > 3) {
        (cb as HTMLInputElement).checked = false;
      }
    });
  });
}

// Collect form data
function collectFormData(): SurveyResponse {
  const formData = new FormData(form);
  
  // Get all checked values for multi-select fields
  const toolsUsed = Array.from(document.querySelectorAll('input[name="tools_used"]:checked'))
    .map((el) => (el as HTMLInputElement).value);
  
  const goals = Array.from(document.querySelectorAll('input[name="goals"]:checked'))
    .map((el) => (el as HTMLInputElement).value);
  
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as string,
    company: formData.get('company') as string || '',
    ai_experience: formData.get('ai_experience') as string,
    prompt_skill: formData.get('prompt_skill') as string,
    tools_used: toolsUsed,
    other_tools: formData.get('other_tools') as string || '',
    coding_level: formData.get('coding_level') as string,
    goals: goals,
    specific_goals: formData.get('specific_goals') as string,
    challenges: formData.get('challenges') as string || '',
    questions: formData.get('questions') as string || '',
    referral: formData.get('referral') as string || '',
  };
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Submit survey
function submitSurvey() {
  const response = collectFormData();
  
  // Save to localStorage
  const responses = getResponses();
  responses.push(response);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  
  // Show success message
  form.classList.add('hidden');
  document.querySelector('.progress-container')?.classList.add('hidden');
  successMessage.classList.remove('hidden');
  
  console.log('Survey submitted:', response);
}

// Get responses from storage
function getResponses(): SurveyResponse[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Admin Panel
function setupAdminPanel() {
  adminToggle.addEventListener('click', () => {
    adminPanel.classList.remove('hidden');
    surveyContainer.classList.add('hidden');
    renderResponses();
  });
  
  closeAdmin.addEventListener('click', () => {
    adminPanel.classList.add('hidden');
    surveyContainer.classList.remove('hidden');
  });
  
  exportJson.addEventListener('click', () => {
    const responses = getResponses();
    downloadFile(
      JSON.stringify(responses, null, 2),
      'ai-survey-responses.json',
      'application/json'
    );
  });
  
  exportCsv.addEventListener('click', () => {
    const responses = getResponses();
    const csv = convertToCSV(responses);
    downloadFile(csv, 'ai-survey-responses.csv', 'text/csv');
  });
}

// Render responses in admin panel
function renderResponses() {
  const responses = getResponses();
  
  if (responses.length === 0) {
    responsesContainer.innerHTML = `
      <div class="no-responses">
        <p>No responses yet.</p>
      </div>
    `;
    return;
  }
  
  responsesContainer.innerHTML = responses
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .map((r) => `
      <div class="response-card">
        <h3>${escapeHtml(r.name)}</h3>
        <div class="email">${escapeHtml(r.email)}</div>
        <div class="meta">
          ${escapeHtml(r.role)}${r.company ? ` at ${escapeHtml(r.company)}` : ''} • 
          Submitted ${new Date(r.timestamp).toLocaleDateString()}
        </div>
        <div class="response-details">
          <div class="response-item">
            <span class="label">AI Experience:</span>
            <span>${formatExperience(r.ai_experience)}</span>
          </div>
          <div class="response-item">
            <span class="label">Prompt Skill:</span>
            <span>${r.prompt_skill}/5</span>
          </div>
          <div class="response-item">
            <span class="label">Coding Level:</span>
            <span>${formatCodingLevel(r.coding_level)}</span>
          </div>
          <div class="response-item">
            <span class="label">Tools Used:</span>
            <span>${r.tools_used.length > 0 ? r.tools_used.join(', ') : 'None'}</span>
          </div>
          <div class="response-item">
            <span class="label">Goals:</span>
            <span>${r.goals.join(', ')}</span>
          </div>
          <div class="response-item">
            <span class="label">Specific Goal:</span>
            <span>${escapeHtml(r.specific_goals)}</span>
          </div>
          ${r.challenges ? `
          <div class="response-item">
            <span class="label">Challenges:</span>
            <span>${escapeHtml(r.challenges)}</span>
          </div>
          ` : ''}
          ${r.questions ? `
          <div class="response-item">
            <span class="label">Questions:</span>
            <span>${escapeHtml(r.questions)}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `)
    .join('');
}

// Format helpers
function formatExperience(level: string): string {
  const labels: Record<string, string> = {
    none: 'Complete beginner',
    curious: 'Curious explorer',
    regular: 'Regular user',
    power: 'Power user',
    builder: 'Builder',
  };
  return labels[level] || level;
}

function formatCodingLevel(level: string): string {
  const labels: Record<string, string> = {
    none: 'No experience',
    basic: 'Basic',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return labels[level] || level;
}

// Escape HTML
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Download file
function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Convert to CSV
function convertToCSV(responses: SurveyResponse[]): string {
  if (responses.length === 0) return '';
  
  const headers = [
    'Timestamp',
    'Name',
    'Email',
    'Role',
    'Company',
    'AI Experience',
    'Prompt Skill',
    'Coding Level',
    'Tools Used',
    'Other Tools',
    'Goals',
    'Specific Goals',
    'Challenges',
    'Questions',
    'Referral',
  ];
  
  const rows = responses.map((r) => [
    r.timestamp,
    r.name,
    r.email,
    r.role,
    r.company,
    r.ai_experience,
    r.prompt_skill,
    r.coding_level,
    r.tools_used.join('; '),
    r.other_tools,
    r.goals.join('; '),
    r.specific_goals,
    r.challenges,
    r.questions,
    r.referral,
  ].map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','));
  
  return [headers.join(','), ...rows].join('\n');
}
