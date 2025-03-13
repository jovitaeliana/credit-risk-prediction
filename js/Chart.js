// Credit Risk Prediction - Simplified JavaScript for Charts

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - initializing components");
    
    // Initialize core features
    initializeThemeToggle();
    initializeCharts();
    createTooltips();
});

// Initialize all charts in the page
function initializeCharts() {
    console.log("Initializing charts");
    
    // Get theme colors
    const mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim();
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    
    window.appCharts = [];
    
    // 1. Loan Status Distribution Chart
    if (document.getElementById('loanStatusChart')) {
        console.log("Creating Loan Status Distribution chart");
        const loanCtx = document.getElementById('loanStatusChart').getContext('2d');
        const loanStatusChart = new Chart(loanCtx, {
            type: 'pie',
            data: {
                labels: ['Current', 'Fully Paid', 'Charged Off', 'Late (31-120 days)', 'Other'],
                datasets: [{
                    data: [48.09, 39.62, 9.11, 1.48, 1.70],
                    backgroundColor: [
                        mainColor,
                        secondaryColor,
                        accentColor,
                        '#9575cd',
                        '#b0bec5'
                    ],
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor
                        }
                    },
                    title: {
                        display: true,
                        text: 'Loan Status Distribution',
                        color: textColor
                    }
                }
            }
        });
        
        window.appCharts.push(loanStatusChart);
    }

    // 2. Class Distribution Chart
    if (document.getElementById('classDistributionChart')) {
        console.log("Creating Class Distribution chart");
        const classCtx = document.getElementById('classDistributionChart').getContext('2d');
        const classDistributionChart = new Chart(classCtx, {
            type: 'doughnut',
            data: {
                labels: ['Good Loans (0)', 'Bad Loans (1)'],
                datasets: [{
                    data: [81.01, 18.99],
                    backgroundColor: [mainColor, accentColor],
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor
                        }
                    },
                    title: {
                        display: true,
                        text: 'Target Class Distribution',
                        color: textColor
                    }
                }
            }
        });
        
        window.appCharts.push(classDistributionChart);
    }

    // 3. Feature Importance Chart
    if (document.getElementById('featureImportanceChart')) {
        console.log("Creating Feature Importance chart");
        const featureCtx = document.getElementById('featureImportanceChart').getContext('2d');
        const featureImportanceChart = new Chart(featureCtx, {
            type: 'bar',
            data: {
                labels: [
                    'Last Payment Amount', 
                    'Loan Grade', 
                    'Interest Rate', 
                    'Payment-to-Income Ratio', 
                    'DTI Ratio', 
                    'Revolving Utilization', 
                    'Term Length', 
                    'Credit History Length', 
                    'Recoveries', 
                    'Loan Amount'
                ],
                datasets: [{
                    label: 'Feature Importance',
                    data: [0.189, 0.153, 0.142, 0.134, 0.094, 0.087, 0.076, 0.058, 0.043, 0.024],
                    backgroundColor: mainColor,
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Feature Importance (XGBoost)',
                        color: textColor
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Importance Score',
                            color: textColor
                        },
                        ticks: {
                            color: textColor
                        }
                    },
                    y: {
                        ticks: {
                            color: textColor
                        }
                    }
                }
            }
        });
        
        window.appCharts.push(featureImportanceChart);
    }

    // 4. Model Comparison Chart
    if (document.getElementById('modelComparisonChart')) {
        console.log("Creating Model Comparison chart");
        const comparisonCtx = document.getElementById('modelComparisonChart').getContext('2d');
        const modelComparisonChart = new Chart(comparisonCtx, {
            type: 'radar',
            data: {
                labels: ['Accuracy', 'ROC-AUC', 'Precision', 'Recall', 'F1 Score', 'Speed'],
                datasets: [
                    {
                        label: 'XGBoost',
                        data: [0.959, 0.988, 0.926, 0.852, 0.888, 0.95],
                        backgroundColor: `${mainColor}40`,
                        borderColor: mainColor,
                        borderWidth: 3
                    },
                    {
                        label: 'Random Forest',
                        data: [0.944, 0.982, 0.894, 0.803, 0.846, 0.30],
                        backgroundColor: `${secondaryColor}40`,
                        borderColor: secondaryColor,
                        borderWidth: 3
                    },
                    {
                        label: 'Logistic Regression',
                        data: [0.913, 0.975, 0.718, 0.896, 0.797, 0.90],
                        backgroundColor: `${accentColor}40`,
                        borderColor: accentColor,
                        borderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor
                        }
                    },
                    title: {
                        display: true,
                        text: 'Model Performance Comparison',
                        color: textColor
                    }
                }
            }
        });
        
        window.appCharts.push(modelComparisonChart);
    }

    // 5. ROC Curve Chart
    if (document.getElementById('rocCurveChart')) {
        console.log("Creating ROC Curve chart");
        const rocCtx = document.getElementById('rocCurveChart').getContext('2d');
        const rocChart = new Chart(rocCtx, {
            type: 'line',
            data: {
                labels: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                datasets: [
                    {
                        label: 'XGBoost (AUC: 0.988)',
                        data: [0, 0.65, 0.78, 0.86, 0.91, 0.94, 0.96, 0.97, 0.98, 0.99, 1],
                        borderColor: mainColor,
                        borderWidth: 3,
                        fill: false
                    },
                    {
                        label: 'Random Forest (AUC: 0.982)',
                        data: [0, 0.6, 0.73, 0.82, 0.88, 0.92, 0.94, 0.96, 0.97, 0.99, 1],
                        borderColor: secondaryColor,
                        borderWidth: 3,
                        fill: false
                    },
                    {
                        label: 'Random Baseline',
                        data: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                        borderColor: '#cccccc',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'ROC Curve Comparison',
                        color: textColor
                    },
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'False Positive Rate',
                            color: textColor
                        },
                        ticks: { color: textColor }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'True Positive Rate',
                            color: textColor
                        },
                        ticks: { color: textColor }
                    }
                }
            }
        });
        
        window.appCharts.push(rocChart);
    }
    
    console.log("All charts initialized successfully:", window.appCharts.length);
}

