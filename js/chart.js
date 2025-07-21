// Initialize charts on dashboard load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('earningsChart')) {
        initEarningsChart();
    }
    
    if (document.getElementById('investmentChart')) {
        initInvestmentChart();
    }
});

function initEarningsChart() {
    const ctx = document.getElementById('earningsChart').getContext('2d');
    
    // Sample data - in a real app, you would get this from your database
    const earningsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Daily Earnings',
            data: [1500, 2500, 3500, 4500, 5500, 6500],
            backgroundColor: 'rgba(0, 206, 201, 0.2)',
            borderColor: 'rgba(0, 206, 201, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: earningsData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#f5f6fa'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#f5f6fa',
                        callback: function(value) {
                            return 'UGX ' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#f5f6fa'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function initInvestmentChart() {
    const ctx = document.getElementById('investmentChart').getContext('2d');
    
    // Sample data
    const investmentData = {
        labels: ['Basic', 'Starter', 'Standard', 'Premium', 'Gold', 'Platinum', 'Diamond'],
        datasets: [{
            label: 'Investment Packages',
            data: [10000, 30000, 50000, 75000, 100000, 150000, 250000],
            backgroundColor: [
                'rgba(108, 92, 231, 0.7)',
                'rgba(0, 206, 201, 0.7)',
                'rgba(253, 203, 110, 0.7)',
                'rgba(225, 112, 85, 0.7)',
                'rgba(214, 48, 49, 0.7)',
                'rgba(0, 184, 148, 0.7)',
                'rgba(162, 155, 254, 0.7)'
            ],
            borderColor: [
                'rgba(108, 92, 231, 1)',
                'rgba(0, 206, 201, 1)',
                'rgba(253, 203, 110, 1)',
                'rgba(225, 112, 85, 1)',
                'rgba(214, 48, 49, 1)',
                'rgba(0, 184, 148, 1)',
                'rgba(162, 155, 254, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: investmentData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += 'UGX ' + context.raw.toLocaleString();
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#f5f6fa',
                        callback: function(value) {
                            return 'UGX ' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#f5f6fa'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}