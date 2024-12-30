import { Component, inject } from '@angular/core';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../services/role.service';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, MatSelectModule, RoleFormComponent, RoleListComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  authService = inject(AuthService);
  roleService = inject(RoleService);
  matSnackBar = inject(MatSnackBar);
  users$ = this.authService.getAll();
  roles$ = this.roleService.getRoles();
  role: RoleCreateRequest = {} as RoleCreateRequest;
  errorMessage: string = '';
  selectedUserId: string = '';
  selectedRoleId: string = '';

  createRole(role: RoleCreateRequest): void {
    this.roleService.createRole(role).subscribe({
      next: (response: {message: string}) => {
        this.matSnackBar.open('Role created successfully.', 'Ok', {
          duration: 3000,
        });
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.errorMessage = err!.error;
        }
      },
    });
  }

  deleteRole(roleId: string): void {
    this.roleService.deleteRole(roleId).subscribe({
      next: (response: {message: string}) => {
        this.matSnackBar.open('Role deleted successfully.', 'Ok', {
          duration: 3000,
        });
      },
      error: (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Close', {
          duration: 3000,
        });
      },
    });
  }

  assignRole(): void {
    this.roleService.assingRole(this.selectedUserId, this.selectedRoleId).subscribe({
      next: (response: {message: string}) => {
        this.matSnackBar.open('Role assigned successfully.', 'Ok', {
          duration: 3000,
        });
      },
      error: (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
