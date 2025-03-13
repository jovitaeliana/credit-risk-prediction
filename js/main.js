// Credit Risk Prediction - Simplified JavaScript

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded - initializing page features");
    
    // Create a registry for our charts
    window.appCharts = [];
    
    // Initialize all page features
    initializeThemeToggle();
    initializeNavigation();
    initializeCharts();
    initializeObservers();
    createTooltips();
});

// Initialize all charts in the page
function initializeCharts() {
    console.log("Initializing charts");
    
    // Define chart colors based on theme
    const mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim() || "#76B3B1";
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim() || "#799AC0";
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || "#E67E59";
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || "#586c7d";
    
    // Clear any existing charts
    if (window.appCharts && window.appCharts.length > 0) {
        window.appCharts.forEach(chart => chart.destroy());
        window.appCharts = [];
    }

    try {
        // 1. Loan Status Distribution Chart
        createChart('loanStatusChart', 'pie', {
            labels: ['Current', 'Fully Paid', 'Charged Off', 'Late (31-120 days)', 'Other'],
            data: [48.09, 39.62, 9.11, 1.48, 1.70],
            title: 'Loan Status Distribution',
            colors: [mainColor, secondaryColor, accentColor, '#9575cd', '#b0bec5'],
            textColor: textColor,
            formatTooltip: (context) => `${context.label}: ${context.parsed}%`
        });

        // 2. Class Distribution Chart
        createChart('classDistributionChart', 'doughnut', {
            labels: ['Good Loans (0)', 'Bad Loans (1)'],
            data: [81.01, 18.99],
            title: 'Target Class Distribution',
            colors: [mainColor, accentColor],
            textColor: textColor,
            formatTooltip: (context) => `${context.label}: ${context.parsed}%`
        });

        // 3. Feature Importance Chart
        createChart('featureImportanceChart', 'bar', {
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
            data: [0.189, 0.153, 0.142, 0.134, 0.094, 0.087, 0.076, 0.058, 0.043, 0.024],
            title: 'Feature Importance (XGBoost)',
            colors: Array(4).fill(mainColor).concat(
                   Array(3).fill(secondaryColor),
                   Array(3).fill(accentColor)),
            textColor: textColor,
            formatTooltip: (context) => `Importance: ${(context.raw * 100).toFixed(1)}%`,
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        title: { display: true, text: 'Importance Score' },
                        ticks: { callback: value => (value * 100).toFixed(0) + '%' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        // 4. Model Comparison Chart
        createRadarChart('modelComparisonChart', {
            labels: ['Accuracy', 'ROC-AUC', 'Precision', 'Recall', 'F1 Score', 'Speed'],
            datasets: [
                {
                    label: 'XGBoost',
                    data: [0.959, 0.988, 0.926, 0.852, 0.888, 0.95],
                    color: mainColor
                },
                {
                    label: 'Random Forest',
                    data: [0.944, 0.982, 0.894, 0.803, 0.846, 0.30],
                    color: secondaryColor
                },
                {
                    label: 'Logistic Regression',
                    data: [0.913, 0.975, 0.718, 0.896, 0.797, 0.90],
                    color: accentColor
                }
            ],
            title: 'Model Performance Comparison',
            textColor: textColor
        });

        // 5. ROC Curve Chart
        createROCChart('rocCurveChart', {
            textColor: textColor,
            mainColor: mainColor,
            secondaryColor: secondaryColor,
            accentColor: accentColor,
            title: 'ROC Curve Comparison'
        });
        
    } catch (error) {
        console.error("Error creating charts:", error);
    }
    
    console.log("Charts initialization complete, created", window.appCharts.length, "charts");
}

// Helper function to create simple charts
function createChart(elementId, type, config) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.log(`${elementId} element not found`);
        return;
    }
    
    console.log(`Creating ${type} chart: ${elementId}`);
    const ctx = element.getContext('2d');
    
    const chartConfig = {
        type: type,
        data: {
            labels: config.labels,
            datasets: [{
                data: config.data,
                backgroundColor: config.colors || config.color,
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
                    labels: { color: config.textColor }
                },
                title: {
                    display: true,
                    text: config.title,
                    color: config.textColor,
                    font: { size: 16, weight: 'bold' }
                }
            },
            ...(config.options || {})
        }
    };
    
    // Add tooltip formatting if provided
    if (config.formatTooltip) {
        if (!chartConfig.options.plugins) chartConfig.options.plugins = {};
        chartConfig.options.plugins.tooltip = {
            callbacks: {
                label: function(context) {
                    return config.formatTooltip(context);
                }
            }
        };
    }
    
    // Create and register the chart
    const chart = new Chart(ctx, chartConfig);
    window.appCharts.push(chart);
    
    return chart;
}

// Helper function to create radar charts
function createRadarChart(elementId, config) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.log(`${elementId} element not found`);
        return;
    }
    
    console.log(`Creating radar chart: ${elementId}`);
    const ctx = element.getContext('2d');
    
    const datasets = config.datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: `${dataset.color}40`,
        borderColor: dataset.color,
        borderWidth: 3,
        pointBackgroundColor: dataset.color,
        pointRadius: 4
    }));
    
    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: config.labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: { line: { tension: 0.3 } },
            scales: {
                r: {
                    min: 0.3,
                    max: 1,
                    ticks: {
                        color: config.textColor,
                        backdropColor: 'transparent',
                        showLabelBackdrop: false
                    },
                    pointLabels: {
                        color: config.textColor,
                        font: { size: 14, weight: 'bold' }
                    },
                    grid: { color: `${config.textColor}40` },
                    angleLines: { color: `${config.textColor}40` }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: config.textColor, font: { size: 13 } }
                },
                title: {
                    display: true,
                    text: config.title,
                    color: config.textColor,
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
    
    window.appCharts.push(chart);
    return chart;
}

