import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrationRoleResponse } from '../interfaces/registration-role-response';
import { RoleCreateRequest } from '../interfaces/role-create-request';
import { RoleResponse } from '../interfaces/role-response';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRegistrationRoles(): Observable<RegistrationRoleResponse[]> {
    return this.http.get<RegistrationRoleResponse[]>(`${this.apiUrl}/roles/registration`);
  }

  getRoles(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(`${this.apiUrl}/roles`);
  }

  createRole(role: RoleCreateRequest): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/roles`, role);
  }

  deleteRole(roleId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/roles/${roleId}`);
  }

  assingRole(userId: string, roleId: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/assign`, {userId, roleId});
  }
}
