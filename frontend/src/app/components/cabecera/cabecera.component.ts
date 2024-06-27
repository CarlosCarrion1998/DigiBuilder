import { Component, Input } from '@angular/core';
import { User } from '../../entity/user';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [NgIf],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent {
  @Input() isProfileView: boolean = false;

  router: Router;

  user: User | null = null;

  constructor(authService: AuthService, router: Router) {
    this.user = authService.getUser();
    this.router = router;
  }

  onBack() {
    if(this.isProfileView) {
      this.router.navigate(['/mainpage']);
    }else {
      this.router.navigate(['']);
    }
    
  }

  onClick() {
    this.router.navigate(['/profile']);
  }

}
