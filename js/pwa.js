// PWA Handler
class PWAHandler {
    constructor() {
        this.deferredPrompt = true;
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.setupPWAInstall();
        this.setupOnlineOffline();
    }

    setupInstallPrompt() {
        const pwaPrompt = document.getElementById('pwaPrompt');
        const installPWA = document.getElementById('installPWA');
        const dismissPWA = document.getElementById('dismissPWA');
        const closePWA = document.getElementById('closePWA');
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            setTimeout(() => {
                if (pwaPrompt && !localStorage.getItem('pwaPromptDismissed')) {
                    pwaPrompt.classList.add('show');
                }
            }, 10000);
        });
        
        if (installPWA) {
            installPWA.addEventListener('click', () => {
                if (this.deferredPrompt) {
                    this.deferredPrompt.prompt();
                    this.deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User installed PWA');
                        }
                        this.deferredPrompt = null;
                    });
                }
                if (pwaPrompt) {
                    pwaPrompt.classList.remove('show');
                }
            });
        }
        
        if (dismissPWA) {
            dismissPWA.addEventListener('click', () => {
                if (pwaPrompt) {
                    pwaPrompt.classList.remove('show');
                    localStorage.setItem('pwaPromptDismissed', 'true');
                }
            });
        }
        
        if (closePWA) {
            closePWA.addEventListener('click', () => {
                if (pwaPrompt) {
                    pwaPrompt.classList.remove('show');
                    localStorage.setItem('pwaPromptDismissed', 'true');
                }
            });
        }
    }

    setupPWAInstall() {
        const installBtn = document.getElementById('installBtn');
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            if (installBtn) {
                installBtn.style.display = 'flex';
                
                installBtn.addEventListener('click', () => {
                    installBtn.style.display = 'none';
                    if (this.deferredPrompt) {
                        this.deferredPrompt.prompt();
                        this.deferredPrompt.userChoice.then((choiceResult) => {
                            if (choiceResult.outcome === 'accepted') {
                                console.log('User installed PWA');
                            }
                            this.deferredPrompt = null;
                        });
                    }
                });
            }
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            if (installBtn) {
                installBtn.style.display = 'none';
            }
            const pwaPrompt = document.getElementById('pwaPrompt');
            if (pwaPrompt) {
                pwaPrompt.classList.remove('show');
            }
        });
    }

    setupOnlineOffline() {
        const updateStatus = () => {
            const isOnline = navigator.onLine;
            const offlineIndicator = document.getElementById('offlineIndicator');
            
            if (offlineIndicator) {
                if (!isOnline) {
                    offlineIndicator.classList.add('show');
                } else {
                    offlineIndicator.classList.remove('show');
                }
            }
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        
        updateStatus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pwaHandler = new PWAHandler();
});
