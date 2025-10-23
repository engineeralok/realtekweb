// Examples carousel functionality for home page

let examplesData = [];
let currentIndex = 0;
const examplesPerPage = 3;

// Load examples data
async function loadExamples() {
    try {
        const response = await fetch('data/examples.json');
        examplesData = await response.json();
        
        // Shuffle and select initial 3 examples
        const shuffled = [...examplesData].sort(() => Math.random() - 0.5);
        examplesData = shuffled;
        
        displayExamples();
    } catch (error) {
        console.error('Error loading examples:', error);
        showError('Failed to load examples. Please try again later.');
    }
}

// Display current examples
function displayExamples() {
    const container = document.getElementById('examplesContainer');
    if (!container) return;

    const startIndex = currentIndex;
    const endIndex = Math.min(startIndex + examplesPerPage, examplesData.length);
    const currentExamples = examplesData.slice(startIndex, endIndex);

    container.innerHTML = currentExamples.map(example => `
        <div class="example-card">
            <h3 class="example-title">${example.title}</h3>
            <p class="example-description">${example.description}</p>
            <a href="${example.source}" class="example-source" target="_blank" rel="noopener noreferrer">Source</a>
        </div>
    `).join('');

    updateNavigationButtons();
}

// Update navigation button states
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentIndex + examplesPerPage >= examplesData.length;
    }
}

// Navigate to previous examples
function showPrevious() {
    if (currentIndex > 0) {
        currentIndex = Math.max(0, currentIndex - examplesPerPage);
        displayExamples();
    }
}

// Navigate to next examples
function showNext() {
    if (currentIndex + examplesPerPage < examplesData.length) {
        currentIndex = Math.min(examplesData.length - examplesPerPage, currentIndex + examplesPerPage);
        displayExamples();
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById('examplesContainer');
    if (container) {
        container.innerHTML = `
            <div class="example-card" style="grid-column: 1 / -1; text-align: center;">
                <p style="color: #ff4444; font-size: 1.1rem;">${message}</p>
            </div>
        `;
    }
}

// Initialize examples functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load examples data
    loadExamples();

    // Add event listeners for navigation
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevious);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', showNext);
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showPrevious();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    });
});
