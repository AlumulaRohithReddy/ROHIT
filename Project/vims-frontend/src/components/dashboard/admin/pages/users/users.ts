import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, User as UserInterface } from '../../../../../app/core/services/admin-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './users.html'
})
export class UserManagementComponent implements OnInit {
    newUser = { FullName: '', Email: '', Password: '', Role: 'InsuranceAgent' };
    allUsers: UserInterface[] = [];
    filteredUsers: UserInterface[] = [];
    showAddUserModal = false;

    // Stats
    stats = {
        total: 0,
        customers: 0,
        agents: 0,
        officers: 0,
       
    };

    // Filters
    searchTerm: string = '';
    selectedRole: string = '';

    private notificationService = inject(NotificationService);

    constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.adminService.getUsers().subscribe(users => {
            this.allUsers = users;
            this.calculateStats();
            this.applyFilters();
            this.cdr.detectChanges();
        });
    }

    calculateStats() {
        this.stats.total = this.allUsers.length;
        this.stats.customers = this.allUsers.filter(u => u.Role === 'Customer').length;
        this.stats.agents = this.allUsers.filter(u => u.Role === 'Agent' || u.Role === 'InsuranceAgent').length;
        this.stats.officers = this.allUsers.filter(u => u.Role === 'ClaimsOfficer' || u.Role === 'Officer').length;
        this.allUsers=this.allUsers.filter(u => u.Role !== 'Admin');
    }

    onAddUser() {
        this.newUser = { FullName: '', Email: '', Password: '', Role: 'InsuranceAgent' };
        this.showAddUserModal = true;
    }

    applyFilters() {
        this.filteredUsers = this.allUsers.filter(user => {
            const matchesSearch = !this.searchTerm ||
                user.FullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                user.Email.toLowerCase().includes(this.searchTerm.toLowerCase());

            const matchesRole = !this.selectedRole || user.Role === this.selectedRole;

            return matchesSearch && matchesRole;
        });
    }

    onCreateUser() {
        this.adminService.registerUser(this.newUser).subscribe({
            next: () => {
                this.notificationService.showSuccess('User created successfully!');
                this.loadUsers();
                this.newUser = { FullName: '', Email: '', Password: '', Role: 'InsuranceAgent' };
                this.showAddUserModal = false;
            },
            error: (err) => {
                // Handled by global error interceptor
            }
        });
    }

    onResetPassword(userId: number) {
        if (confirm('Are you sure you want to reset this user\'s password to "Shield@123"?')) {
            this.adminService.adminResetPassword(userId, 'Shield@123').subscribe({
                next: () => this.notificationService.showSuccess('Password has been reset to "Shield@123"'),
                error: (err) => {
                    // Handled by global error interceptor
                }
            });
        }
    }
}
