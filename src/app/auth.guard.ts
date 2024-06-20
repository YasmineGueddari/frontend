import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.checkIfAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/auth-sign-in']);
    }
    return isAuthenticated;
  }

  checkIfAuthenticated(): boolean {
    // Vérifiez si localStorage est disponible
    if (typeof localStorage === 'undefined') {
      return false;
    }

    // Par exemple, vérifiez un token dans le localStorage
    const token = localStorage.getItem('token');
    return !!token;
  }
}
