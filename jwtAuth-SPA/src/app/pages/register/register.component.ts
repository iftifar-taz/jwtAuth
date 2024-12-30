import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { Observable } from 'rxjs';
import { RegistrationRoleResponse } from '../../interfaces/registration-role-response';
import { CommonModule } from '@angular/common';
import { AuthResponse } from '../../interfaces/auth-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, MatInputModule, MatIconModule, MatSelectModule, MatSnackBarModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  roleService = inject(RoleService);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);
  hidePassword = true;
  hideConfirmPassword = true;
  registerForm!: FormGroup;
  roles$!: Observable<RegistrationRoleResponse[]>;
  errors!: ValidationError[];

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      roles: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    }
  );

    this.roles$ = this.roleService.getRegistrationRoles();
  }

  register(): void {
    this.authService.register(this.registerForm.value).subscribe({
      next: (response: AuthResponse) => {
        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        });
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.errors = err!.error;
          this.matSnackBar.open('Validation Error', 'Close', {
            duration: 5000,
            horizontalPosition: 'center'
          });
        }
      },
      complete: () => {
        console.log('AAA');
      }
    });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMisatch: true };
    }
    return null;
  }
}
