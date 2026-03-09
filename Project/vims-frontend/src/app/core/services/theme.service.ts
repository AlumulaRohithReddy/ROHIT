import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'vims-theme';
    theme = signal<'light' | 'dark'>(this.getStoredTheme());

    constructor() {
        // Apply theme changes only in non-test environment to avoid issues with signal effects in Karma
        if (!(window as any).isTestEnvironment) {
            effect(() => {
                const currentTheme = this.theme();
                localStorage.setItem(this.THEME_KEY, currentTheme);

                if (currentTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            });
        }
    }

    toggleTheme() {
        this.theme.update(t => t === 'light' ? 'dark' : 'light');
    }

    private getStoredTheme(): 'light' | 'dark' {
        const stored = localStorage.getItem(this.THEME_KEY);
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
        // Default to system preference if no stored value
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}
