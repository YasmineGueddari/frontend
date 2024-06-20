import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reclamation-update',
  templateUrl: './reclamation-update.component.html',
  styleUrls: ['./reclamation-update.component.css']
})
export class ReclamationUpdateComponent implements OnInit {
  @Input() reclamationId: any;

  ReclamationStatus: string[] = ['confirmed', 'pending', 'cancelled'];
  form: FormGroup;
  submitted = false;
  reclamation: any;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
  ) {
    // Initialize form group with empty value for statut
    this.form = this.formBuilder.group({
      statut: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.reclamationId) {
      this.getReclamationById(this.reclamationId);
    }
  }

  getReclamationById(reclamationId: any): void {
    this.sharedService.getReclamationById(reclamationId).subscribe(
      data => {
        this.reclamation = data;
        this.patchFormValues(this.reclamation);
      },
      error => {
        console.error('Error fetching reclamation:', error);
      }
    );
  }

  patchFormValues(reclamation: any): void {
    this.form.patchValue({
      statut: reclamation.statut || ''
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

    this.sharedService.updateReclamationState(this.reclamationId, this.form.value.statut).subscribe(
      response => {
        this.successMessage = 'Reclamation updated successfully!';
        this.errorMessage = '';
        this.submitted = false;
        this.form.reset();
        this.router.navigate(['/reclamations']);
        window.location.reload();
      },
      error => {
        this.errorMessage = 'Error updating reclamation';
        this.successMessage = '';
        console.error('Error updating reclamation:', error);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
