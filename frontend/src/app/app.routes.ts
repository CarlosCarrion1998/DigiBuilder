import { Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './perfil/perfil.component';

export const routes: Routes = [
    { path: 'mainpage', component: MainpageComponent},
    { path: 'profile', component: PerfilComponent},
    { path: '', component: LoginComponent},
    { path: '**', redirectTo: ''}
];
