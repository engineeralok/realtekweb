// War Room functionality for fetching and displaying project data

let projectsData = [];
let capturedProjects = [];
let liberatedProjects = [];

// Load projects data from API
async function loadProjects() {
    try {
        // Since /repos endpoint doesn't exist, we'll use sample data for now
        // In a real implementation, you would fetch from a working repos endpoint
        projectsData = [
            {
                name: "travisbrown/cancel-culture",
                noCoc: false,
                masterBranch: false,
                neutralMessaging: false,
                activism: true,
                priority: 1
            },
            {
                name: "example/liberated-repo",
                noCoc: true,
                masterBranch: true,
                neutralMessaging: true,
                activism: false,
                priority: 2
            }
        ];
        
        // Split projects into captured and liberated based on activism field
        capturedProjects = projectsData.filter(project => project.activism);
        liberatedProjects = projectsData.filter(project => !project.activism);
        
        // Sort by priority/score if available
        capturedProjects.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        liberatedProjects.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        
        displayCapturedProjects();
        displayLiberatedProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        showProjectsError();
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
            <td><strong>${project.name}</strong></td>
            <td class="${project.noCoc ? 'status-check' : 'status-cross'}">
                ${project.noCoc ? '✓' : '✗'}
            </td>
            <td class="${project.masterBranch ? 'status-check' : 'status-cross'}">
                ${project.masterBranch ? '✓' : '✗'}
            </td>
            <td class="${project.neutralMessaging ? 'status-check' : 'status-cross'}">
                ${project.neutralMessaging ? '✓' : '✗'}
            </td>
            <td>
                <button class="submit-issue-btn" onclick="submitIssue('${project.name}')">
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
            <td><strong>${project.name}</strong></td>
            <td class="${project.noCoc ? 'status-check' : 'status-cross'}">
                ${project.noCoc ? '✓' : '✗'}
            </td>
            <td class="${project.masterBranch ? 'status-check' : 'status-cross'}">
                ${project.masterBranch ? '✓' : '✗'}
            </td>
            <td class="${project.neutralMessaging ? 'status-check' : 'status-cross'}">
                ${project.neutralMessaging ? '✓' : '✗'}
            </td>
        </tr>
    `).join('');
}

// Handle submit issue button click
function submitIssue(projectName) {
    // Check if there's a backend API for submitting issues
    if (window.RetakeTech.API_CONFIG.baseUrl === 'http://api.retaketech.com') {
        // If API is configured, submit through backend
        submitIssueViaAPI(projectName);
    } else {
        // Otherwise, open GitHub issues page
        const githubUrl = `https://github.com/${projectName}/issues/new`;
        window.open(githubUrl, '_blank');
    }
}

// Submit issue via API (if backend supports it)
async function submitIssueViaAPI(projectName) {
    try {
        const response = await window.RetakeTech.apiFetch('/submit-issue', {
            method: 'POST',
            body: JSON.stringify({
                project: projectName,
                type: 'neutrality_request'
            })
        });
        
        if (response.success) {
            alert('Issue submitted successfully!');
        } else {
            throw new Error(response.error || 'Failed to submit issue');
        }
    } catch (error) {
        console.error('Error submitting issue:', error);
        alert('Failed to submit issue. Please try again later.');
    }
}

// Show error message for projects
function showProjectsError() {
    const capturedTbody = document.getElementById('capturedTableBody');
    const liberatedTbody = document.getElementById('liberatedTableBody');
    
    const errorMessage = '<tr><td colspan="5" style="color: #ff4444; text-align: center;">Failed to load projects. Please try again later.</td></tr>';
    
    if (capturedTbody) {
        capturedTbody.innerHTML = errorMessage;
    }
    
    if (liberatedTbody) {
        liberatedTbody.innerHTML = errorMessage.replace('colspan="5"', 'colspan="4"');
    }
}

// Initialize War Room functionality
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});
