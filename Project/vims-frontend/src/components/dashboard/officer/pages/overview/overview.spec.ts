import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficerOverviewComponent } from './overview';
import { OfficerService } from '../../../../../app/core/services/officer-service';
import { of } from 'rxjs';

describe('OfficerOverviewComponent', () => {
    let component: OfficerOverviewComponent;
    let fixture: ComponentFixture<OfficerOverviewComponent>;
    let officerServiceSpy: jasmine.SpyObj<OfficerService>;

    beforeEach(async () => {
        officerServiceSpy = jasmine.createSpyObj('OfficerService', ['getAssignedClaims']);
        officerServiceSpy.getAssignedClaims.and.returnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [OfficerOverviewComponent],
            providers: [
                { provide: OfficerService, useValue: officerServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(OfficerOverviewComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load dashboard data on init', () => {
        fixture.detectChanges();
        expect(officerServiceSpy.getAssignedClaims).toHaveBeenCalled();
        expect(component.stats[0].value).toBe('0');
    });
});
