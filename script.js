// DOM Elements
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const currentQuestionSpan = document.getElementById('current-question');
const maxQuestionsSpan = document.getElementById('max-questions');
const teamsContainer = document.getElementById('teams-container');
const resetAllScoresBtn = document.getElementById('reset-all-scores');
const showWinnersBtn = document.getElementById('show-winners-btn');
const soundToggleBtn = document.getElementById('sound-toggle');
const backgroundMusic = document.getElementById('background-music');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const winnerSound = document.getElementById('winner-sound');
const wrongCustomSound = document.getElementById('wrong-custom-sound');
const correctCustomSound = document.getElementById('correct-custom-sound');
const winnerSection = document.getElementById('winner-section');
const winnerPodium = document.getElementById('winner-podium');
const closeWinnerBtn = document.getElementById('close-winner-btn');
const confettiContainer = document.getElementById('confetti-container');

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
let isSoundOn = true;

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
    } else {
        playSound(wrongSound);
        scoreElement.classList.add('score-animation-negative');
    }
    
    setTimeout(() => {
        scoreElement.classList.remove('score-animation-positive', 'score-animation-negative');
    }, 1000);
}

// Change question (direction: 1 = next, -1 = previous)
function changeQuestion(direction) {
    currentQuestionIndex += direction;
    if (currentQuestionIndex >= questions.length) currentQuestionIndex = 0;
    if (currentQuestionIndex < 0) currentQuestionIndex = questions.length - 1;

    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    answerText.textContent = question.answer;

    const answerBlurContainer = document.getElementById('answer-blur-container');
    answerBlurContainer.classList.remove('unblurred'); // selalu blur saat pindah soal

    updateQuestionCounter();
}

// Unblur answer
function unblurAnswer() {
    const answerBlurContainer = document.getElementById('answer-blur-container');
    answerBlurContainer.classList.add('unblurred');
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
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score).slice(0, 3);
    
    winnerPodium.innerHTML = '';
    sortedTeams.forEach((team, index) => {
        const podiumStep = document.createElement('div');
        podiumStep.className = `podium-step ${['gold', 'silver', 'bronze'][index]}`;
        
        let medalIcon = '';
        if (index === 0) {
            medalIcon = '<i class="fas fa-crown"></i>';
        } else if (index === 1) {
            medalIcon = '<i class="fas fa-medal"></i>';
        } else if (index === 2) {
            medalIcon = '<i class="fas fa-award"></i>';
        }
        
        podiumStep.innerHTML = `
            <div class="podium-rank">${medalIcon} ${index + 1}</div>
            <div class="podium-team">${team.name}</div>
            <div class="podium-score">${team.score}</div>
        `;
        
        winnerPodium.appendChild(podiumStep);
    });
    
    winnerSection.classList.add('show');
    playSound(winnerSound);
    createConfetti();
}

// Close winner display
function closeWinnerDisplay() {
    winnerSection.classList.remove('show');
    confettiContainer.innerHTML = '';
}

// Create confetti effect
function createConfetti() {
    confettiContainer.innerHTML = '';
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confettiContainer.appendChild(confetti);
    }
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

// Keyboard navigation & score control
let lastNumberKey = null;

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
        changeQuestion(1);
    } else if (e.key === 'ArrowLeft') {
        changeQuestion(-1);
    } else if (e.key === 'Enter') {
        unblurAnswer();
        playSound(correctCustomSound); 
    } else if (e.key === '0') {
        playSound(wrongCustomSound); 
    }

    if (['1','2','3','4','5','6'].includes(e.key)) {
        lastNumberKey = parseInt(e.key, 10) - 1;
        return;
    }

    if (lastNumberKey !== null) {
        if (e.key === '+') {
            adjustScore(lastNumberKey, 10);
            lastNumberKey = null;
        } else if (e.key === '-') {
            adjustScore(lastNumberKey, -5);
            lastNumberKey = null;
        } else {
            lastNumberKey = null;
        }
    }
});

// Event Listeners
resetAllScoresBtn.addEventListener('click', resetAllScores);
showWinnersBtn.addEventListener('click', showWinners);
closeWinnerBtn.addEventListener('click', closeWinnerDisplay);
soundToggleBtn.addEventListener('click', toggleSound);

// Init
initGame();
// Set volume level
backgroundMusic.volume = 0.5; // 50%
correctSound.volume = 1.0;
wrongSound.volume = 1.0;
wrongCustomSound.volume = 1.0;
winnerSound.volume = 1.0;
