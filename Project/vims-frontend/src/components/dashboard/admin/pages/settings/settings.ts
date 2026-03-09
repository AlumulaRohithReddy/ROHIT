import { ChangeDetectorRef,Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, SystemSetting } from '../../../../../app/core/services/admin-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';

@Component({
    selector: 'app-admin-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html'
})
export class AdminSettingsComponent implements OnInit {
    settings: SystemSetting[] = [];
    loading = false;
    private adminService = inject(AdminService);
    private notificationService = inject(NotificationService);
        constructor(private changeDetectorRef: ChangeDetectorRef) { }
    ngOnInit() {
        this.loadSettings();
    }

    loadSettings() {
        this.loading = true;
        this.adminService.getSettings().subscribe({
            next: (data) => {
                this.settings = data;
                this.changeDetectorRef.detectChanges();
                setTimeout(() => this.loading = false);
            },
            error: () => {
                setTimeout(() => {
                    this.loading = false;
                    this.changeDetectorRef.detectChanges();
                });
            }
        });
    }

    saveSettings() {
        this.loading = true;
        this.adminService.updateSettings(this.settings).subscribe({
            next: () => {
                this.notificationService.showSuccess('Settings updated successfully!');

                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
        this.changeDetectorRef.detectChanges();
    }
}
