import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private url = 'http://127.0.0.1:3000/';

  constructor(private http: HttpClient, private router: Router) { }

  // Méthode privée pour obtenir les en-têtes avec le token
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  // Méthode pour s'inscrire
  signUp(user: any): Observable<any> {
    return this.http.post(this.url + 'user/signup', user);
  }

  // Méthode pour se connecter
  signIn(user: any): Observable<any> {
    return this.http.post(this.url + 'user/signin', user).pipe(
      tap((response: any) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('id', response.id);
          localStorage.setItem('firstName', response.firstName);
          localStorage.setItem('lastName', response.lastName);
          localStorage.setItem('image', response.image);
          localStorage.setItem('idSuccursales', response.idSuccursales);
          localStorage.setItem('role', response.role);
        }
      })
    );
  }

  // Méthode pour se déconnecter
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/auth-sign-in']);
  }

  // Méthode pour envoyer un lien de réinitialisation du mot de passe
  sendPasswordResetLink(email: string): Observable<any> {
    return this.http.post(this.url + 'user/reset-password', { email });
  }

  // Méthode pour définir un nouveau mot de passe
  setNewPassword(token: string, password: string): Observable<any> {
    return this.http.post(this.url + 'user/set-new-password', { token, password });
  }

  // Méthode pour mettre à jour le profil de l'utilisateur
  updateUserProfile(userId: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.url}user/${userId}`, formData, { headers: this.getHeaders() });
  }

  // Méthode pour changer le mot de passe de l'utilisateur
  changePassword(id: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.url}user/${id}/change-password`, { currentPassword, newPassword }, { headers: this.getHeaders() });
  }

  // Méthode pour obtenir tous les utilisateurs
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'user', { headers: this.getHeaders() });
  }

  // Méthode pour obtenir un utilisateur par son ID
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.url}user/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour ajouter un utilisateur
  addUser(user: any): Observable<any> {
    return this.http.post(`${this.url}user`, user, { headers: this.getHeaders() });
  }

  // Méthode pour mettre à jour un utilisateur
  updateUser(userId: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.url}user/${userId}`, formData, { headers: this.getHeaders() });
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.url}user/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour désactiver un utilisateur
  disableUser(id: string): Observable<any> {
    return this.http.delete(`${this.url}user/${id}/disable`, { headers: this.getHeaders() });
  }

  // Méthode pour réactiver un utilisateur
  reactivateUser(id: string): Observable<any> {
    return this.http.put(`${this.url}user/${id}/reactivate`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour obtenir tous les départements
  getAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'departement', { headers: this.getHeaders() });
  }

  // Méthode pour obtenir un département par son ID
  getDepartmentById(id: string): Observable<any> {
    return this.http.get(`${this.url}departement/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour ajouter un département
  addDepartment(departement: any): Observable<any> {
    return this.http.post<any>(this.url + 'departement', departement, { headers: this.getHeaders() });
  }

  // Méthode pour supprimer un département
  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.url}departement/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour désactiver un département
  disableDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.url}departement/${id}/disable`, { headers: this.getHeaders() });
  }

  // Méthode pour réactiver un département
  reactivateDepartment(id: string): Observable<any> {
    return this.http.put(`${this.url}departement/${id}/reactivate`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour mettre à jour un département
  updateDepartment(id: number, departement: any): Observable<any> {
    return this.http.patch(`${this.url}departement/${id}`, departement, { headers: this.getHeaders() });
  }

  // Méthode pour obtenir toutes les succursales
  getAllBranches(): Observable<any> {
    return this.http.get(this.url + 'succursale', { headers: this.getHeaders() });
  }

  // Méthode pour obtenir une succursale par son ID
  getBranchById(id: string): Observable<any> {
    return this.http.get(`${this.url}succursale/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour ajouter une succursale
  addBranch(succursale: any): Observable<any> {
    return this.http.post<any>(this.url + 'succursale', succursale, { headers: this.getHeaders() });
  }

  // Méthode pour supprimer une succursale
  deleteBranch(id: string): Observable<any> {
    return this.http.delete(`${this.url}succursale/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour désactiver une succursale
  disableBranch(id: string): Observable<any> {
    return this.http.delete(`${this.url}succursale/${id}/disable`, { headers: this.getHeaders() });
  }

  // Méthode pour réactiver une succursale
  reactivateBranch(id: string): Observable<any> {
    return this.http.put(`${this.url}succursale/${id}/reactivate`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour mettre à jour une succursale
  updateBranch(branchId: number, succursale: any): Observable<any> {
    return this.http.patch(`${this.url}succursale/${branchId}`, succursale, { headers: this.getHeaders() });
  }

  // Méthode pour obtenir toutes les catégories
  getAllCategories(): Observable<any> {
    return this.http.get(this.url + 'categorie', { headers: this.getHeaders() });
  }

  // Méthode pour obtenir une catégorie par son ID
  getCategorieById(id: string): Observable<any> {
    return this.http.get(`${this.url}categorie/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour ajouter une catégorie
  addCategorie(categorie: any): Observable<any> {
    return this.http.post<any>(this.url + 'categorie', categorie, { headers: this.getHeaders() });
  }

  // Méthode pour supprimer une catégorie
  deleteCategorie(id: string): Observable<any> {
    return this.http.delete(`${this.url}categorie/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour désactiver une catégorie
  disableCategorie(id: string): Observable<any> {
    return this.http.delete(`${this.url}categorie/${id}/disable`, { headers: this.getHeaders() });
  }

  // Méthode pour réactiver une catégorie
  reactivateCategorie(id: string): Observable<any> {
    return this.http.put(`${this.url}categorie/${id}/reactivate`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour mettre à jour une catégorie
  updateCategorie(id: number, categorie: any): Observable<any> {
    return this.http.patch(`${this.url}categorie/${id}`, categorie, { headers: this.getHeaders() });
  }

  // Méthode pour obtenir toutes les sous-catégories
  getAllSubcategories(): Observable<any> {
    return this.http.get(this.url + 'sousCategorie', { headers: this.getHeaders() });
  }

  // Méthode pour obtenir une sous-catégorie par son ID
  getSubCategorieById(id: string): Observable<any> {
    return this.http.get(`${this.url}sousCategorie/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour ajouter une sous-catégorie
  addSubCategorie(sousCategorie: any): Observable<any> {
    return this.http.post<any>(this.url + 'sousCategorie', sousCategorie, { headers: this.getHeaders() });
  }

  // Méthode pour supprimer une sous-catégorie
  deleteSubCategorie(id: string): Observable<any> {
    return this.http.delete(`${this.url}sousCategorie/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour désactiver une sous-catégorie
  disableSubCategorie(id: string): Observable<any> {
    return this.http.delete(`${this.url}sousCategorie/${id}/disable`, { headers: this.getHeaders() });
  }

  // Méthode pour réactiver une sous-catégorie
  reactivateSubCategorie(id: string): Observable<any> {
    return this.http.put(`${this.url}sousCategorie/${id}/reactivate`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour mettre à jour une sous-catégorie
  updateSubCategorie(id: number, sousCategorie: any): Observable<any> {
    return this.http.patch(`${this.url}sousCategorie/${id}`, sousCategorie, { headers: this.getHeaders() });
  }

  // Méthode pour obtenir tous les biens
  getAllBiens(): Observable<any> {
    return this.http.get(this.url + 'biens', { headers: this.getHeaders() });
  }

  // Méthode pour obtenir un bien par son ID
  getBienById(id: string): Observable<any> {
    return this.http.get(`${this.url}biens/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour obtenir tous les biens avec pagination
  getBiens(page: number, itemsPerPage: number): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());
    return this.http.get<any[]>(`${this.url}biens/pagination`, { params, headers: this.getHeaders() });
  }

  // Méthode pour obtenir tous les biens disponibles
  getAvailableEquipment(startDate: string, endDate: string): Observable<any> {
    // Obtenir le token du localStorage
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
     if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post(`${this.url}reservations/available`, 
    {
     "date_debut": startDate,
     "date_fin": endDate
 }, { headers });
 }

  // Méthode pour ajouter un bien
  addBien(bien: any): Observable<any> {
    return this.http.post<any>(this.url + 'biens', bien, { headers: this.getHeaders() });
  }

  // Méthode pour mettre à jour un bien
  updateBien(id: number, bien: any): Observable<any> {
    return this.http.patch(`${this.url}biens/${id}`, bien, { headers: this.getHeaders() });
  }

  // Méthode pour désactiver un bien
  disableBien(id: string): Observable<any> {
    return this.http.delete(`${this.url}biens/${id}/disable`, { headers: this.getHeaders() });
  }

  // Méthode pour réactiver un bien
  reactivateBien(id: string): Observable<any> {
    return this.http.put(`${this.url}biens/${id}/reactivate`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour obtenir toutes les réservations
  getAllReservations(): Observable<any> {
    return this.http.get(this.url + 'reservations', { headers: this.getHeaders() });
  }

  // Méthode pour obtenir une réservation par son ID
  getReservationById(id: string): Observable<any> {
    return this.http.get(`${this.url}reservations/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour ajouter une réservation
  addReservation(reservation: any): Observable<any> {
    return this.http.post<any>(this.url + 'reservations', reservation, { headers: this.getHeaders() });
  }

  // Méthode pour supprimer une réservation
  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`${this.url}reservations/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour désactiver une réservation
  disableReservation(id: string): Observable<any> {
    return this.http.delete(`${this.url}reservations/${id}/disable`, { headers: this.getHeaders() });
  }

  // Méthode pour réactiver une réservation
  reactivateReservation(id: string): Observable<any> {
    return this.http.put(`${this.url}reservations/${id}/reactivate`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour confirmer une réservation
  ConfirmReservation(id: string): Observable<any> {
    return this.http.put(`${this.url}reservations/${id}/confirm`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour annuler une réservation
  CancelReservation(id: string): Observable<any> {
    return this.http.put(`${this.url}reservations/${id}/cancel`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour mettre à jour une réservation
  updateReservation(reservationId: number, reservation: any): Observable<any> {
    return this.http.patch(`${this.url}reservations/${reservationId}`, reservation, { headers: this.getHeaders() });
  }

// Méthode pour mettre à jour l'etat d'une réservation
  updateReservationState(id: number, state: string): Observable<any> {
    return this.http.patch<any>(`${this.url}reservations/${id}/state`, { statut: state } , { headers: this.getHeaders() });
  }

  // Méthode pour obtenir toutes les réclamations
  getAllReclamations(): Observable<any> {
    return this.http.get(this.url + 'reclamation', { headers: this.getHeaders() });
  }

  // Méthode pour obtenir une réclamation par son ID
  getReclamationById(id: string): Observable<any> {
    return this.http.get(`${this.url}reclamation/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour ajouter une réclamation
  addReclamation(reclamation: any): Observable<any> {
    return this.http.post<any>(this.url + 'reclamation', reclamation, { headers: this.getHeaders() });
  }

  // Méthode pour supprimer une réclamation
  deleteReclamation(id: string): Observable<any> {
    return this.http.delete(`${this.url}reclamation/${id}`, { headers: this.getHeaders() });
  }

  // Méthode pour désactiver une réclamation
  disableReclamation(id: string): Observable<any> {
    return this.http.delete(`${this.url}reclamation/${id}/disable`, { headers: this.getHeaders() });
  }

  // Méthode pour réactiver une réclamation
  reactivateReclamation(id: string): Observable<any> {
    return this.http.put(`${this.url}reclamation/${id}/reactivate`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour mettre à jour une réclamation
  updateReclamation(reclamationId: number, reclamation: any): Observable<any> {
    return this.http.patch(`${this.url}reclamation/${reclamationId}`, reclamation, { headers: this.getHeaders() });
  }

  // Méthode pour mettre à jour l'etat d'une réclamation
  updateReclamationState(id: number, state: string): Observable<any> {
    return this.http.patch<any>(`${this.url}reclamation/${id}/state`, { statut: state } , { headers: this.getHeaders() });
  }

  // Méthode pour confirmer une réclamation
  confirmReclamation(id: string): Observable<any> {
    return this.http.put(`${this.url}reclamation/${id}/confirm`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour annuler une réclamation
  cancelReclamation(id: string): Observable<any> {
    return this.http.put(`${this.url}reclamation/${id}/cancel`, {}, { headers: this.getHeaders() });
  }

  // Méthode pour mettre une réclamation en cours de traitement
  setReclamationInProgress(id: string): Observable<any> {
    return this.http.put(`${this.url}reclamation/${id}/inProgress`, {}, { headers: this.getHeaders() });
  }
}
