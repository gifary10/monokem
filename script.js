// DOM Elements
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const currentQuestionSpan = document.getElementById('current-question');
const maxQuestionsSpan = document.getElementById('max-questions');
const nextQuestionBtn = document.getElementById('next-question-btn');
const showAnswerBtn = document.getElementById('show-answer-btn');
const accessCodeInput = document.getElementById('access-code-input');
const teamsContainer = document.getElementById('teams-container');
const resetAllScoresBtn = document.getElementById('reset-all-scores');
const showWinnersBtn = document.getElementById('show-winners-btn');
const winnerModal = document.getElementById('winner-modal');
const closeModalBtn = document.getElementById('close-modal');
const winnerCardsContainer = document.getElementById('winner-cards-container');
const soundToggleBtn = document.getElementById('sound-toggle');
const backgroundMusic = document.getElementById('background-music');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const winnerSound = document.getElementById('winner-sound');

// Game State
let currentQuestionIndex = -1;
const teams = [
    { name: "1. OFFICE", score: 0 },
    { name: "2. ENG & MTC", score: 0 },
    { name: "3. LAB / QCTS", score: 0 },
    { name: "4. PURIFIKASI", score: 0 },
    { name: "5. MILLING", score: 0 },
    { name: "6. PPIC & WH", score: 0 }
];
const ACCESS_CODE = "1234"; // Simple access code for demo purposes
let isSoundOn = true;
let isCodeEntered = false;

// Confetti Settings
const confettiSettings = {
  target: 'winner-modal',
  max: 150,
  size: 1.5,
  animate: true,
  props: ['circle', 'square', 'triangle', 'line'],
  colors: [[255, 215, 0], [192, 192, 192], [205, 127, 50], [46, 204, 113]],
  clock: 25,
  rotate: true,
  start_from_edge: true,
  respawn: true
};

// Initialize the game
function initGame() {
    maxQuestionsSpan.textContent = questions.length;
    renderTeams();
    updateQuestionCounter();
}

// Render team cards
function renderTeams() {
    teamsContainer.innerHTML = '';
    teams.forEach((team, index) => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <div class="team-name">${team.name}</div>
            <div class="team-score-container">
                <span class="team-score">${team.score}</span>
            </div>
            <div class="team-controls">
                <button class="btn btn-primary" onclick="adjustScore(${index}, 10)">+10</button>
                <button class="btn btn-warning" onclick="adjustScore(${index}, -5)">-5</button>
            </div>
        `;
        teamsContainer.appendChild(teamCard);
    });
}

// Adjust team score
function adjustScore(teamIndex, points) {
    teams[teamIndex].score += points;
    renderTeams();
    
    const scoreElement = document.querySelectorAll('.team-score')[teamIndex];
    if (points > 0) {
        playSound(correctSound);
        scoreElement.classList.add('score-animation-positive');
        // Tambahkan efek confetti mini
        const miniConfetti = new ConfettiGenerator({
            target: scoreElement.parentNode,
            max: 10,
            size: 0.8,
            clock: 15
        });
        miniConfetti.render();
        setTimeout(() => miniConfetti.clear(), 1000);
    } else {
        playSound(wrongSound);
        scoreElement.classList.add('score-animation-negative');
    }
    
    setTimeout(() => {
        scoreElement.classList.remove('score-animation-positive', 'score-animation-negative');
    }, 1000);
}

// Show next question
function showNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = 0;
    }
    
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    answerText.textContent = question.answer;
    
    // Show answer if code was already entered
    if (isCodeEntered) {
        document.getElementById('blur-container').classList.add('unblurred');
        showAnswerBtn.textContent = 'Soal Terbuka';
        showAnswerBtn.disabled = true;
    } else {
        const blurContainer = document.getElementById('blur-container');
        blurContainer.classList.remove('unblurred');
        showAnswerBtn.textContent = 'Buka Soal';
        showAnswerBtn.disabled = false;
    }
    
    updateQuestionCounter();
}

// Show answer with access code
function showAnswer() {
    const code = accessCodeInput.value;
    if (code === ACCESS_CODE) {
        isCodeEntered = true;
        document.getElementById('blur-container').classList.add('unblurred');
        accessCodeInput.value = '';
        showAnswerBtn.textContent = 'Soal Terbuka';
        showAnswerBtn.disabled = true;
    } else {
        alert('Kode akses salah!');
    }
}

// Reset all scores
function resetAllScores() {
    if (confirm('Apakah Anda yakin ingin mereset semua nilai?')) {
        teams.forEach(team => team.score = 0);
        renderTeams();
    }
}

// Show winners
function showWinners() {
    // Sort teams by score (descending)
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    
    winnerCardsContainer.innerHTML = '';
    sortedTeams.forEach((team, index) => {
        const winnerCard = document.createElement('div');
        winnerCard.className = 'winner-card';
        
        // Add podium classes based on position
        let podiumClass = '';
        let medalIcon = '';
        if (index === 0) {
            podiumClass = 'gold';
            medalIcon = '<i class="fas fa-crown"></i>';
        } else if (index === 1) {
            podiumClass = 'silver';
            medalIcon = '<i class="fas fa-medal"></i>';
        } else if (index === 2) {
            podiumClass = 'bronze';
            medalIcon = '<i class="fas fa-award"></i>';
        }
        
        winnerCard.innerHTML = `
            <div class="podium ${podiumClass}">
                <div class="podium-rank">${medalIcon} ${index + 1}</div>
                <div class="team-name">${team.name}</div>
                <div class="team-score-container">
                    <span class="score-label">Skor:</span>
                    <span class="team-score">${team.score}</span>
                </div>
                <div class="confetti-canvas"></div>
            </div>
        `;
        winnerCardsContainer.appendChild(winnerCard);
    });
    
    winnerModal.style.display = 'flex';
    playSound(winnerSound);
    
    // Inisialisasi confetti hanya untuk pemenang pertama
    if (sortedTeams.length > 0) {
        setTimeout(() => {
            const confetti = new ConfettiGenerator(confettiSettings);
            confetti.render();
            
            // Hentikan confetti setelah 5 detik
            setTimeout(() => confetti.clear(), 5000);
        }, 500);
    }
}

// Close modal
function closeModal() {
    winnerModal.style.display = 'none';
}

// Toggle sound
function toggleSound() {
    isSoundOn = !isSoundOn;
    if (isSoundOn) {
        soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        backgroundMusic.play();
    } else {
        soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        backgroundMusic.pause();
    }
}

// Play sound if enabled
function playSound(soundElement) {
    if (isSoundOn) {
        soundElement.currentTime = 0;
        soundElement.play();
    }
}

// Update question counter
function updateQuestionCounter() {
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
}

// Event Listeners
nextQuestionBtn.addEventListener('click', showNextQuestion);
showAnswerBtn.addEventListener('click', showAnswer);
resetAllScoresBtn.addEventListener('click', resetAllScores);
showWinnersBtn.addEventListener('click', showWinners);
closeModalBtn.addEventListener('click', closeModal);
soundToggleBtn.addEventListener('click', toggleSound);

// Initialize the game
initGame();