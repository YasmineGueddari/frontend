import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {

  reservations: any[] = [];
  reclamations: any[] = [];
  filteredReservations: any[] = [];
  filteredReclamations: any[] = [];

  currentPageReservations: number = 1;
  currentPageReclamations: number = 1;
  itemsPerPage = 2;

  selectedReservation: any = null;
  selectedReservationId: any = null;
  selectedReclamationId: any = null;
  userRole: string = '';
  idSuccursale: string | null = '';

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur connecté depuis le localStorage
    this.idSuccursale = localStorage.getItem('idSuccursales');
    console.log('idSuccursale', this.idSuccursale);

    // Obtenir le rôle de l'utilisateur connecté
    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
      this.loadReservations();
      this.loadReclamations();
    });
  }

  loadReservations(): void {
    this.sharedService.getAllReservations().subscribe(
      res => {
        this.reservations = res.filter((reservation: any) => reservation.isActive);
        if (this.userRole === 'SuperAdmin' || this.userRole === 'Admin') {
          this.filteredReservations = this.reservations;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  loadReclamations(): void {
    this.sharedService.getAllReclamations().subscribe(
      res => {
        this.reclamations = res.filter((reclamation: any) => reclamation.isActive);
        if (this.userRole === 'SuperAdmin' || this.userRole === 'Admin') {
          this.filteredReclamations = this.reclamations;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  selectReservation(reservationId: any) {
    this.selectedReservationId = reservationId;
    console.log('selectedReservationId', this.selectedReservationId);
  }

  selectReclamation(reclamationId: any) {
    this.selectedReclamationId = reclamationId;
    console.log('selectedReclamationId', this.selectedReclamationId);
  }
}
