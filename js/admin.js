// Admin functionality
document.addEventListener('DOMContentLoaded', function() {
    const users = JSON.parse(localStorage.getItem('fundesiaUsers')) || [];
    
    // Update admin stats
    updateAdminStats(users);
    
    // Load recent activity
    loadRecentActivity(users);
    
    // Refresh button
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const users = JSON.parse(localStorage.getItem('fundesiaUsers')) || [];
            updateAdminStats(users);
            loadRecentActivity(users);
        });
    }
});

function updateAdminStats(users) {
    // Total users
    document.getElementById('totalUsers').textContent = users.length;
    
    // Active investments
    const activeInvestments = users.filter(u => u.activeInvestment > 0).length;
    document.getElementById('activeInvestments').textContent = activeInvestments;
    
    // Pending deposits and withdrawals
    let pendingDeposits = 0;
    let pendingWithdrawals = 0;
    
    users.forEach(user => {
        user.transactions.forEach(transaction => {
            if (transaction.status === 'pending') {
                if (transaction.type === 'deposit') pendingDeposits++;
                else if (transaction.type === 'withdrawal') pendingWithdrawals++;
            }
        });
    });
    
    document.getElementById('pendingDeposits').textContent = pendingDeposits;
    document.getElementById('pendingWithdrawals').textContent = pendingWithdrawals;
}

function loadRecentActivity(users) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Clear existing activities
    activityList.innerHTML = '';
    
    // Collect all transactions from all users
    let allTransactions = [];
    
    users.forEach(user => {
        user.transactions.forEach(transaction => {
            allTransactions.push({
                ...transaction,
                userName: user.fullname
            });
        });
    });
    
    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display last 10 transactions
    const recentTransactions = allTransactions.slice(0, 10);
    
    recentTransactions.forEach(transaction => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const icon = document.createElement('div');
        icon.className = 'activity-icon';
        icon.innerHTML = transaction.type === 'deposit' ? '↑' : '↓';
        
        const content = document.createElement('div');
        content.className = 'activity-content';
        
        const title = document.createElement('div');
        title.className = 'activity-title';
        title.textContent = `${transaction.userName} - ${transaction.type}`;
        
        const time = document.createElement('div');
        time.className = 'activity-time';
        time.textContent = new Date(transaction.date).toLocaleString();
        
        const amount = document.createElement('div');
        amount.className = `activity-amount ${transaction.type}`;
        amount.textContent = `UGX ${transaction.amount.toLocaleString()}`;
        
        content.appendChild(title);
        content.appendChild(time);
        
        activityItem.appendChild(icon);
        activityItem.appendChild(content);
        activityItem.appendChild(amount);
        
        activityList.appendChild(activityItem);
    });
}