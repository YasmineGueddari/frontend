import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reclamation-add',
  templateUrl: './reclamation-add.component.html',
  styleUrls: ['./reclamation-add.component.css']
})
export class ReclamationAddComponent implements OnInit {
  @Input() reservationId: any;

  form: FormGroup;
  submitted = false;
  reservation: any;
  successMessage: string = '';
  errorMessage: string = '';
  userId: any;
  bienId: any;

  @ViewChild('modal') modal!: ElementRef;  // Utilisation du mot-clé !

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    console.log('userIdd', this.userId);
    console.log('reservationIdd', this.reservationId);
    if (this.reservationId) {
      this.getReservationById(this.reservationId);
    }
  }

  getReservationById(reservationId: any): void {
    this.sharedService.getReservationById(reservationId).subscribe(
      data => {
        this.reservation = data;
        console.log('reservationn', this.reservation);
        this.bienId = this.reservation.bien.id; // Récupérer bienId à partir des données de réservation
        console.log('bienIdd', this.bienId);
      },
      error => {
        console.error('Error fetching reservation:', error);
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(modal: any): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const reclamationData = {
      ...this.form.value,
      userId: this.userId,
      reservationId: this.reservationId,
      bienId: this.bienId // Inclure bienId dans les données de soumission
    };

    this.sharedService.addReclamation(reclamationData).subscribe(
      response => {
        this.successMessage = 'Reclamation ajoutée avec succès !';
        this.errorMessage = '';
        this.submitted = false;
        this.form.reset();
        
        // Fermer le modal
        this.closeModal(modal);
        
        // Naviguer vers la page des réclamations
        this.router.navigate(['reclamations']);
      },
      error => {
        this.errorMessage = 'Erreur lors de l\'ajout de la réclamation';
        this.successMessage = '';
        console.error('Error adding reclamation:', error);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  closeModal(modal: any): void {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
}