// Helper function to create ROC curve charts
function createROCChart(elementId, config) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.log(`${elementId} element not found`);
        return;
    }
    
    console.log(`Creating ROC chart: ${elementId}`);
    const ctx = element.getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            datasets: [
                {
                    label: 'XGBoost (AUC: 0.988)',
                    data: [0, 0.65, 0.78, 0.86, 0.91, 0.94, 0.96, 0.97, 0.98, 0.99, 1],
                    borderColor: config.mainColor,
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Random Forest (AUC: 0.982)',
                    data: [0, 0.6, 0.73, 0.82, 0.88, 0.92, 0.94, 0.96, 0.97, 0.99, 1],
                    borderColor: config.secondaryColor,
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Logistic Regression (AUC: 0.975)',
                    data: [0, 0.55, 0.67, 0.77, 0.84, 0.88, 0.91, 0.93, 0.96, 0.98, 1],
                    borderColor: config.accentColor,
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Random Baseline',
                    data: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                    borderColor: '#cccccc',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: config.textColor }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                title: {
                    display: true,
                    text: config.title,
                    color: config.textColor,
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'False Positive Rate',
                        color: config.textColor
                    },
                    ticks: { color: config.textColor }
                },
                y: {
                    title: {
                        display: true,
                        text: 'True Positive Rate',
                        color: config.textColor
                    },
                    ticks: { color: config.textColor }
                }
            }
        }
    });
    
    window.appCharts.push(chart);
    return chart;
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
                    Object.keys(chart.options.scales).forEach(scaleKey => {
                        const scale = chart.options.scales[scaleKey];
                        
                        if (scale.ticks) scale.ticks.color = textColor;
                        if (scale.title) scale.title.color = textColor;
                        if (scale.pointLabels) scale.pointLabels.color = textColor;
                        if (scale.grid) scale.grid.color = `${textColor}40`;
                        if (scale.angleLines) scale.angleLines.color = `${textColor}40`;
                    });
                }
                
                // Update legend colors
                if (chart.options.plugins && chart.options.plugins.legend) {
                    chart.options.plugins.legend.labels.color = textColor;
                }
                
                // Update the chart
                chart.update('none'); // Use 'none' to prevent animation during theme change
                
            } catch (error) {
                console.error("Error updating chart theme:", error);
            }
        });
    }
}

// Initialize Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
        console.warn("Theme toggle element not found");
        return;
    }
    
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or respect OS theme setting
    const savedTheme = localStorage.getItem('theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply saved theme
    htmlElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update charts to reflect theme change
        setTimeout(updateChartsTheme, 100);
    });
}

// Initialize navigation and scrolling functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Add smooth scrolling to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from the href attribute
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to the section
                window.scrollTo({
                    top: targetSection.offsetTop - 70, // Adjust for fixed header
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Add scroll spy to highlight active nav link
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize observers for animations
function initializeObservers() {
    // Add scroll detection for chart animations
    const chartContainers = document.querySelectorAll('.chart-container');
    
    if (chartContainers.length > 0) {
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    chartObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        chartContainers.forEach(container => {
            chartObserver.observe(container);
        });
    }
    
    // Activate any charts that might have been missed
    setTimeout(() => {
        document.querySelectorAll('.chart-container:not(.active)').forEach(container => {
            container.classList.add('active');
        });
    }, 1000);
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
                const titleElement = element.querySelector('.stat-label, h3, h4') || 
                                   {innerText: element.tagName === 'A' ? 'Link Information' : 'Information'};
                
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
                
                // Handle horizontal overflow
                const rightOverflow = window.innerWidth - (parseFloat(tooltip.style.left) + tooltip.offsetWidth + 10);
                if (rightOverflow < 0) {
                    tooltip.style.left = `${parseFloat(tooltip.style.left) + rightOverflow}px`;
                } else if (parseFloat(tooltip.style.left) < 10) {
                    tooltip.style.left = '10px';
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

// Once the page has fully loaded, activate any charts that might not be visible
window.addEventListener('load', function() {
    // Ensure all charts are visible
    setTimeout(() => {
        document.querySelectorAll('.chart-container').forEach(container => {
            container.classList.add('active');
        });
        
        // Resize charts if needed
        if (window.appCharts && window.appCharts.length > 0) {
            window.appCharts.forEach(chart => chart.resize());
        }
    }, 500);
});