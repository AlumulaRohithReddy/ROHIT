import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { vi } from 'vitest';

getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);

// Jasmine compatibility for Vitest
(globalThis as any).jasmine = {
    createSpyObj: (name: string, methods: string[]) => {
        const obj: any = {};
        methods.forEach(m => {
            obj[m] = vi.fn();
        });
        return obj;
    }
};
