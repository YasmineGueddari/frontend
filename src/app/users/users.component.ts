import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  searchTerm: string = '';
  users: any[] = [];
  filteredUsers: any[] = [];
  currentUserRole: string = '';
  currentUserId: string | null = '';
  currentUserSuccursales: number[] = [];

  currentPageUsers: number = 1;
  itemsPerPage = 8; 

  constructor(private sharedService: SharedService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserRole().subscribe(role => {
      this.currentUserRole = role;
      this.loadUsers();
    });

    // Suppose the user ID and succursales are stored in localStorage
    this.currentUserId = localStorage.getItem('id');
    const succursales = localStorage.getItem('idSuccursales');
    if (succursales) {
      this.currentUserSuccursales = succursales.split(',').map(id => parseInt(id, 10));
    }

    console.log('role', this.currentUserRole);
    console.log('iduser', this.currentUserId);
    console.log('succursales', this.currentUserSuccursales);
  }

  loadUsers(): void {
    this.sharedService.getAllUsers().subscribe(
      (data) => {
        this.users = data as any[];
        this.filteredUsers = this.users.filter(user => this.filterUsers(user));
        console.log(this.filteredUsers);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  filterUsers(user: any): boolean {
    // Vérifier si l'utilisateur appartient à la succursale sélectionnée
    const isInSelectedSuccursale = this.isUserInSelectedSuccursales(user);

    // Vérifier si l'utilisateur est le compte connecté
    const isCurrentUser = user.id === this.currentUserId;

    if (this.currentUserRole === 'SuperAdmin') {
      return user.role !== 'SuperAdmin' && isInSelectedSuccursale;
    } else if (this.currentUserRole === 'Admin') {
      return user.role !== 'SuperAdmin' && isInSelectedSuccursale;
    }
    return isCurrentUser || isInSelectedSuccursale;
  }

  isUserInSelectedSuccursales(user: any): boolean {
    const selectedBranchId = localStorage.getItem('selectedBranchId');
    if (!selectedBranchId) {
      return false;
    }
    if (!user.succursales) {
      return false;
    }
    const selectedBranchIdNum = parseInt(selectedBranchId, 10);
    for (const succursale of user.succursales) {
      if (succursale.id === selectedBranchIdNum) {
        return true;
      }
    }
    return false;
  }

  setDefaultImage(event: any) {
    event.target.src = '../assets/images/user/1.jpg';
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredUsers = this.users.filter(user => this.filterUsers(user));
    } else {
      this.filteredUsers = this.users.filter(user =>
        this.filterUsers(user) &&
        (user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  confirmDelete(id: string): void {
    if (confirm('Are you sure you want to disable the user?')) {
      this.sharedService.disableUser(id).subscribe(
        res => {
          console.log(res);
          this.loadUsers();
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  reactivateUser(id: string): void {
    if (confirm('Are you sure you want to reactivate the user?')) {
      this.sharedService.reactivateUser(id).subscribe(
        res => {
          console.log(res);
          this.loadUsers();
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}
