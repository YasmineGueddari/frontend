import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-subcategory-add',
  templateUrl: './subcategory-add.component.html',
  styleUrl: './subcategory-add.component.css'
})
export class SubcategoryAddComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  categories: any[] = []; // Tableau pour stocker les catégories 

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      categorieId: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    
      this.loadCategories();
    }

    // Fonction pour charger la liste des catégories disponibles
    loadCategories(): void {
      this.sharedService.getAllCategories().subscribe(
        (data) => {
          this.categories = data;
          console.log('categories',this.categories);
        },
        (error) => {
          console.error('Error fetching categories:', error);
        }
      );
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

    this.sharedService.addSubCategorie(subcategoryData).subscribe(
      response => {
        console.log('Subcategory added successfully:', response);
        this.submitted = false;
        this.form.reset();

        // Fermer le formulaire modal après une création réussie
        const modalElement = document.getElementById('new-subcategory-modal');
        if (modalElement) {
          modalElement.style.display = 'none';
        }

        // Recharger la page pour refléter les changements
        window.location.reload();
      },
      error => {
        console.error('Error adding subcategory:', error);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}