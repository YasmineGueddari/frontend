import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reclamations',
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.css']
})
export class ReclamationsComponent implements OnInit {

  reclamations: any[] = [];
  filteredReclamations: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;

  selectedReclamation: any = null;
  selectedReclamationId: any = null;
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
      this.loadAllReclamations();
    });
  }

  loadAllReclamations(): void {
    this.sharedService.getAllReclamations().subscribe(
      data => {
        this.reclamations = data;
        console.log('reclamations', this.reclamations);
        
        // Filtrer les réclamations actives
        const activeReclamations = this.reclamations.filter(reclamation => reclamation.isActive);

        if (this.userRole === 'SuperAdmin') {
          this.filteredReclamations = activeReclamations;
        } else if (this.userRole === 'User' && this.connectedUserId) {
          // Convertir l'ID de l'utilisateur en nombre pour une comparaison précise
          const userId = Number(this.connectedUserId);
          this.filteredReclamations = activeReclamations.filter((reclamation: any) => {
            console.log('Structure de la réclamation:', reclamation);
            if (reclamation.user && reclamation.user.id) {
              console.log('Comparaison de l\'ID utilisateur de la réclamation:', reclamation.user.id);
              return reclamation.user.id === userId;
            }
            return false;
          });
        }
        console.log('this.reclamations', this.reclamations);
        console.log('this.filteredReclamations', this.filteredReclamations);
      },
      error => {
        console.error('Error fetching all reclamations:', error);
      }
    );
  }

  selectReclamation(reclamationId: any) {
    this.selectedReclamationId = reclamationId;
    console.log('selectedReclamationId', this.selectedReclamationId);
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substr(0, maxLength) + '...';
    }
    return text;
  }

  // Méthode pour disable une réclamation
  confirmDelete(id: string): void {
    if (confirm('Are you sure you want to disable the claim ?')) {
      this.sharedService.disableReclamation(id).subscribe(
        res => {
          console.log(res);
          this.ngOnInit(); 
        },
        err => {
          console.log(err);
        }
      );
    }
  }

}
