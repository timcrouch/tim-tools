// Rubber Duck Debugger - Because sometimes you just need to explain it to someone who won't interrupt

const stages = [
  {
    id: 1,
    name: 'The Problem',
    prompt: 'Describe your problem in plain English:',
    placeholder: "It's not working...",
    duckResponses: [
      "*tilts head* Interesting. And what exactly do you mean by 'not working'?",
      "Hmm. I've heard that one before. About 47,000 times. Tell me more.",
      "*stares* That's... vague. What were you actually trying to do?",
      "Okay, I'm listening. Though I should warn you, I've seen things. Many things.",
      "*nods sagely* Classic. The code doesn't work. Revolutionary observation.",
    ],
  },
  {
    id: 2,
    name: 'What You Expected',
    prompt: 'What did you expect to happen?',
    placeholder: 'I expected it to work correctly...',
    duckResponses: [
      "*quacks thoughtfully* And did you tell the computer that? They're not great at mind-reading.",
      "Ah, expectations. The first step toward disappointment. Continue.",
      "*blinks* So there was a plan. That's more than most. What was it?",
      "The eternal question: what SHOULD have happened? Let's explore that.",
      "*leans in* So you had a vision. The computer had other ideas, clearly.",
    ],
  },
  {
    id: 3,
    name: 'What Actually Happened',
    prompt: 'What actually happened instead?',
    placeholder: 'It threw an error / nothing happened / my cat caught fire...',
    duckResponses: [
      "*narrows eyes* And you're SURE that's what happened? Sometimes we see what we expect to see.",
      "Fascinating. The gap between expectation and reality. This is where bugs live.",
      "*quacks* Ah yes, the 'instead.' The plot twist nobody asked for.",
      "So it did SOMETHING. That's actually useful. Silence is worse.",
      "*nods* The symptom. Now we're getting somewhere. Maybe.",
    ],
  },
  {
    id: 4,
    name: "What You've Tried",
    prompt: "What have you already tried to fix it?",
    placeholder: 'I tried turning it off and on again...',
    duckResponses: [
      "*skeptical quack* And none of that worked? Have you tried... thinking about it differently?",
      "Interesting approach. Have you considered that the bug might be... a feature? No? Just checking.",
      "*blinks slowly* Sometimes the best debugging is stepping away. Or explaining it to a duck.",
      "Wait. Stop. Before your next attempt... are you SURE about your assumptions?",
      "*tilts head* You've been busy. But busy isn't the same as effective.",
    ],
  },
  {
    id: 5,
    name: 'The Revelation',
    prompt: 'Having explained all that... do you see it now?',
    placeholder: 'Actually, now that I say it out loud...',
    duckResponses: {
      epiphany: [
        "🎉 *celebrates* THERE IT IS! The light bulb moment! I knew you had it in you.",
        "*excited quacking* YES! The power of rubber duck debugging! Go forth and fix!",
        "🦆✨ Another mystery solved by simply... talking about it. You're welcome.",
        "*proud quack* See? You knew the answer all along. I just held space.",
        "QUACK QUACK! 🎊 That's the sound of victory! Now go ship that fix!",
      ],
      stillStuck: [
        "*sighs* Still stuck? That's okay. Sometimes the bug is deeper. Take a break, come back fresh.",
        "No revelation yet? The duck believes in you. Maybe sleep on it.",
        "*gentle quack* Not every session ends in epiphany. But you've articulated it now. That helps.",
        "The answer will come. It always does. Usually at 3am or in the shower.",
        "*supportive blink* Progress isn't always visible. You've narrowed it down. That counts.",
      ],
    },
  },
];

const statsNotes = [
  "The duck has seen things. Mostly your code.",
  "Fun fact: The duck never judges. Okay, the duck judges a little.",
  "Rubber duck debugging: cheaper than therapy since 1999.",
  "The duck remembers every 'it should work' you've ever said.",
  "Some ducks have PhDs in computer science. This one has patience.",
  "The duck's secret: it doesn't know anything. You know everything.",
  "Over 90% of bugs are found while explaining them. The duck takes credit.",
  "The duck has heard 'but it works on my machine' 1,000,000 times.",
];

