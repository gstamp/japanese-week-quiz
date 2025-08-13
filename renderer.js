// Japanese Days of the Week Quiz Logic

// Sound utility class for creating audio feedback
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  }

  // Create a pleasant "ding" sound for correct answers
  playCorrectSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Create a pleasant major chord progression
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(
      659.25,
      this.audioContext.currentTime + 0.1
    ); // E5
    oscillator.frequency.setValueAtTime(
      783.99,
      this.audioContext.currentTime + 0.2
    ); // G5

    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0.3,
      this.audioContext.currentTime + 0.05
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.5
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  // Create a simple "bong" sound for incorrect answers
  playIncorrectSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Lower frequency for incorrect sound
    oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
    oscillator.frequency.exponentialRampToValueAtTime(
      110,
      this.audioContext.currentTime + 0.3
    ); // A2

    oscillator.type = "triangle";

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0.2,
      this.audioContext.currentTime + 0.02
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.6
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.6);
  }
}

// Text-to-Speech utility class for pronunciation
class TextToSpeech {
  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.japaneseVoice = null;
    this.englishVoice = null;
    this.initVoices();
  }

  initVoices() {
    // Wait for voices to load
    if (this.speechSynthesis.getVoices().length === 0) {
      this.speechSynthesis.addEventListener("voiceschanged", () => {
        this.loadVoices();
      });
    } else {
      this.loadVoices();
    }
  }

  loadVoices() {
    const voices = this.speechSynthesis.getVoices();

    // Find Japanese voice (prefer native Japanese voices)
    this.japaneseVoice = voices.find(
      (voice) =>
        voice.lang.startsWith("ja") ||
        voice.name.toLowerCase().includes("japanese") ||
        voice.name.toLowerCase().includes("kyoko") ||
        voice.name.toLowerCase().includes("otoya")
    );

    // Find English voice (prefer natural sounding ones)
    this.englishVoice =
      voices.find((voice) => voice.lang.startsWith("en") && voice.default) ||
      voices.find((voice) => voice.lang.startsWith("en"));

    console.log("Available voices loaded:", {
      japanese: this.japaneseVoice?.name || "None found",
      english: this.englishVoice?.name || "None found",
    });
  }

  speakJapanese(text, rate = 0.8) {
    this.speak(text, this.japaneseVoice, "ja-JP", rate);
  }

  speakEnglish(text, rate = 1.0) {
    this.speak(text, this.englishVoice, "en-US", rate);
  }

  speak(text, voice, lang, rate = 1.0) {
    if (!this.speechSynthesis) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    this.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = lang;
    utterance.rate = rate;
    utterance.volume = 0.8;
    utterance.pitch = 1.0;

    // Error handling
    utterance.onerror = (event) => {
      console.warn("Speech synthesis error:", event.error);
    };

    this.speechSynthesis.speak(utterance);
  }

  // Check if TTS is available
  isSupported() {
    return !!this.speechSynthesis;
  }

  // Stop any ongoing speech
  stop() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }
}

class JapaneseWeekQuiz {
  constructor() {
    this.daysOfWeek = [
      {
        japanese: "月曜日",
        hiragana: "げつようび",
        romaji: "getsuyōbi",
        english: "monday",
      },
      {
        japanese: "火曜日",
        hiragana: "かようび",
        romaji: "kayōbi",
        english: "tuesday",
      },
      {
        japanese: "水曜日",
        hiragana: "すいようび",
        romaji: "suiyōbi",
        english: "wednesday",
      },
      {
        japanese: "木曜日",
        hiragana: "もくようび",
        romaji: "mokuyōbi",
        english: "thursday",
      },
      {
        japanese: "金曜日",
        hiragana: "きんようび",
        romaji: "kinyōbi",
        english: "friday",
      },
      {
        japanese: "土曜日",
        hiragana: "どようび",
        romaji: "doyōbi",
        english: "saturday",
      },
      {
        japanese: "日曜日",
        hiragana: "にちようび",
        romaji: "nichiyōbi",
        english: "sunday",
      },
    ];

    this.currentQuestions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;

    // Quiz modes: 'jp-en', 'en-jp', 'kanji-hiragana', 'hiragana-kanji'
    this.currentMode = "jp-en";

    this.answeredQuestions = [];
    this.autoAdvanceTimeout = null;
    this.ttsEnabled = true; // Text-to-speech enabled by default

    // Initialize sound manager and text-to-speech
    this.soundManager = new SoundManager();
    this.textToSpeech = new TextToSpeech();

    this.initializeElements();
    this.setupEventListeners();
    this.startNewQuiz();
  }