// Update chart themes when theme changes
function updateChartsTheme() {
    // Get updated colors based on new theme
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    
    // Update all existing charts to reflect new theme
    if (window.appCharts && window.appCharts.length > 0) {
        window.appCharts.forEach(chart => {
            try {
                // Update title color
                if (chart.options.plugins && chart.options.plugins.title) {
                    chart.options.plugins.title.color = textColor;
                }
                
                // Update axis colors
                if (chart.options.scales) {
                    if (chart.options.scales.x) {
                        chart.options.scales.x.ticks.color = textColor;
                        if (chart.options.scales.x.title) {
                            chart.options.scales.x.title.color = textColor;
                        }
                    }
                    
                    if (chart.options.scales.y) {
                        chart.options.scales.y.ticks.color = textColor;
                        if (chart.options.scales.y.title) {
                            chart.options.scales.y.title.color = textColor;
                        }
                    }
                }
                
                // Update legend colors
                if (chart.options.plugins && chart.options.plugins.legend) {
                    chart.options.plugins.legend.labels.color = textColor;
                }
                
                // Update the chart
                chart.update('none');
                
            } catch (error) {
                console.error("Error updating chart theme:", error);
            }
        });
    }
}

// Initialize Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggle.checked = true;
        }
    }
    
    // Add event handler for theme toggle
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
        
        // Update chart colors when theme changes
        setTimeout(updateChartsTheme, 100);
    });
}

// Custom tooltips for interactive elements
function createTooltips() {
    // Get tooltip element
    const tooltip = document.querySelector('.custom-tooltip');
    if (!tooltip) return;
    
    // Elements that should show tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    if (tooltipElements.length === 0) return;
    
    tooltipElements.forEach(element => {
        // Get tooltip content from data attribute
        const tooltipContent = element.getAttribute('data-tooltip');
        
        if (tooltipContent) {
            // Show tooltip on hover
            element.addEventListener('mouseenter', (e) => {
                const titleElement = element.querySelector('.stat-label') || 
                                    {innerText: 'Information'};
                
                tooltip.innerHTML = `
                    <div class="custom-tooltip-title">${titleElement.innerText}</div>
                    <div class="custom-tooltip-content">${tooltipContent}</div>
                `;
                
                tooltip.classList.add('visible');
                
                // Position tooltip
                const rect = element.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
                
                // Reposition if off screen
                if (parseFloat(tooltip.style.top) < 10) {
                    tooltip.style.top = `${rect.bottom + 10}px`;
                }
            });
            
            // Hide tooltip when not hovering
            element.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        }
    });
    
    // Hide tooltip when scrolling
    document.addEventListener('scroll', () => {
        if (tooltip.classList.contains('visible')) {
            tooltip.classList.remove('visible');
        }
    });
}

window.addEventListener('load', function() {
    // Add a small delay to ensure charts render properly
    setTimeout(() => {
        const chartCanvases = document.querySelectorAll('.chart-container canvas');
        if (chartCanvases.length > 0) {
            console.log("Page fully loaded - ensuring all charts are visible");
            
            // Make sure all chasrt containers are active
            document.querySelectorAll('.chart-container').forEach(container => {
                container.classList.add('active');
            });
            
            // Resize charts if needed
            if (window.appCharts && window.appCharts.length > 0) {
                window.appCharts.forEach(chart => {
                    chart.resize();
                });
            }
        }
    }, 500);
});