import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-reservation-update',
  templateUrl: './reservation-update.component.html',
  styleUrls: ['./reservation-update.component.css']
})
export class ReservationUpdateComponent implements OnInit {
  @Input() reservationId: any;

  ReservationStatus: string[] = ['confirmed', 'pending', 'cancelled'];
  form: FormGroup;
  submitted = false;
  reservation: any;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    
  ) {
    this.form = this.formBuilder.group({
      statut: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.reservationId) {
      this.getReservationById(this.reservationId);
    }
  }

  getReservationById(reservationId: any): void {
    this.sharedService.getReservationById(reservationId).subscribe(
      data => {
        this.reservation = data;
        this.patchFormValues(this.reservation);
      },
      error => {
        console.error('Error fetching reservation:', error);
      }
    );
  }

  patchFormValues(reservation: any): void {
    this.form.patchValue({
      statut: reservation.statut
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.sharedService.updateReservationState(this.reservationId, this.form.value.statut).subscribe(
      response => {
        this.successMessage = 'Reservation updated successfully!';
        this.errorMessage = '';
        this.submitted = false;
        this.form.reset();
        
        window.location.reload();
      },
      error => {
        this.errorMessage = 'Error updating reservation';
        this.successMessage = '';
        console.error('Error updating reservation:', error);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  
}
