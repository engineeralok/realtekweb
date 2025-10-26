// War Room functionality for fetching and displaying project data

let projectsData = [];
let capturedProjects = [];
let liberatedProjects = [];

// Load projects data from API
async function loadProjects() {
    try {
        // Check if API config is available
        if (!window.RetakeTech || !window.RetakeTech.API_CONFIG) {
            throw new Error('API configuration not loaded');
        }
        
        const apiUrl = `${window.RetakeTech.API_CONFIG.staticBaseUrl}${window.RetakeTech.API_CONFIG.endpoints.repos}`;
        
        // Fetch from static repos API
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate response structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid API response format');
        }
        
        // Extract political and neutral arrays from the response
        capturedProjects = Array.isArray(data.political) ? data.political : [];
        liberatedProjects = Array.isArray(data.neutral) ? data.neutral : [];
        
        // Sort by stars (descending) to get top 20
        capturedProjects.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        liberatedProjects.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        
        // Take top 20 of each
        capturedProjects = capturedProjects.slice(0, 20);
        liberatedProjects = liberatedProjects.slice(0, 20);
        
        displayCapturedProjects();
        displayLiberatedProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // Show error to user
        showProjectsError(error);
    }
}

// Display captured projects in table
function displayCapturedProjects() {
    const tbody = document.getElementById('capturedTableBody');
    if (!tbody) return;

    if (capturedProjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No captured projects found.</td></tr>';
        return;
    }

    tbody.innerHTML = capturedProjects.map(project => `
        <tr>
            <td><strong>${project.slug}</strong></td>
            <td class="${!project.hasCoC ? 'status-check' : 'status-cross'}">
                ${!project.hasCoC ? '✓' : '✗'}
            </td>
            <td class="${project.defaultBranchName === 'master' ? 'status-check' : 'status-cross'}">
                ${project.defaultBranchName === 'master' ? '✓' : '✗'}
            </td>
            <td class="${project.orientation === 'neutral' ? 'status-check' : 'status-cross'}">
                ${project.orientation === 'neutral' ? '✓' : '✗'}
            </td>
            <td>
                <button class="submit-issue-btn" onclick="submitIssue('${project.slug}')">
                    Submit Issue
                </button>
            </td>
        </tr>
    `).join('');
}

// Display liberated projects in table
function displayLiberatedProjects() {
    const tbody = document.getElementById('liberatedTableBody');
    if (!tbody) return;

    if (liberatedProjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No liberated projects found.</td></tr>';
        return;
    }

    tbody.innerHTML = liberatedProjects.map(project => `
        <tr>
            <td><strong>${project.slug}</strong></td>
            <td class="${!project.hasCoC ? 'status-check' : 'status-cross'}">
                ${!project.hasCoC ? '✓' : '✗'}
            </td>
            <td class="${project.defaultBranchName === 'master' ? 'status-check' : 'status-cross'}">
                ${project.defaultBranchName === 'master' ? '✓' : '✗'}
            </td>
            <td class="${project.orientation === 'neutral' ? 'status-check' : 'status-cross'}">
                ${project.orientation === 'neutral' ? '✓' : '✗'}
            </td>
        </tr>
    `).join('');
}

// Handle submit issue button click
function submitIssue(projectSlug) {
    try {
        // Check if API config is available
        if (!window.RetakeTech || !window.RetakeTech.API_CONFIG) {
            console.error('API configuration not available');
            showToast('Error: API configuration not loaded', 'error');
            return;
        }
        
        // Since activism API returns 404, use direct GitHub link as fallback
        const githubUrl = `https://github.com/${projectSlug}/issues/new`;
        
        // Open in new tab
        const newWindow = window.open(githubUrl, '_blank');
        
        if (!newWindow) {
            showToast('Error: Popup blocked. Please allow popups for this site.', 'error');
        } else {
            showToast(`Opening GitHub issues for ${projectSlug}...`, 'info');
        }
        
        // Optional: Try activism API in background (for future when it works)
        // const activismUrl = `${window.RetakeTech.API_CONFIG.baseUrl}${window.RetakeTech.API_CONFIG.endpoints.activism}?slug=${projectSlug}`;
        
    } catch (error) {
        console.error('Error submitting issue:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Make submitIssue globally accessible
window.submitIssue = submitIssue;


// Show error message for projects
function showProjectsError(error) {
    const capturedTbody = document.getElementById('capturedTableBody');
    const liberatedTbody = document.getElementById('liberatedTableBody');
    
    // Extract status code and message from error
    let statusCode = 'Unknown';
    let errorMessage = 'Failed to load projects. Please try again later.';
    
    if (error.message) {
        if (error.message.includes('status:')) {
            statusCode = error.message.match(/status: (\d+)/)?.[1] || 'Unknown';
            errorMessage = `HTTP ${statusCode}: ${error.message}`;
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network Error: API server does not allow cross-origin requests. Using fallback data.';
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
    showToast(`API Error: ${errorMessage}`, 'error');
    
    const tableErrorMessage = `<tr><td colspan="5" style="color: #ff4444; text-align: center;">${errorMessage}</td></tr>`;
    
    if (capturedTbody) {
        capturedTbody.innerHTML = tableErrorMessage;
    }
    
    if (liberatedTbody) {
        liberatedTbody.innerHTML = tableErrorMessage.replace('colspan="5"', 'colspan="4"');
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

// Initialize War Room functionality
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure main.js is loaded
    setTimeout(() => {
        loadProjects();
    }, 100);
});
