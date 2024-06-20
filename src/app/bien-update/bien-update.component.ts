import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bien-update',
  templateUrl: './bien-update.component.html',
  styleUrls: ['./bien-update.component.css']
})
export class BienUpdateComponent implements OnInit {
  @Input() bienId: any;

  form: FormGroup;
  submitted = false;
  departements: any[] = [];
  categories: any[] = [];
  souscategories: any[] = [];
  filteredSubCategories: any[] = [];
  bien: any;
  image: any;
  selectedImage: string | undefined;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private sharedService: SharedService, private router: Router) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      image: [''],
      departementId: ['', [Validators.required]],
      categorieId: ['', [Validators.required]],
      sousCategorieId: [''],
      requiresConfirmation: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log('bienId', this.bienId);
    if (this.bienId) {
      this.getBienById(this.bienId);
    }

    this.loadDepartments();
    this.loadCategories();
    this.loadSupcategories();
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

  loadSupcategories(): void {
    this.sharedService.getAllSubcategories().subscribe(
      res => {
        this.souscategories = res;
        this.filteredSubCategories = this.souscategories;
      },
      err => {
        console.error(err);
      }
    );
  }

  filterByCategory() {
    const categoryId = parseInt(this.form.value.categorieId, 10);
    this.filteredSubCategories = this.souscategories.filter((souscategory: any) => souscategory.categorie.id === categoryId);
  }

  selectImage(event: any) {
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

  getBienById(bienId: any): void {
    this.sharedService.getBienById(bienId).subscribe(
      (data) => {
        this.bien = data;
        this.patchFormValues(this.bien);
      },
      (error) => {
        console.error('Error fetching bien:', error);
      }
    );
  }

  patchFormValues(bien: any): void {
    this.form.patchValue({
      name: bien.name,
      description: bien.description,
      departementId: bien.departement.id,
      categorieId: bien.categorie.id,
      sousCategorieId: bien.sousCategorie ? bien.sousCategorie.id : '',
      requiresConfirmation: bien.requiresConfirmation.toString()
    });

    this.selectedImage = 'http://localhost:3000/uploads/' + bien.image;
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
    formData.append('departementId', this.form.value.departementId);
    formData.append('categorieId', this.form.value.categorieId);
    formData.append('sousCategorieId', this.form.value.sousCategorieId);
    formData.append('requiresConfirmation', this.form.value.requiresConfirmation);

    if (this.image) {
      formData.append('image', this.image);
    }

    this.sharedService.updateBien(this.bienId, formData).subscribe(
      response => {
        this.successMessage = 'Bien updated successfully!';
        this.errorMessage = '';
        this.submitted = false;
        this.form.reset();
        this.router.navigate(['/benefits']);
        const modalElement = document.getElementById('update-equipment-modal');
        if (modalElement) {
          modalElement.style.display = 'none';
        }
        window.location.reload();
      },
      error => {
        this.errorMessage = 'Error updating Bien';
        this.successMessage = '';
        console.error('Error updating Bien:', error);
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
