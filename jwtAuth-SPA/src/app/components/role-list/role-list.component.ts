import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoleResponse } from '../../interfaces/role-response';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {
  @Input({required: true}) roles!: RoleResponse[] | null;
  @Output() deleteRole: EventEmitter<string> = new EventEmitter<string>();

  delete(roleId: string): void {
    this.deleteRole.emit(roleId);
  }
}
