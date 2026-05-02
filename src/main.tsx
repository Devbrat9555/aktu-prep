// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Toaster } from 'sonner';
import { registerSW } from 'virtual:pwa-register';
import { ClerkProvider } from '@clerk/clerk-react';

// IMPORTANT: Set your Clerk Publishable Key in the .env file as VITE_CLERK_PUBLISHABLE_KEY
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
    console.error("❌ Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.");
}

const clearStaleData = async () => {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
    } catch (e) {
        console.warn('⚠️ Cache Storage clearing error:', e);
    }
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', async () => {
        await clearStaleData();
    });

    registerSW({
        immediate: true,
        onRegistered(registration) {
            if (registration) {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            console.log('installing worker statechange:', newWorker.state);
                        });
                    }
                });
            }
        },
        onRegisterError(err) {
            console.error('🔴 SW registration error:', err);
        },
        onOfflineReady() {
            console.log('✅ App ready to work offline');
        },
    });
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element with id root is not found.');

createRoot(rootEl).render(
    <StrictMode>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
            <Toaster richColors position="top-right" closeButton />
            <App />
        </ClerkProvider>
    </StrictMode>,
);
