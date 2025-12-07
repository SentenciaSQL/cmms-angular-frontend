import {Component, inject, OnInit} from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import {User} from '../../../../core/models/user.model';
import {AuthService} from '../../../../core/services/auth.service';
import {TranslatePipe} from '../../../pipes/translate-pipe';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent, DropdownItemTwoComponent, TranslatePipe]
})
export class UserDropdownComponent implements OnInit{
  private readonly authService = inject(AuthService);

  isOpen = false;
  user? = this.authService.getCurrentUser();
  username = '';
  fullName = '';
  email = '';

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  ngOnInit(): void {
    console.log("data",this.user);
    this.username = this.user?.username!;
    this.fullName = this.user?.firstName + ' ' + this.user?.lastName;
    this.email = this.user?.email!;
  }

  hasRole(roles: string[]): boolean {
    return roles.some(role => this.authService.hasRole(role));
  }

  logout() {
    this.authService.logout();
  }
}
