import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatSnackBarModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  email!: string;
  showEmailSent = false;
  isSubmitting = false;

  fogetPassword(): void {
    this.isSubmitting = true;
    this.authService.forgetPassword(this.email).subscribe({
      next: (response) => {
        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        });
        this.showEmailSent = response.isSuccess;
      },
      error: (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
