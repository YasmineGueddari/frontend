import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUrl: string = '';
  currentUserRole$: Observable<string | null>;

  constructor(private router: Router, private authService: AuthService) {
    this.currentUserRole$ = this.authService.getUserRole();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  isSpecialPage(): boolean {
    const specialPages = [
      '/auth-sign-in',
      '/list-branch',
      '/404',
      '/auth-confirm-mail',
      '/reset-password'
    ];
    return specialPages.some(page => this.currentUrl.startsWith(page)) ||
           this.currentUrl.includes('set-new-password');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth-sign-in']);
  }
}
