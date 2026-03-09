import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PremiumBreakdown } from '../../../../../../app/core/services/customer-service';

@Component({
  selector: 'app-premium-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './premium-visualizer.html',
  styles: [`
    .number-roll {
        font-variant-numeric: tabular-nums;
    }
  `]
})
export class PremiumVisualizerComponent {
  private _breakdown: any = null;
  @Input() set breakdown(val: any) {
    if (!val) {
      this._breakdown = null;
      return;
    }
    // Normalize casing to PascalCase for the template
    this._breakdown = {
      BasePremium: val.BasePremium ?? val.basePremium ?? 0,
      RiskAdjustment: val.RiskAdjustment ?? val.riskAdjustment ?? 0,
      AgeAdjustment: val.AgeAdjustment ?? val.ageAdjustment ?? 0,
      NoClaimBonusDiscount: val.NoClaimBonusDiscount ?? val.noClaimBonusDiscount ?? 0,
      TotalPremium: val.TotalPremium ?? val.totalPremium ?? 0,
      FactorsApplied: val.FactorsApplied ?? val.factorsApplied ?? []
    };
  }
  get breakdown(): any {
    return this._breakdown;
  }

  @Input() isCalculating: boolean = false;

  getAbs(val: number): number {
    return Math.abs(val);
  }
}
