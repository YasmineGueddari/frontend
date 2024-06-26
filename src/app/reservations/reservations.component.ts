import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  reservations: any[] = [];
  filteredReservations: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;

  selectedReservation: any = null;
  selectedReservationId: any = null;
  userRole: string = '';
  connectedUserId: string | null = '';

  constructor(
    private sharedService: SharedService,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur connecté depuis le localStorage
    this.connectedUserId = localStorage.getItem('id');
    console.log('connectedUserId', this.connectedUserId);

    // Obtenir le rôle de l'utilisateur connecté
    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
      this.loadReservations();
    });
  }

  loadReservations(): void {
    this.sharedService.getAllReservations().subscribe(
      res => {
        this.reservations = res;
        console.log('Filtrage des réservations pour l\'utilisateur ID:', this.connectedUserId);
        
        // Filtrer les réservations actives
        const activeReservations = this.reservations.filter(reservation => reservation.isActive);

        if (this.userRole === 'SuperAdmin' || this.userRole === 'Admin' ) {
          this.filteredReservations = activeReservations;
        } else if (this.userRole === 'User' && this.connectedUserId) {
          // Convertir l'ID de l'utilisateur en nombre pour une comparaison précise
          const userId = Number(this.connectedUserId);
          this.filteredReservations = activeReservations.filter((reservation: any) => {
            if (reservation.user && reservation.user.id) {
              return reservation.user.id === userId;
            }
            return false;
          });
        }
        console.log('this.reservations', this.reservations);
        console.log('this.filteredReservations', this.filteredReservations);
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

  confirmDelete(id: string): void {
    if (confirm('Are you sure you want to disable the reservation?')) {
      // Appel de la fonction de suppression une fois que l'utilisateur confirme
      this.sharedService.disableReservation(id)
      .subscribe(
        res => {
          console.log(res);
          this.ngOnInit();
        },
        err => {
          console.log(err);
        }
      )
    }
  }
  
}
