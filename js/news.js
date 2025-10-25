// News functionality for fetching news feed and handling submissions

let newsData = [];

// Progress messages for submission modal
const progressMessages = [
    "Retrieving details of Github project",
    "Analyzing Github source code files",
    "Analyzing project README",
    "Analyzing project description",
    "Looking for Code of Conduct",
    "Looking for Contributor's Guide",
    "Using AI to identify political intent in project",
    "Using AI to identify nature of Code of Conduct",
    "Using AI to generate your writing style",
    "Using AI to generate title and contents of pull request",
    "Using AI to verify generation"
];

// Load news data from API
async function loadNews() {
    try {
        const response = await window.RetakeTech.apiFetch(`${window.RetakeTech.API_CONFIG.endpoints.news}?days=7`);
        newsData = response.items || [];
        
        // Sort by date descending
        newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        displayNews();
    } catch (error) {
        console.error('Error loading news:', error);
        showNewsError();
    }
}

// Display news in table
function displayNews() {
    const tbody = document.getElementById('newsTableBody');
    if (!tbody) return;

    if (newsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No news items found.</td></tr>';
        return;
    }

    // Show last 20 entries
    const recentNews = newsData.slice(0, 20);
    
    tbody.innerHTML = recentNews.map(item => `
        <tr>
            <td><strong>${item.slug}</strong></td>
            <td>${item.currentOrientation || 'Unknown'} ${window.RetakeTech.getStatusEmoji(item.currentOrientation)}</td>
            <td>${item.isPolitical ? 'Political' : 'Neutral'} ${window.RetakeTech.getStatusEmoji(item.isPolitical ? 'captured' : 'liberated')}</td>
            <td>${window.RetakeTech.formatDate(item.date)}</td>
        </tr>
    `).join('');
}

// Show error message for news
function showNewsError() {
    const tbody = document.getElementById('newsTableBody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="4" style="color: #ff4444; text-align: center;">Failed to load news. Please try again later.</td></tr>';
    }
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const githubSlug = form.githubSlug.value.trim();
    
    if (!githubSlug) {
        alert('Please enter a GitHub slug (e.g., owner/repo)');
        return;
    }
    
    // Validate GitHub slug format
    if (!/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(githubSlug)) {
        alert('Please enter a valid GitHub slug format (owner/repo)');
        return;
    }
    
    submitNews(githubSlug);
}

// Submit news with progress modal
async function submitNews(githubSlug) {
    // Show progress modal
    window.RetakeTech.showModal('progressModal');
    
    const progressText = document.getElementById('progressText');
    let currentMessageIndex = 0;
    
    // Show progress messages
    const progressInterval = setInterval(() => {
        if (currentMessageIndex < progressMessages.length) {
            progressText.textContent = progressMessages[currentMessageIndex];
            currentMessageIndex++;
        } else {
            clearInterval(progressInterval);
            progressText.textContent = 'Submitting to API...';
        }
    }, 2500); // 2.5 seconds per message
    
    try {
        // Wait for progress messages to complete (30 seconds)
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // Submit to API
        const response = await window.RetakeTech.apiFetch(window.RetakeTech.API_CONFIG.endpoints.news, {
            method: 'POST',
            body: JSON.stringify({
                slug: githubSlug
            })
        });
        
        clearInterval(progressInterval);
        
        if (response.success) {
            progressText.textContent = 'Success! News item submitted successfully.';
            setTimeout(() => {
                window.RetakeTech.hideModal('progressModal');
                // Reload news to show the new item
                loadNews();
                // Reset form
                document.getElementById('submitForm').reset();
            }, 2000);
        } else {
            throw new Error(response.error || 'Failed to submit news');
        }
    } catch (error) {
        clearInterval(progressInterval);
        console.error('Error submitting news:', error);
        progressText.textContent = 'Error: Failed to submit news. Please try again.';
        setTimeout(() => {
            window.RetakeTech.hideModal('progressModal');
        }, 3000);
    }
}

// Initialize news functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load news data
    loadNews();
    
    // Add form submit handler
    const submitForm = document.getElementById('submitForm');
    if (submitForm) {
        submitForm.addEventListener('submit', handleSubmit);
    }
});
