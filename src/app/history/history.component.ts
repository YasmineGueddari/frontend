import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  reservations: any[] = [];
  reclamations: any[] = [];
  userId: string | null = null;
  userRole: string = '';
  hasReservations: boolean = false;
  hasReclamations: boolean = false;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService // Injecter AuthService pour obtenir le rôle de l'utilisateur
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('id'); 
    console.log('userId', this.userId);

    this.authService.getUserRole().subscribe(
      (role: string) => {
        this.userRole = role;
        console.log('userRole', this.userRole);

        if (this.userId) {
          this.loadAllHistory();
        } else {
          console.error('No user ID found in local storage');
        }
      },
      (error) => {
        console.error('Error fetching user role:', error);
      }
    );
  }

  loadAllHistory(): void {
    this.loadAllReservations();
    this.loadAllReclamations();
  }

  loadAllReservations(): void {
    this.sharedService.getAllReservations().subscribe(
      (data: any[]) => {
        if (this.userRole === 'SuperAdmin' || this.userRole === 'Admin') {
          this.reservations = data;
        } else {
          this.reservations = data.filter((reservation: any) => reservation.user.id === Number(this.userId));
        }
        this.hasReservations = this.reservations.length > 0;
        console.log("reservations confirmed", this.reservations);
      },
      (error) => {
        console.error('Error fetching all reservations:', error);
      }
    );
  }

  loadAllReclamations(): void {
    this.sharedService.getAllReclamations().subscribe(
      (data: any[]) => {
        if (this.userRole === 'SuperAdmin' || this.userRole === 'Admin') {
          this.reclamations = data;
        } else {
          this.reclamations = data.filter((reclamation: any) => reclamation.user.id === Number(this.userId));
        }
        this.hasReclamations = this.reclamations.length > 0;
        console.log("reclamations confirmed", this.reclamations);
      },
      (error) => {
        console.error('Error fetching all reclamations:', error);
      }
    );
  }
}
