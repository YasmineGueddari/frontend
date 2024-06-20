import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.css'
})
export class CategoryAddComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private sharedService: SharedService, private router: Router) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],

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

    const departmentData = {
      name: this.form.value.name,
   
    };

    this.sharedService.addCategorie(departmentData).subscribe(
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
        console.error('Error adding department:', error);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
