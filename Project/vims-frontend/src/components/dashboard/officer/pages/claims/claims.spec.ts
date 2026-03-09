import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficerClaimsComponent } from './claims';
import { OfficerService } from '../../../../../app/core/services/officer-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('OfficerClaimsComponent', () => {
    let component: OfficerClaimsComponent;
    let fixture: ComponentFixture<OfficerClaimsComponent>;
    let officerServiceSpy: jasmine.SpyObj<OfficerService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

    const mockClaims = [
        { ClaimId: 1, ClaimNumber: 'CLM001', ClaimedAmount: 1000, Status: 'Assigned' } as any
    ];

    beforeEach(async () => {
        officerServiceSpy = jasmine.createSpyObj('OfficerService', ['getAssignedClaims', 'getClaimDocuments', 'reviewClaim']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess']);

        officerServiceSpy.getAssignedClaims.and.returnValue(of(mockClaims));

        await TestBed.configureTestingModule({
            imports: [OfficerClaimsComponent, FormsModule],
            providers: [
                { provide: OfficerService, useValue: officerServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(OfficerClaimsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load claims on init', () => {
        fixture.detectChanges();
        expect(officerServiceSpy.getAssignedClaims).toHaveBeenCalled();
        expect(component.allClaims.length).toBe(1);
    });

    it('should open review modal and load documents', () => {
        officerServiceSpy.getClaimDocuments.and.returnValue(of(['doc1.jpg']));
        fixture.detectChanges();

        component.openReview(mockClaims[0]);

        expect(component.showReviewModal).toBeTrue();
        expect(officerServiceSpy.getClaimDocuments).toHaveBeenCalledWith(1);
        expect(component.documents).toEqual(['doc1.jpg']);
    });

    it('should submit review successfully', () => {
        officerServiceSpy.reviewClaim.and.returnValue(of({}));
        fixture.detectChanges();
        component.selectedClaim = mockClaims[0];

        component.submitReview();

        expect(officerServiceSpy.reviewClaim).toHaveBeenCalled();
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalled();
        expect(component.showReviewModal).toBeFalse();
    });
});
