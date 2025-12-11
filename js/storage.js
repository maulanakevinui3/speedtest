const StorageManager = {
    STORAGE_KEY: 'speedtest_history',
    MAX_HISTORY: 20,

    saveTest(testResult) {
        try {
            const history = this.getHistory();
            history.unshift(testResult);
            
            if (history.length > this.MAX_HISTORY) {
                history.pop();
            }
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    getHistory() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    },

    clearHistory() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    exportToCSV() {
        const history = this.getHistory();
        if (history.length === 0) {
            return null;
        }

        let csv = 'Waktu,Latency (ms),Download (Mbps),Upload (Mbps)\n';
        
        history.forEach(test => {
            csv += `${test.timestamp},${test.latency},${test.download},${test.upload}\n`;
        });

        return csv;
    },

    exportToJSON() {
        const history = this.getHistory();
        return JSON.stringify(history, null, 2);
    },

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

const DarkModeManager = {
    STORAGE_KEY: 'speedtest_darkmode',

    init() {
        const isDark = this.getDarkMode();
        if (isDark) {
            document.body.classList.add('dark-mode');
        }
    },

    toggle() {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem(this.STORAGE_KEY, isDark);
        return isDark;
    },

    getDarkMode() {
        return localStorage.getItem(this.STORAGE_KEY) === 'true';
    }
};