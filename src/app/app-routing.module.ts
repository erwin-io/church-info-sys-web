import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guard/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { FeaturesComponent } from './pages/features/features.component';


const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'profile', pathMatch: 'full', redirectTo: 'profile/edit-profile' },
    { path: '',
      component: FeaturesComponent,
      canActivate: [AuthGuard],
      children: [
        { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./pages/features/home/home.module').then(m => m.HomeModule) },
        { path: 'reservations', canActivate: [AuthGuard], loadChildren: () => import('./pages/features/reservation/reservation.module').then(m => m.ReservationModule) },
        { path: 'requests', canActivate: [AuthGuard], loadChildren: () => import('./pages/features/request/request.module').then(m => m.RequestModule) },
        { path: 'certificates', canActivate: [AuthGuard], loadChildren: () => import('./pages/features/certificates/certificates.module').then(m => m.CertificatesModule) },
        { path: 'configuration', canActivate: [AuthGuard], loadChildren: () => import('./pages/features/configuration/configuration.module').then(m => m.ConfigurationModule) },
        { path: 'security', canActivate: [AuthGuard], loadChildren: () => import('./pages/features/security/security.module').then(m => m.SecurityModule) },
        { path: 'reminders', canActivate: [AuthGuard], loadChildren: () => import('./pages/features/reminder/reminder.module').then(m => m.ReminderModule) },
      ]
    },
    { path: 'profile',
      component: ProfileComponent,
      canActivate: [AuthGuard],
      children: [
        { path: 'edit-profile', canActivate: [AuthGuard], loadChildren: () => import('./pages/profile/edit-profile-details/edit-profile-details.module').then(m => m.EditProfileDetailsModule) },
        { path: 'edit-profile-picture', canActivate: [AuthGuard], loadChildren: () => import('./pages/profile/edit-profile-picture/edit-profile-picture.module').then(m => m.EditProfilePictureModule) },
        { path: 'password-and-security', canActivate: [AuthGuard], loadChildren: () => import('./pages/profile/password-and-security/password-and-security.module').then(m => m.PasswordAndSecurityModule) },
      ]
    },
    { path: 'auth',
      loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
