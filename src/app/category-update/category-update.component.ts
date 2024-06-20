import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrl: './category-update.component.css'
})
export class CategoryUpdateComponent implements OnInit {
  @Input() categoryId: any; // Recevoir l'ID en tant que @Input()

  form: FormGroup;
  submitted = false;
  categories: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],

    });
  }

  ngOnInit(): void {
 console.log('categoryId' ,this.categoryId);
    if (this.categoryId) {
     
      this.getCategorieById(this.categoryId);
      
    }
  }

  getCategorieById(categoryId: any): void {
    this.sharedService.getCategorieById(categoryId).subscribe(
      (data) => {
        this.categories = data;
        this.patchFormValues(this.categories);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  patchFormValues(categories: any): void {
    this.form.patchValue({
      name: categories.name,
 
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const categoryData = {
      name: this.form.value.name,
      matriculeFiscal: this.form.value.matriculeFiscal,
      address: this.form.value.address,
      email: this.form.value.email,
      phone: this.form.value.phone
    };

    if (this.categoryId) {
      this.sharedService.updateCategorie(this.categoryId, categoryData).subscribe(
        () => {
          console.log('category updated successfully');
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
          console.error('Error updating category:', error);
        }
      );
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
