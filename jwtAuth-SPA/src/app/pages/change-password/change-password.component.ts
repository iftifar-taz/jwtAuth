import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangePasswordRequest } from '../../interfaces/change-password-request';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, MatSnackBarModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  currentPassword!: string;
  newPassword!: string;

  changePasswordHandle(): void {
    var dto: ChangePasswordRequest = {
      email: this.authService.getUserDetail()?.email,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
    this.authService.changePassword(dto).subscribe({
      next: (response) => {
        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        });
      },
      error: (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        });
      }
    });
  }
}
