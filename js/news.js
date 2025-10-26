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
        showNewsError(error);
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
function showNewsError(error) {
    const tbody = document.getElementById('newsTableBody');
    
    // Extract status code and message from error
    let statusCode = 'Unknown';
    let errorMessage = 'Failed to load news. Please try again later.';
    
    if (error.message) {
        if (error.message.includes('status:')) {
            statusCode = error.message.match(/status: (\d+)/)?.[1] || 'Unknown';
            errorMessage = `HTTP ${statusCode}: ${error.message}`;
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network Error: Failed to fetch data. Check your internet connection and try again.';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'CORS Error: Cross-origin request blocked. API may not allow browser requests.';
        } else {
            errorMessage = `Error: ${error.message}`;
        }
    }
    
    // Add error type if available
    if (error.name) {
        errorMessage = `${error.name}: ${errorMessage}`;
    }
    
    // Show toast notification
    showToast(`News API Error: ${errorMessage}`, 'error');
    
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="4" style="color: #ff4444; text-align: center;">${errorMessage}</td></tr>`;
    }
}

// Toast notification function
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.getElementById('toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ff4444' : '#00d4ff'};
        color: ${type === 'error' ? '#ffffff' : '#000000'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 600px;
        width: 90%;
        word-wrap: break-word;
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        text-align: center;
    `;
    toast.textContent = message;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
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
