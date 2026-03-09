import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-homepage',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './homepage.html',
  styles: [`
    :host {
      display: block;
    }
    
    /* Custom animations if needed beyond Tailwind */
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `]
})
export class Homepage {

}
