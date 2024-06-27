import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../entity/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService: AuthService;

  username: string = '';
  password: string = '';
  user?: User;

  router: Router;

  constructor(authService: AuthService, router: Router) { 
    this.authService = authService;
    this.router = router;
  }

  onSubmit() {
    this.authService.login(this.username).subscribe(
      (data: any) => {
        this.user = data;
        if(this.user) {
          if(this.user.password === this.password){
            this.authService.setUser(this.user);
            this.router.navigate(['/mainpage']);
          } else {
            console.log('Incorrect password');
          }
        } else{
          console.log('User not found');
        
        }
        console.log('User data: ', data);
      },
      (error: any) => {
        console.error('Error logging in', error);
      }
    );
  }
}
