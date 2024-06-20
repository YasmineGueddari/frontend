import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-subcategory-update',
  templateUrl: './subcategory-update.component.html',
  styleUrls: ['./subcategory-update.component.css']
})
export class SubcategoryUpdateComponent implements OnInit {
  @Input() subcategoryId: any; // Recevoir l'ID en tant que @Input()

  form: FormGroup;
  submitted = false;
  subcategory: any;
  categories: any[] = []; // Tableau pour stocker les catégories

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      categorieId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Charger les catégories disponibles
    this.loadCategories();

    if (this.subcategoryId) {
      this.getSubcategoryById(this.subcategoryId);
    }
  }

  // Charger la liste des catégories disponibles
  loadCategories(): void {
    this.sharedService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
        console.log('categories',this.categories)
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Récupérer les informations de la sous-catégorie par son ID
  getSubcategoryById(subcategoryId: any): void {
    this.sharedService.getSubCategorieById(subcategoryId).subscribe(
      (data) => {
        this.subcategory = data;
        console.log('subcategory',data)
        this.patchFormValues(this.subcategory);
      },
      (error) => {
        console.error('Error fetching subcategory:', error);
      }
    );
  }

  // Remplir le formulaire avec les valeurs de la sous-catégorie
  patchFormValues(subcategory: any): void {
    this.form.patchValue({
      name: subcategory.name,
      categorieId: subcategory.categorie?.id,
    });
  }

  // Méthode getter pour accéder facilement aux contrôles de formulaire
  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const subcategoryData = {
      name: this.form.value.name,
      categorieId: this.form.value.categorieId // Récupérer la catégorie sélectionnée dans le formulaire
    };

    if (this.subcategoryId) {
      this.sharedService.updateSubCategorie(this.subcategoryId, subcategoryData).subscribe(
        () => {
          console.log('Subcategory updated successfully');
          this.submitted = false;
          this.form.reset();

          // Recharger la page pour refléter les changements
          window.location.reload();
        },
        error => {
          console.error('Error updating subcategory:', error);
        }
      );
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
