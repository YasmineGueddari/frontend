import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() currentUserRole: string = '';

  firstName: string | null | undefined;
  lastName: string | null | undefined;
  image: string | null | undefined;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.firstName = localStorage.getItem('firstName');
      this.lastName = localStorage.getItem('lastName');
      this.image = localStorage.getItem('image');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth-sign-in']);
  }
}
