// User data simulation
let users = JSON.parse(localStorage.getItem('fundesiaUsers')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const depositForm = document.getElementById('depositForm');
const withdrawForm = document.getElementById('withdrawForm');
const loginError = document.getElementById('loginError');

// Login Functionality
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Find user
        const user = users.find(u => (u.email === email || u.phone === email) && u.password === password);
        
        if (user) {
            // Login successful
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Add welcome bonus if it's first login
            if (!user.hasReceivedWelcomeBonus) {
                user.totalEarnings += 2000;
                user.todayEarnings += 2000;
                user.mainBalance += 2000;
                user.hasReceivedWelcomeBonus = true;
                
                // Update user in storage
                const index = users.findIndex(u => u.email === user.email);
                users[index] = user;
                localStorage.setItem('fundesiaUsers', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
            
            window.location.href = 'dashboard.html';
        } else {
            // Login failed
            loginError.style.display = 'block';
        }
    });
}

// Registration Functionality
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            alert('Email already registered!');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            fullname,
            email,
            phone,
            password,
            mainBalance: 0,
            todayEarnings: 0,
            totalEarnings: 0,
            activeInvestment: 0,
            investmentPackage: null,
            investmentDate: null,
            hasReceivedWelcomeBonus: false,
            transactions: []
        };
        
        users.push(newUser);
        localStorage.setItem('fundesiaUsers', JSON.stringify(users));
        
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });
}

// Dashboard Functionality
if (depositForm) {
    depositForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseFloat(document.getElementById('depositAmount').value);
        const number = document.getElementById('depositNumber').value;
        const screenshot = document.getElementById('depositScreenshot').files[0];
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        if (!number) {
            alert('Please enter your payment number');
            return;
        }
        
        if (!screenshot) {
            alert('Please upload payment screenshot');
            return;
        }
        
        // Create WhatsApp message
        const message = `Deposit Request\n\nUser: ${currentUser.fullname}\nEmail: ${currentUser.email}\nPhone: ${currentUser.phone}\nAmount: UGX ${amount}\nPayment Number: ${number}`;
        
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/256749939908?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Add transaction record
        const transaction = {
            type: 'deposit',
            amount,
            number,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        currentUser.transactions.push(transaction);
        
        // Update user in storage
        const index = users.findIndex(u => u.id === currentUser.id);
        users[index] = currentUser;
        localStorage.setItem('fundesiaUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('Deposit request submitted. Please wait for confirmation.');
    });
}

if (withdrawForm) {
    withdrawForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const number = document.getElementById('withdrawNumber').value;
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        if (amount > currentUser.mainBalance) {
            alert('Insufficient balance for withdrawal');
            return;
        }
        
        if (!number) {
            alert('Please enter your withdrawal number');
            return;
        }
        
        // Create WhatsApp message
        const message = `Withdrawal Request\n\nUser: ${currentUser.fullname}\nEmail: ${currentUser.email}\nPhone: ${currentUser.phone}\nAmount: UGX ${amount}\nWithdrawal Number: ${number}`;
        
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/256749939908?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Deduct from balance
        currentUser.mainBalance -= amount;
        currentUser.totalEarnings -= amount;
        
        // Add transaction record
        const transaction = {
            type: 'withdrawal',
            amount,
            number,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        currentUser.transactions.push(transaction);
        
        // Update user in storage
        const index = users.findIndex(u => u.id === currentUser.id);
        users[index] = currentUser;
        localStorage.setItem('fundesiaUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateDashboard();
        
        alert('Withdrawal request submitted. Please wait for processing.');
    });
}

// Investment Packages
document.querySelectorAll('.btn-invest').forEach(button => {
    button.addEventListener('click', function() {
        const packageAmount = parseInt(this.getAttribute('data-package'));
        
        if (currentUser.mainBalance < packageAmount) {
            alert('Insufficient balance for this investment package');
            return;
        }
        
        if (confirm(`Are you sure you want to invest UGX ${packageAmount}?`)) {
            // Deduct from balance
            currentUser.mainBalance -= packageAmount;
            currentUser.activeInvestment = packageAmount;
            currentUser.investmentPackage = packageAmount;
            currentUser.investmentDate = new Date().toISOString();
            
            // Update user in storage
            const index = users.findIndex(u => u.id === currentUser.id);
            users[index] = currentUser;
            localStorage.setItem('fundesiaUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            updateDashboard();
            
            alert(`Successfully invested UGX ${packageAmount}. You will start earning daily profits.`);
        }
    });
});

// Update Dashboard
function updateDashboard() {
    if (!currentUser) return;
    
    // Calculate daily earnings if invested
    if (currentUser.activeInvestment > 0) {
        const investmentDate = new Date(currentUser.investmentDate);
        const today = new Date();
        
        // Check if 24 hours have passed
        if (today - investmentDate >= 24 * 60 * 60 * 1000) {
            const daysPassed = Math.floor((today - investmentDate) / (24 * 60 * 60 * 1000));
            
            // Calculate earnings based on package
            let dailyEarnings = 0;
            
            if (currentUser.activeInvestment === 10000) dailyEarnings = 1500;
            else if (currentUser.activeInvestment === 30000) dailyEarnings = 2500;
            else if (currentUser.activeInvestment === 50000) dailyEarnings = 3500;
            else if (currentUser.activeInvestment === 75000) dailyEarnings = 4500;
            else if (currentUser.activeInvestment === 100000) dailyEarnings = 5500;
            else if (currentUser.activeInvestment === 150000) dailyEarnings = 6500;
            else if (currentUser.activeInvestment === 250000) dailyEarnings = 9000;
            
            // Update earnings
            currentUser.todayEarnings = dailyEarnings;
            currentUser.totalEarnings += dailyEarnings;
            currentUser.mainBalance += dailyEarnings;
            
            // Update investment date to now
            currentUser.investmentDate = new Date().toISOString();
            
            // Update user in storage
            const index = users.findIndex(u => u.id === currentUser.id);
            users[index] = currentUser;
            localStorage.setItem('fundesiaUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
    
    // Update UI elements
    document.getElementById('username').textContent = currentUser.fullname;
    document.getElementById('mainBalance').textContent = `UGX ${currentUser.mainBalance.toLocaleString()}`;
    document.getElementById('todayEarnings').textContent = `UGX ${currentUser.todayEarnings.toLocaleString()}`;
    document.getElementById('totalEarnings').textContent = `UGX ${currentUser.totalEarnings.toLocaleString()}`;
    document.getElementById('activeInvestment').textContent = `UGX ${currentUser.activeInvestment.toLocaleString()}`;
    
    // Update avatar
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.textContent = currentUser.fullname.charAt(0).toUpperCase();
    }
}

// Tab functionality
const tabButtons = document.querySelectorAll('.tab-btn');
if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
}

// Initialize dashboard when loaded
if (window.location.pathname.includes('dashboard.html')) {
    if (!currentUser) {
        window.location.href = 'login.html';
    } else {
        updateDashboard();
        
        // Check for earnings every minute
        setInterval(updateDashboard, 60000);
    }
}

// Logout functionality
const logoutLinks = document.querySelectorAll('a[href="index.html"]');
logoutLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href') === 'index.html') {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    });
});