  initializeElements() {
    this.elements = {
      // Score and progress
      score: document.getElementById("score"),
      questionNumber: document.getElementById("question-number"),
      totalQuestions: document.getElementById("total-questions"),

      // Mode buttons
      japaneseToEnglish: document.getElementById("japanese-to-english"),
      englishToJapanese: document.getElementById("english-to-japanese"),
      kanjiToHiragana: document.getElementById("kanji-to-hiragana"),
      hiraganaToKanji: document.getElementById("hiragana-to-kanji"),

      // Question display
      questionText: document.getElementById("question-text"),
      questionHint: document.getElementById("question-hint"),
      speakBtn: document.getElementById("speak-btn"),
      ttsToggle: document.getElementById("tts-toggle"),

      // Options
      optionBtns: document.querySelectorAll(".option-btn"),

      // Controls
      newQuizBtn: document.getElementById("new-quiz-btn"),
      skipQuestionBtn: document.getElementById("skip-question-btn"),

      // Sections
      quizSection: document.getElementById("quiz-section"),
      resultsSection: document.getElementById("results-section"),
      reviewSection: document.getElementById("review-section"),

      // Results
      finalScore: document.getElementById("final-score"),
      finalTotal: document.getElementById("final-total"),
      percentage: document.getElementById("percentage"),
      tryAgainBtn: document.getElementById("try-again-btn"),
      reviewBtn: document.getElementById("review-btn"),

      // Review
      reviewList: document.getElementById("review-list"),
      backToQuizBtn: document.getElementById("back-to-quiz-btn"),
    };
  }

