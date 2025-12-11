let speedChart = null;

function initChart() {
    const ctx = document.getElementById('speedChart');
    
    if (!ctx) {
        console.error('Canvas element not found');
        return;
    }
    
    const history = StorageManager.getHistory();
    const chartData = prepareChartData(history);
    
    if (speedChart) {
        speedChart.destroy();
    }
    
    speedChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Latency (ms)',
                    data: chartData.latency,
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y-latency'
                },
                {
                    label: 'Download (Mbps)',
                    data: chartData.download,
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y-speed'
                },
                {
                    label: 'Upload (Mbps)',
                    data: chartData.upload,
                    borderColor: '#4BC0C0',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y-speed'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Speed Test History - UIII.ac.id',
                    font: {
                        size: 16
                    },
                    color: getComputedStyle(document.body).getPropertyValue('--text-color')
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-color'),
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    displayColors: true
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Waktu Test',
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-light'),
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color')
                    }
                },
                'y-latency': {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Latency (ms)',
                        color: '#FF6384'
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-light')
                    },
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color')
                    }
                },
                'y-speed': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Speed (Mbps)',
                        color: '#36A2EB'
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-light')
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

function prepareChartData(history) {
    const reversedHistory = [...history].reverse();
    const limitedHistory = reversedHistory.slice(-10);
    
    return {
        labels: limitedHistory.map(test => {
            const time = test.timestamp.split(' ')[1] || test.timestamp;
            return time.substring(0, 5);
        }),
        latency: limitedHistory.map(test => parseFloat(test.latency)),
        download: limitedHistory.map(test => parseFloat(test.download)),
        upload: limitedHistory.map(test => parseFloat(test.upload))
    };
}

function updateChart() {
    initChart();
}

document.addEventListener('DOMContentLoaded', () => {
    initChart();
});

document.getElementById('darkModeToggle')?.addEventListener('click', () => {
    setTimeout(() => {
        updateChart();
    }, 100);
});