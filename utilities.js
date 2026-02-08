// ============================================
// SERVICE WORKER & DATA EXPORT UTILITIES
// ============================================

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Only register if protocol is http or https (to avoid errors on file://)
        if (window.location.protocol.startsWith('http')) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        } else {
            console.log('Service Worker skipped: Not running on HTTP/HTTPS protocol.');
        }
    }
}

// Data Export Feature
function exportGameData() {
    const data = {
        user: AppState.user,
        activityHistory: AppState.activityHistory,
        gameHistory: ProgressAnalytics?.gameHistory || [],
        subjectMastery: ProgressAnalytics?.subjectMastery || {},
        timestamp: new Date().toISOString()
    };

    // Convert to CSV format
    let csv = 'MoneyWise Game Data Export\n\n';

    // User Stats
    csv += 'User Statistics\n';
    csv += `Name,${data.user.name}\n`;
    csv += `Level,${data.user.level}\n`;
    csv += `Net Worth,${data.user.netWorth}\n`;
    csv += `Games Played,${data.user.gamesPlayed}\n`;
    csv += `Credit Health,${data.user.creditHealth}\n`;
    csv += `Emergency Readiness,${data.user.emergencyReadiness}\n\n`;

    // Activity History
    csv += 'Activity History\n';
    csv += 'Date,Game,Score,Total,Points\n';
    data.activityHistory.forEach(activity => {
        const date = new Date(activity.date).toLocaleDateString();
        csv += `${date},${activity.game},${activity.score},${activity.total},${activity.points}\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moneywise-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Data exported successfully!', 'success');
}

// Make functions available globally
window.registerServiceWorker = registerServiceWorker;
window.exportGameData = exportGameData;
