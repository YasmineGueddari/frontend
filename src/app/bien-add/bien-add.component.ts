import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bien-add',
  templateUrl: './bien-add.component.html',
  styleUrls: ['./bien-add.component.css']
})
export class BienAddComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  departements: any[] = [];
  categories: any[] = [];
  souscategories: any[] = [];
  filteredSubCategories: any[] = [];
  selectedCategory: any;


  image: any;
  selectedImage: string | undefined;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private sharedService: SharedService, private router: Router) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      image: ['', [Validators.required]],
      departementId: ['', [Validators.required]],
      categorieId: ['', [Validators.required]],
      sousCategorieId: [''],
      requiresConfirmation: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCategories();
    this.loadSubCategories();
  }

  loadDepartments(): void {
    this.sharedService.getAllDepartments().subscribe(
      res => {
        this.departements = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  loadCategories(): void {
    this.sharedService.getAllCategories().subscribe(
      res => {
        this.categories = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  loadSubCategories(): void {
    this.sharedService.getAllSubcategories().subscribe(
      res => {
        this.souscategories = res;
        this.filteredSubCategories = this.souscategories;
        console.log('Initial filteredSubCategories:', this.filteredSubCategories);
      },
      err => {
        console.error(err);
      }
    );
  }

  filterByCategory() {
    const categoryId = parseInt(this.form.value.categorieId, 10);
    console.log(categoryId);
    this.selectedCategory = this.categories.find(categorie => categorie.id === categoryId);
    console.log("Selected Category:", this.selectedCategory);
    
    if (this.selectedCategory) {
      this.filteredSubCategories = this.souscategories.filter((souscategory: any) => {
        return souscategory.categorie.id === this.selectedCategory.id;
      });
      console.log(this.filteredSubCategories);
    } else {
      this.filteredSubCategories = this.souscategories;
    }
  }

  selectImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedImage = reader.result as string;
        this.image = file;
      };
    }
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('description', this.form.value.description);
    formData.append('image', this.image);
    formData.append('departementId', this.form.value.departementId);
    formData.append('categorieId', this.form.value.categorieId);
    formData.append('sousCategorieId', this.form.value.sousCategorieId);
    formData.append('requiresConfirmation', this.form.value.requiresConfirmation);

    this.sharedService.addBien(formData).subscribe(
      response => {
        this.successMessage = 'Bien created successfully!';
        this.errorMessage = '';
        this.submitted = false;
        this.form.reset();
        this.router.navigate(['/benefits']);
        const modalElement = document.getElementById('new-equipment-modal');
        if (modalElement) {
          modalElement.style.display = 'none';
        }
        window.location.reload();
      },
      error => {
        this.errorMessage = 'Error adding Bien';
        this.successMessage = '';
        console.error('Error adding Bien:', error);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