  setupEventListeners() {
    // Mode selection
    this.elements.japaneseToEnglish.addEventListener("click", () =>
      this.setMode("jp-en")
    );
    this.elements.englishToJapanese.addEventListener("click", () =>
      this.setMode("en-jp")
    );
    this.elements.kanjiToHiragana.addEventListener("click", () =>
      this.setMode("kanji-hiragana")
    );
    this.elements.hiraganaToKanji.addEventListener("click", () =>
      this.setMode("hiragana-kanji")
    );

    // Option buttons
    this.elements.optionBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Initialize audio context on first user interaction if needed
        if (
          this.soundManager.audioContext &&
          this.soundManager.audioContext.state === "suspended"
        ) {
          this.soundManager.audioContext.resume();
        }
        this.selectAnswer(e.target);
      });
    });

    // Control buttons
    this.elements.newQuizBtn.addEventListener("click", () =>
      this.startNewQuiz()
    );
    this.elements.skipQuestionBtn.addEventListener("click", () =>
      this.skipQuestion()
    );
    this.elements.tryAgainBtn.addEventListener("click", () =>
      this.startNewQuiz()
    );
    this.elements.reviewBtn.addEventListener("click", () => this.showReview());
    this.elements.backToQuizBtn.addEventListener("click", () =>
      this.showQuiz()
    );

    // Speak button
    this.elements.speakBtn.addEventListener("click", () =>
      this.speakCurrentQuestion()
    );

    // Initialize TTS toggle
    this.elements.ttsToggle.addEventListener("click", () => {
      this.toggleTTS();
    });

    // Set initial TTS toggle state
    this.updateTTSToggleUI();

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      if (e.key >= "1" && e.key <= "4") {
        const index = parseInt(e.key) - 1;
        if (index < this.elements.optionBtns.length) {
          // Initialize audio context on first user interaction if needed
          if (
            this.soundManager.audioContext &&
            this.soundManager.audioContext.state === "suspended"
          ) {
            this.soundManager.audioContext.resume();
          }
          this.selectAnswer(this.elements.optionBtns[index]);
        }
      } else if (e.key === "Enter") {
        // Skip question with Enter
        this.skipQuestion();
      } else if (e.key === " ") {
        e.preventDefault();
        // Space bar always starts new quiz
        this.startNewQuiz();
      }
    });
  }

  setMode(mode) {
    this.currentMode = mode;

    // Update button states
    this.elements.japaneseToEnglish.classList.toggle(
      "active",
      mode === "jp-en"
    );
    this.elements.englishToJapanese.classList.toggle(
      "active",
      mode === "en-jp"
    );
    this.elements.kanjiToHiragana.classList.toggle(
      "active",
      mode === "kanji-hiragana"
    );
    this.elements.hiraganaToKanji.classList.toggle(
      "active",
      mode === "hiragana-kanji"
    );

    // Update TTS toggle UI since some modes disable TTS
    this.updateTTSToggleUI();

    // Start new quiz with the new mode
    this.startNewQuiz();
  }

  startNewQuiz() {
    // Clear any existing auto-advance timeout
    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
      this.autoAdvanceTimeout = null;
    }

    this.currentQuestions = this.shuffleArray([...this.daysOfWeek]);
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answeredQuestions = [];

    this.updateScore();
    this.showQuiz();
    this.displayQuestion();
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  toggleTTS() {
    this.ttsEnabled = !this.ttsEnabled;
    this.updateTTSToggleUI();

    // Show brief feedback
    const feedback = this.ttsEnabled ? "TTS Enabled" : "TTS Disabled";
    this.showFeedback(feedback, 1000);
  }

  // Check if TTS is effectively disabled (either by user or by mode)
  isTTSEffectivelyDisabled() {
    return (
      !this.ttsEnabled ||
      this.currentMode === "kanji-hiragana" ||
      this.currentMode === "hiragana-kanji"
    );
  }

  updateTTSToggleUI() {
    const isEffectivelyDisabled = this.isTTSEffectivelyDisabled();
    const isDisabledByMode =
      this.currentMode === "kanji-hiragana" ||
      this.currentMode === "hiragana-kanji";

    if (isEffectivelyDisabled) {
      this.elements.ttsToggle.classList.remove("active");

      if (isDisabledByMode && this.ttsEnabled) {
        // User wants TTS on, but it's disabled by mode
        this.elements.ttsToggle.setAttribute(
          "title",
          "Text-to-speech disabled for character recognition modes"
        );
        this.elements.ttsToggle.style.opacity = "0.6";
      } else {
        // User has TTS disabled
        this.elements.ttsToggle.setAttribute(
          "title",
          "Text-to-speech is OFF - Click to enable"
        );
        this.elements.ttsToggle.style.opacity = "1";
      }
    } else {
      this.elements.ttsToggle.classList.add("active");
      this.elements.ttsToggle.setAttribute(
        "title",
        "Text-to-speech is ON - Click to disable"
      );
      this.elements.ttsToggle.style.opacity = "1";
    }
  }

  showFeedback(message, duration = 2000) {
    // Store the original hint content
    const originalHint = this.elements.questionHint.textContent;

    // Show the feedback message
    this.elements.questionHint.textContent = message;
    this.elements.questionHint.style.color = "#4ade80"; // Green color for feedback

    // Restore the original hint after the duration
    setTimeout(() => {
      this.elements.questionHint.textContent = originalHint;
      this.elements.questionHint.style.color = ""; // Reset color
    }, duration);
  }

  displayQuestion() {
    const currentDay = this.currentQuestions[this.currentQuestionIndex];

    // Update question counter
    this.elements.questionNumber.textContent = this.currentQuestionIndex + 1;
    this.elements.totalQuestions.textContent = this.currentQuestions.length;

    switch (this.currentMode) {
      case "jp-en":
        this.elements.questionText.textContent = currentDay.japanese;
        this.elements.questionHint.textContent = `What day is this in English? (${currentDay.romaji})`;
        this.displayEnglishOptions(currentDay.english);
        break;

      case "en-jp":
        this.elements.questionText.textContent = this.capitalizeFirst(
          currentDay.english
        );
        this.elements.questionHint.textContent =
          "What day is this in Japanese (Kanji)?";
        this.displayJapaneseOptions(currentDay.japanese);
        break;

      case "kanji-hiragana":
        this.elements.questionText.textContent = currentDay.japanese;
        this.elements.questionHint.textContent =
          "What is the hiragana reading for this kanji?";
        this.displayHiraganaOptions(currentDay.hiragana);
        break;

      case "hiragana-kanji":
        this.elements.questionText.textContent = currentDay.hiragana;
        this.elements.questionHint.textContent =
          "What is the kanji for this hiragana reading?";
        this.displayJapaneseOptions(currentDay.japanese);
        break;
    }

    // Reset button states
    this.resetOptionButtons();
    this.elements.skipQuestionBtn.disabled = false;

    // Auto-speak the question text (with a small delay for better UX)
    // Skip TTS for hiragana ↔ kanji modes since pronunciation doesn't help with character recognition
    if (!this.isTTSEffectivelyDisabled()) {
      setTimeout(() => {
        this.speakCurrentQuestion();
      }, 500);
    }
  }

  displayEnglishOptions(correctAnswer) {
    const options = this.generateEnglishOptions(correctAnswer);
    this.elements.optionBtns.forEach((btn, index) => {
      btn.textContent = this.capitalizeFirst(options[index]);
      btn.dataset.answer = options[index];
    });
  }

  displayJapaneseOptions(correctAnswer) {
    const options = this.generateJapaneseOptions(correctAnswer);
    this.elements.optionBtns.forEach((btn, index) => {
      btn.textContent = options[index];
      btn.dataset.answer = options[index];
    });
  }

  displayHiraganaOptions(correctAnswer) {
    const options = this.generateHiraganaOptions(correctAnswer);
    this.elements.optionBtns.forEach((btn, index) => {
      btn.textContent = options[index];
      btn.dataset.answer = options[index];
    });
  }

  generateEnglishOptions(correctAnswer) {
    const allDays = this.daysOfWeek.map((day) => day.english);
    const incorrectDays = allDays.filter((day) => day !== correctAnswer);
    const selectedIncorrect = this.shuffleArray(incorrectDays).slice(0, 3);
    const options = this.shuffleArray([correctAnswer, ...selectedIncorrect]);
    return options;
  }

  generateJapaneseOptions(correctAnswer) {
    const allDays = this.daysOfWeek.map((day) => day.japanese);
    const incorrectDays = allDays.filter((day) => day !== correctAnswer);
    const selectedIncorrect = this.shuffleArray(incorrectDays).slice(0, 3);
    const options = this.shuffleArray([correctAnswer, ...selectedIncorrect]);
    return options;
  }

  generateHiraganaOptions(correctAnswer) {
    const allDays = this.daysOfWeek.map((day) => day.hiragana);
    const incorrectDays = allDays.filter((day) => day !== correctAnswer);
    const selectedIncorrect = this.shuffleArray(incorrectDays).slice(0, 3);
    const options = this.shuffleArray([correctAnswer, ...selectedIncorrect]);
    return options;
  }

  selectAnswer(button) {
    if (button.disabled) return;

    const selectedAnswer = button.dataset.answer;
    const currentDay = this.currentQuestions[this.currentQuestionIndex];

    let correctAnswer;
    switch (this.currentMode) {
      case "jp-en":
        correctAnswer = currentDay.english;
        break;
      case "en-jp":
        correctAnswer = currentDay.japanese;
        break;
      case "kanji-hiragana":
        correctAnswer = currentDay.hiragana;
        break;
      case "hiragana-kanji":
        correctAnswer = currentDay.japanese;
        break;
    }

    const isCorrect = selectedAnswer === correctAnswer;

    // Store the answer for review
    this.answeredQuestions.push({
      question: currentDay,
      selectedAnswer,
      correctAnswer,
      isCorrect,
      mode: this.currentMode,
    });

    if (isCorrect) {
      this.score++;
      button.classList.add("correct");
      // Play correct sound
      this.soundManager.playCorrectSound();
    } else {
      button.classList.add("incorrect");
      // Play incorrect sound
      this.soundManager.playIncorrectSound();
      // Highlight the correct answer
      this.elements.optionBtns.forEach((btn) => {
        if (btn.dataset.answer === correctAnswer) {
          btn.classList.add("correct");
        }
      });
    }

    // Disable all buttons including skip button
    this.elements.optionBtns.forEach((btn) => (btn.disabled = true));
    this.elements.skipQuestionBtn.disabled = true;

    this.updateScore();

    // Automatically move to next question after 0.9 seconds
    this.autoAdvanceTimeout = setTimeout(() => {
      this.nextQuestion();
    }, 900);
  }

  skipQuestion() {
    // Clear any existing auto-advance timeout
    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
      this.autoAdvanceTimeout = null;
    }

    // Disable skip button during transition
    this.elements.skipQuestionBtn.disabled = true;

    // Mark this question as skipped (no score change)
    // Show the correct answer briefly before moving on
    const currentDay = this.currentQuestions[this.currentQuestionIndex];

    let correctAnswer;
    switch (this.currentMode) {
      case "jp-en":
        correctAnswer = currentDay.english;
        break;
      case "en-jp":
        correctAnswer = currentDay.japanese;
        break;
      case "kanji-hiragana":
        correctAnswer = currentDay.hiragana;
        break;
      case "hiragana-kanji":
        correctAnswer = currentDay.japanese;
        break;
    }

    // Highlight the correct answer
    this.elements.optionBtns.forEach((btn) => {
      if (btn.dataset.answer === correctAnswer) {
        btn.classList.add("correct");
      }
      btn.disabled = true;
    });

    // Move to next question after a brief pause to show the correct answer
    setTimeout(() => {
      this.nextQuestion();
    }, 1200);
  }

  nextQuestion() {
    // Clear any existing auto-advance timeout
    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
      this.autoAdvanceTimeout = null;
    }

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.currentQuestions.length) {
      this.showResults();
    } else {
      this.displayQuestion();
    }
  }

  resetOptionButtons() {
    this.elements.optionBtns.forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove("correct", "incorrect");
    });
  }

  updateScore() {
    this.elements.score.textContent = this.score;
  }

  showQuiz() {
    this.elements.quizSection.classList.remove("hidden");
    this.elements.resultsSection.classList.add("hidden");
    this.elements.reviewSection.classList.add("hidden");
  }

  showResults() {
    this.elements.quizSection.classList.add("hidden");
    this.elements.resultsSection.classList.remove("hidden");
    this.elements.reviewSection.classList.add("hidden");

    const percentage = Math.round(
      (this.score / this.currentQuestions.length) * 100
    );

    this.elements.finalScore.textContent = this.score;
    this.elements.finalTotal.textContent = this.currentQuestions.length;
    this.elements.percentage.textContent = percentage;
  }

  showReview() {
    this.elements.quizSection.classList.add("hidden");
    this.elements.resultsSection.classList.add("hidden");
    this.elements.reviewSection.classList.remove("hidden");

    this.populateReview();
  }

  populateReview() {
    this.elements.reviewList.innerHTML = "";

    this.daysOfWeek.forEach((day) => {
      const reviewItem = document.createElement("div");
      reviewItem.className = "review-item";

      reviewItem.innerHTML = `
                <div>
                    <div class="japanese">${day.japanese}</div>
                    <div class="romaji">${day.romaji}</div>
                </div>
                <div class="english">${this.capitalizeFirst(day.english)}</div>
            `;

      this.elements.reviewList.appendChild(reviewItem);
    });
  }

  speakCurrentQuestion() {
    // Check if TTS should be disabled for hiragana ↔ kanji modes
    if (
      this.currentMode === "kanji-hiragana" ||
      this.currentMode === "hiragana-kanji"
    ) {
      this.showFeedback(
        "TTS not needed for character recognition practice",
        1500
      );
      return;
    }

    if (!this.textToSpeech.isSupported() || !this.ttsEnabled) {
      if (!this.ttsEnabled) {
        this.showFeedback("Text-to-speech is disabled", 1000);
      } else {
        console.warn("Text-to-speech not supported");
      }
      return;
    }

    const currentDay = this.currentQuestions[this.currentQuestionIndex];

    switch (this.currentMode) {
      case "jp-en":
        // Speaking Japanese kanji
        this.textToSpeech.speakJapanese(currentDay.japanese);
        break;
      case "en-jp":
        // Speaking English text
        this.textToSpeech.speakEnglish(currentDay.english);
        break;
      // Note: kanji-hiragana and hiragana-kanji cases are handled above
    }
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize the quiz when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.quiz = new JapaneseWeekQuiz();
});

// Handle menu events from main process
if (typeof require !== "undefined") {
  const { ipcRenderer } = require("electron");

  ipcRenderer.on("new-quiz", () => {
    if (window.quiz) {
      window.quiz.startNewQuiz();
    }
  });
}
