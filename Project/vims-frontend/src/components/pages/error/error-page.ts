import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ErrorInfo {
    code: number;
    title: string;
    description: string;
    icon: string;
    color: string;
}

@Component({
    selector: 'app-error-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './error-page.html'
})
export class ErrorPageComponent implements OnInit {
    errorCode: number = 500;
    errorMessage: string = '';
    returnUrl: string | null = null;
    errorInfo: ErrorInfo = {
        code: 500,
        title: 'Internal Server Error',
        description: 'An unexpected error occurred on our server.',
        icon: 'error',
        color: 'red'
    };

    private errorMap: Record<number, ErrorInfo> = {
        400: { code: 400, title: 'Bad Request', description: 'The request you sent was invalid or malformed.', icon: 'report', color: 'orange' },
        401: { code: 401, title: 'Unauthorized', description: 'You must be logged in to access this resource.', icon: 'lock', color: 'amber' },
        403: { code: 403, title: 'Forbidden', description: 'You do not have permission to perform this action.', icon: 'block', color: 'orange' },
        404: { code: 404, title: 'Not Found', description: 'The resource you were looking for could not be found.', icon: 'search_off', color: 'blue' },
        409: { code: 409, title: 'Conflict', description: 'A conflict occurred because the resource already exists.', icon: 'merge', color: 'purple' },
        422: { code: 422, title: 'Validation Error', description: 'The data you submitted failed validation.', icon: 'fact_check', color: 'yellow' },
        500: { code: 500, title: 'Internal Server Error', description: 'An unexpected error occurred on our server.', icon: 'error', color: 'red' },
        503: { code: 503, title: 'Service Unavailable', description: 'The server is currently unavailable. Please try again later.', icon: 'cloud_off', color: 'slate' },
    };

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.errorCode = parseInt(params['code']) || 500;
            this.errorMessage = params['message'] || '';
            this.returnUrl = params['returnUrl'] || null;
            this.errorInfo = this.errorMap[this.errorCode] || this.errorMap[500];
        });
    }

    goBack() {
        if (this.returnUrl) {
            this.router.navigate([this.returnUrl]);
        } else {
            window.history.back();
        }
    }

    goHome() {
        this.router.navigate(['/']);
    }

    getBorderColor(): string {
        const map: Record<string, string> = {
            red: 'border-red-500', orange: 'border-orange-500', amber: 'border-amber-500',
            blue: 'border-blue-500', purple: 'border-purple-500', yellow: 'border-yellow-500',
            slate: 'border-slate-500'
        };
        return map[this.errorInfo.color] || 'border-red-500';
    }

    getIconColor(): string {
        const map: Record<string, string> = {
            red: 'text-red-500', orange: 'text-orange-500', amber: 'text-amber-500',
            blue: 'text-blue-500', purple: 'text-purple-500', yellow: 'text-yellow-500',
            slate: 'text-slate-400'
        };
        return map[this.errorInfo.color] || 'text-red-500';
    }

    getCodeColor(): string {
        const map: Record<string, string> = {
            red: 'text-red-500/20', orange: 'text-orange-500/20', amber: 'text-amber-500/20',
            blue: 'text-blue-500/20', purple: 'text-purple-500/20', yellow: 'text-yellow-500/20',
            slate: 'text-slate-400/20'
        };
        return map[this.errorInfo.color] || 'text-red-500/20';
    }

    getBadgeColor(): string {
        const map: Record<string, string> = {
            red: 'bg-red-500/10 text-red-500 border-red-500/20',
            orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
            amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
            yellow: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
            slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        };
        return map[this.errorInfo.color] || 'bg-red-500/10 text-red-500 border-red-500/20';
    }
}
