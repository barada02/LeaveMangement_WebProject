// Sample leave requests data
const leaveRequests = [
    {
        id: 1,
        employee: {
            name: "John Doe",
            id: "EMP001",
            avatar: "https://via.placeholder.com/40"
        },
        leaveType: "Annual Leave",
        fromDate: "2023-12-20",
        toDate: "2023-12-25",
        duration: "5 days",
        reason: "Family vacation"
    },
    {
        id: 2,
        employee: {
            name: "Jane Smith",
            id: "EMP002",
            avatar: "https://via.placeholder.com/40"
        },
        leaveType: "Sick Leave",
        fromDate: "2023-12-18",
        toDate: "2023-12-19",
        duration: "2 days",
        reason: "Medical appointment"
    }
];

// Sample recent activities
const recentActivities = [
    {
        type: "leave-approved",
        employee: "John Doe",
        time: "2 hours ago",
        icon: "fas fa-check-circle",
        iconColor: "#4caf50",
        iconBg: "#e8f5e9"
    },
    {
        type: "leave-rejected",
        employee: "Alice Johnson",
        time: "4 hours ago",
        icon: "fas fa-times-circle",
        iconColor: "#f44336",
        iconBg: "#ffebee"
    },
    {
        type: "leave-requested",
        employee: "Bob Wilson",
        time: "5 hours ago",
        icon: "fas fa-clock",
        iconColor: "#ff9800",
        iconBg: "#fff3e0"
    }
];

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to create leave request row
function createLeaveRequestRow(request) {
    return `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${request.employee.avatar}" alt="${request.employee.name}" style="width: 30px; height: 30px; border-radius: 50%;">
                    <div>
                        <div>${request.employee.name}</div>
                        <div style="font-size: 0.8em; color: #666;">${request.employee.id}</div>
                    </div>
                </div>
            </td>
            <td>${request.leaveType}</td>
            <td>${formatDate(request.fromDate)}</td>
            <td>${formatDate(request.toDate)}</td>
            <td>${request.duration}</td>
            <td>${request.reason}</td>
            <td>
                <div class="action-buttons">
                    <button class="approve-btn" onclick="handleLeaveAction(${request.id}, 'approve')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="reject-btn" onclick="handleLeaveAction(${request.id}, 'reject')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Function to create activity item
function createActivityItem(activity) {
    return `
        <div class="activity-item">
            <div class="activity-icon" style="background: ${activity.iconBg}; color: ${activity.iconColor}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <h4>${activity.employee} - ${getActivityText(activity.type)}</h4>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `;
}

// Function to get activity text
function getActivityText(type) {
    switch(type) {
        case 'leave-approved':
            return 'Leave request approved';
        case 'leave-rejected':
            return 'Leave request rejected';
        case 'leave-requested':
            return 'Requested for leave';
        default:
            return '';
    }
}

// Function to handle leave actions
function handleLeaveAction(leaveId, action) {
    // Here you would typically make an API call to update the leave status
    console.log(`Leave ${leaveId} ${action}ed`);
    
    // For demo purposes, we'll just show an alert
    alert(`Leave request ${action}ed successfully!`);
    
    // Remove the row from the table
    const row = document.querySelector(`tr[data-leave-id="${leaveId}"]`);
    if (row) {
        row.remove();
    }
    
    // Update the counts
    updateCounts(action);
}

// Function to update dashboard counts
function updateCounts(action) {
    const pendingCount = document.querySelector('.card:nth-child(1) .count');
    const approvedCount = document.querySelector('.card:nth-child(2) .count');
    const rejectedCount = document.querySelector('.card:nth-child(3) .count');
    
    if (action === 'approve') {
        pendingCount.textContent = parseInt(pendingCount.textContent) - 1;
        approvedCount.textContent = parseInt(approvedCount.textContent) + 1;
    } else if (action === 'reject') {
        pendingCount.textContent = parseInt(pendingCount.textContent) - 1;
        rejectedCount.textContent = parseInt(rejectedCount.textContent) + 1;
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Populate leave requests table
    const leaveRequestsTable = document.querySelector('.leave-requests tbody');
    leaveRequestsTable.innerHTML = leaveRequests.map(request => createLeaveRequestRow(request)).join('');
    
    // Populate recent activities
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = recentActivities.map(activity => createActivityItem(activity)).join('');
    
    // Initialize search functionality
    const searchInput = document.querySelector('.header-search input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = leaveRequestsTable.getElementsByTagName('tr');
        
        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
});
