import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserRoleSubject: BehaviorSubject<string>;
  public currentUserRole: Observable<string>;

  constructor() {
    const role = this.getLocalStorageItem('role') || 'User' ;
    console.log('Role from localStorage:', role);
    this.currentUserRoleSubject = new BehaviorSubject<string>(role);
    this.currentUserRole = this.currentUserRoleSubject.asObservable();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }


 
  private getLocalStorageItem(key: string): string | null {
    if (typeof localStorage !== 'undefined' && this.isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined' && this.isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    }
  }


  getUserRole(): Observable<string> {
    return this.currentUserRole;
  }

  isUser(): boolean {
    return this.currentUserRoleSubject.value === 'User';
  }

  isAdmin(): boolean {
    return this.currentUserRoleSubject.value === 'Admin';
  }

  isSuperAdmin(): boolean {
    return this.currentUserRoleSubject.value === 'SuperAdmin';
  }

  setUserRole(role: string): void {
    this.currentUserRoleSubject.next(role);
    this.setLocalStorageItem('role', role);
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    this.currentUserRoleSubject.next('User'); // Définir le rôle par défaut après déconnexion
  }
}