class RubberDuckDebugger {
  constructor() {
    this.currentStage = 1;
    this.sessionHistory = [];
    this.stats = this.loadStats();

    this.duck = document.getElementById('duck');
    this.speechBubble = document.getElementById('speechBubble');
    this.duckMessage = document.getElementById('duckMessage');
    this.stageIndicator = document.getElementById('stageIndicator');
    this.promptLabel = document.getElementById('promptLabel');
    this.userInput = document.getElementById('userInput');
    this.submitBtn = document.getElementById('submitBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.historySection = document.getElementById('historySection');
    this.historyList = document.getElementById('historyList');

    this.init();
  }

  init() {
    this.submitBtn.addEventListener('click', () => this.handleSubmit());
    this.resetBtn.addEventListener('click', () => this.resetSession());
    this.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.metaKey) {
        this.handleSubmit();
      }
    });

    this.updateStats();
    this.setRandomStatsNote();
  }

  loadStats() {
    const stored = localStorage.getItem('rubberDuckStats');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      totalSessions: 0,
      epiphanies: 0,
      stageCompletions: [],
    };
  }

  saveStats() {
    localStorage.setItem('rubberDuckStats', JSON.stringify(this.stats));
  }

  updateStats() {
    document.getElementById('totalSessions').textContent = this.stats.totalSessions;
    document.getElementById('epiphanies').textContent = this.stats.epiphanies;

    if (this.stats.stageCompletions.length > 0) {
      const avg = (
        this.stats.stageCompletions.reduce((a, b) => a + b, 0) /
        this.stats.stageCompletions.length
      ).toFixed(1);
      document.getElementById('avgStage').textContent = avg;
    }
  }

  setRandomStatsNote() {
    const note = statsNotes[Math.floor(Math.random() * statsNotes.length)];
    document.getElementById('statsNote').textContent = note;
  }

  handleSubmit() {
    const input = this.userInput.value.trim();
    if (!input) return;

    // Add to history
    this.sessionHistory.push({
      stage: this.currentStage,
      stageName: stages[this.currentStage - 1].name,
      text: input,
    });

    // Show history section
    this.historySection.style.display = 'block';
    this.renderHistory();

    // Duck thinks
    this.duck.classList.add('thinking');
    this.duckMessage.textContent = '...';

    setTimeout(() => {
      this.duck.classList.remove('thinking');

      if (this.currentStage === 5) {
        this.handleFinalStage(input);
      } else {
        this.advanceStage();
      }
    }, 1000);
  }

  advanceStage() {
    // Mark current stage as completed
    const currentStageEl = this.stageIndicator.querySelector(`[data-stage="${this.currentStage}"]`);
    currentStageEl.classList.remove('active');
    currentStageEl.classList.add('completed');

    this.currentStage++;

    // Activate next stage
    const nextStageEl = this.stageIndicator.querySelector(`[data-stage="${this.currentStage}"]`);
    nextStageEl.classList.add('active');

    // Update UI
    const stage = stages[this.currentStage - 1];
    this.promptLabel.textContent = stage.prompt;
    this.userInput.value = '';
    this.userInput.placeholder = stage.placeholder;

    // Duck responds
    const responses = stage.duckResponses;
    const response = Array.isArray(responses)
      ? responses[Math.floor(Math.random() * responses.length)]
      : responses;
    this.duckMessage.textContent = response;

    // Judge a little at stage 4
    if (this.currentStage === 4) {
      this.duck.classList.add('judging');
      setTimeout(() => this.duck.classList.remove('judging'), 3000);
    }
  }

  handleFinalStage(input) {
    const lowerInput = input.toLowerCase();
    const epiphanyKeywords = [
      'found',
      'see it',
      'got it',
      'realize',
      'obvious',
      'stupid',
      'duh',
      'of course',
      'wait',
      'oh',
      'aha',
      'that\'s it',
      'figured',
      'fixed',
      'solved',
      'works now',
      'i see',
      'makes sense',
      'there it is',
      'eureka',
    ];

    const hadEpiphany = epiphanyKeywords.some((keyword) => lowerInput.includes(keyword));

    if (hadEpiphany) {
      this.duck.classList.add('celebrating');
      setTimeout(() => this.duck.classList.remove('celebrating'), 1000);

      const responses = stages[4].duckResponses.epiphany;
      this.duckMessage.textContent = responses[Math.floor(Math.random() * responses.length)];

      this.stats.epiphanies++;
      this.stats.stageCompletions.push(this.currentStage);
    } else {
      const responses = stages[4].duckResponses.stillStuck;
      this.duckMessage.textContent = responses[Math.floor(Math.random() * responses.length)];

      this.stats.stageCompletions.push(5);
    }

    this.stats.totalSessions++;
    this.saveStats();
    this.updateStats();
    this.setRandomStatsNote();

    // Mark final stage
    const finalStageEl = this.stageIndicator.querySelector('[data-stage="5"]');
    finalStageEl.classList.remove('active');
    finalStageEl.classList.add('completed');

    // Show reset button, hide submit
    this.submitBtn.style.display = 'none';
    this.resetBtn.style.display = 'inline-flex';
    this.userInput.disabled = true;
    this.promptLabel.textContent = 'Session complete!';
  }

  renderHistory() {
    this.historyList.innerHTML = this.sessionHistory
      .map(
        (item) => `
      <div class="history-item">
        <div class="stage-label">${item.stageName}</div>
        <div class="user-text">${this.escapeHtml(item.text)}</div>
      </div>
    `
      )
      .join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  resetSession() {
    this.currentStage = 1;
    this.sessionHistory = [];

    // Reset stage indicators
    this.stageIndicator.querySelectorAll('.stage').forEach((el, index) => {
      el.classList.remove('active', 'completed');
      if (index === 0) el.classList.add('active');
    });

    // Reset UI
    const stage = stages[0];
    this.promptLabel.textContent = stage.prompt;
    this.userInput.value = '';
    this.userInput.placeholder = stage.placeholder;
    this.userInput.disabled = false;
    this.submitBtn.style.display = 'inline-flex';
    this.resetBtn.style.display = 'none';
    this.historySection.style.display = 'none';
    this.historyList.innerHTML = '';

    // Reset duck
    this.duckMessage.textContent = '*stares expectantly* What seems to be the problem?';
    this.duck.classList.remove('celebrating', 'judging', 'thinking');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new RubberDuckDebugger();
});
