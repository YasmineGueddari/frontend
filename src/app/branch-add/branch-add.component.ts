import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch-add',
  templateUrl: './branch-add.component.html',
  styleUrls: ['./branch-add.component.css']
})
export class BranchAddComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private sharedService: SharedService, private router: Router) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      matriculeFiscal: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
    });
  }

  ngOnInit(): void {
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

    this.sharedService.addBranch(branchData).subscribe(
      response => {
        console.log('Branch added successfully:', response);
        this.submitted = false;
        this.form.reset();
        
        
        // Fermer le formulaire modal après une création réussie
            const modalElement = document.getElementById('new-user-modal');
            if (modalElement) {
              modalElement.style.display = 'none';
            }
          
            window.location.reload();
       },
      
      error => {
        console.error('Error adding branch:', error);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
