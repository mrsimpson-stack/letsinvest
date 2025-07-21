// Admin Users Management
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('usersTable')) {
        loadUsersTable();
    }
    
    // Search functionality
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterUsers(this.value);
        });
    }
});

function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('fundesiaUsers')) || [];
    const tableBody = document.querySelector('#usersTable tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add each user to the table
    users.forEach(user => {
        const row = document.createElement('tr');
        
        // User info cells
        row.innerHTML = `
            <td>${user.fullname}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>UGX ${user.mainBalance.toLocaleString()}</td>
            <td>UGX ${user.activeInvestment.toLocaleString()}</td>
            <td>${user.investmentPackage ? 'Active' : 'Inactive'}</td>
            <td>
                <button class="btn-view" data-userid="${user.id}">View</button>
                <button class="btn-edit" data-userid="${user.id}">Edit</button>
                <button class="btn-delete" data-userid="${user.id}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            viewUserDetails(this.getAttribute('data-userid'));
        });
    });
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            editUser(this.getAttribute('data-userid'));
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteUser(this.getAttribute('data-userid'));
        });
    });
}

function filterUsers(searchTerm) {
    const users = JSON.parse(localStorage.getItem('fundesiaUsers')) || [];
    const filteredUsers = users.filter(user => 
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    );
    
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.fullname}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>UGX ${user.mainBalance.toLocaleString()}</td>
            <td>UGX ${user.activeInvestment.toLocaleString()}</td>
            <td>${user.investmentPackage ? 'Active' : 'Inactive'}</td>
            <td>
                <button class="btn-view" data-userid="${user.id}">View</button>
                <button class="btn-edit" data-userid="${user.id}">Edit</button>
                <button class="btn-delete" data-userid="${user.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewUserDetails(userId) {
    const users = JSON.parse(localStorage.getItem('fundesiaUsers')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    // Create modal with user details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>User Details</h3>
            <div class="user-details">
                <div class="detail-row">
                    <span class="detail-label">Full Name:</span>
                    <span class="detail-value">${user.fullname}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${user.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${user.phone}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Main Balance:</span>
                    <span class="detail-value">UGX ${user.mainBalance.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Active Investment:</span>
                    <span class="detail-value">UGX ${user.activeInvestment.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Earnings:</span>
                    <span class="detail-value">UGX ${user.totalEarnings.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Investment Package:</span>
                    <span class="detail-value">${user.investmentPackage ? 'UGX ' + user.investmentPackage.toLocaleString() : 'None'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Investment Date:</span>
                    <span class="detail-value">${user.investmentDate ? new Date(user.investmentDate).toLocaleString() : 'N/A'}</span>
                </div>
            </div>
            <h4>Transaction History</h4>
            <div class="transactions-list">
                ${user.transactions.length > 0 ? 
                    user.transactions.map(t => `
                        <div class="transaction-item ${t.type}">
                            <span class="transaction-type">${t.type.toUpperCase()}</span>
                            <span class="transaction-amount">UGX ${t.amount.toLocaleString()}</span>
                            <span class="transaction-date">${new Date(t.date).toLocaleString()}</span>
                            <span class="transaction-status">${t.status}</span>
                        </div>
                    `).join('') : 
                    '<p>No transactions yet</p>'
                }
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('fundesiaUsers')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    // Create edit modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Edit User</h3>
            <form id="editUserForm">
                <input type="hidden" id="editUserId" value="${user.id}">
                <div class="form-group">
                    <label for="editFullname">Full Name</label>
                    <input type="text" id="editFullname" value="${user.fullname}" required>
                </div>
                <div class="form-group">
                    <label for="editEmail">Email</label>
                    <input type="email" id="editEmail" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="editPhone">Phone</label>
                    <input type="tel" id="editPhone" value="${user.phone}" required>
                </div>
                <div class="form-group">
                    <label for="editBalance">Main Balance</label>
                    <input type="number" id="editBalance" value="${user.mainBalance}" required>
                </div>
                <div class="form-group">
                    <label for="editInvestment">Active Investment</label>
                    <input type="number" id="editInvestment" value="${user.activeInvestment}">
                </div>
                <div class="form-group">
                    <label for="editEarnings">Total Earnings</label>
                    <input type="number" id="editEarnings" value="${user.totalEarnings}">
                </div>
                <button type="submit" class="btn-save">Save Changes</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Form submission
    modal.querySelector('#editUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedUser = {
            ...user,
            fullname: document.getElementById('editFullname').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            mainBalance: parseFloat(document.getElementById('editBalance').value),
            activeInvestment: parseFloat(document.getElementById('editInvestment').value),
            totalEarnings: parseFloat(document.getElementById('editEarnings').value)
        };
        
        // Update user in storage
        const index = users.findIndex(u => u.id === userId);
        users[index] = updatedUser;
        localStorage.setItem('fundesiaUsers', JSON.stringify(users));
        
        // Reload table
        loadUsersTable();
        
        // Close modal
        document.body.removeChild(modal);
    });
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        const users = JSON.parse(localStorage.getItem('fundesiaUsers')) || [];
        const updatedUsers = users.filter(u => u.id !== userId);
        
        localStorage.setItem('fundesiaUsers', JSON.stringify(updatedUsers));
        loadUsersTable();
    }
}