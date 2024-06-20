import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-branch-update',
  templateUrl: './branch-update.component.html',
  styleUrls: ['./branch-update.component.css']
})
export class BranchUpdateComponent implements OnInit {
  @Input() branchId: any; // Recevoir l'ID en tant que @Input()

  form: FormGroup;
  submitted = false;
  branch: any;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      matriculeFiscal: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
    });
  }

  ngOnInit(): void {
 console.log('branchId' ,this.branchId);
    if (this.branchId) {
     
      this.getBranchById(this.branchId);
      
    }
  }

  getBranchById(branchId: any): void {
    this.sharedService.getBranchById(branchId).subscribe(
      (data) => {
        this.branch = data;
        this.patchFormValues(this.branch);
      },
      (error) => {
        console.error('Error fetching branch:', error);
      }
    );
  }

  patchFormValues(branch: any): void {
    this.form.patchValue({
      name: branch.name,
      matriculeFiscal: branch.matriculeFiscal,
      email: branch.email,
      phone: branch.phone,
      address: branch.address,
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const branchData = {
      name: this.form.value.name,
      matriculeFiscal: this.form.value.matriculeFiscal,
      address: this.form.value.address,
      email: this.form.value.email,
      phone: this.form.value.phone
    };

    if (this.branchId) {
      this.sharedService.updateBranch(this.branchId, branchData).subscribe(
        () => {
          console.log('Branch updated successfully');
          this.form.reset();
          this.submitted = false;

           // Fermer le formulaire modal après une création réussie
           const modalElement = document.getElementById('new-user-modal');
           if (modalElement) {
             modalElement.style.display = 'none';
           }
         
           window.location.reload();

        },
        error => {
          console.error('Error updating branch:', error);
        }
      );
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
