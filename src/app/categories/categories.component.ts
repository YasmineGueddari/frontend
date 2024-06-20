import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  @ViewChild('addCategoryModal') addCategoryModal: any;
  @ViewChild('editCategoryModal') editCategoryModal: any;
  @ViewChild('addSubcategoryModal') addSubcategoryModal: any;

  categories: any[] = [];
  subcategories: any[] = [];
  selectedCategoryId: any;
  selectedSubcategoryId: any;
  categorySubcategoriesMap: { [key: string]: any[] } = {};

  searchTerm: string = '';
  filteredCategories: any[] = [];
  filteredSubCategories: any[] = []; // Ajouté

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubcategories();
  }

  loadCategories(): void {
    this.sharedService.getAllCategories().subscribe(
      data => {
        this.categories = data;
        this.updateCategorySubcategoriesMap();
        this.filteredCategories = this.categories;
      },
      error => console.error('Error fetching categories:', error)
    );
  }

  loadSubcategories(): void {
    this.sharedService.getAllSubcategories().subscribe(
      data => {
        this.subcategories = data;
        console.log('subcategories', this.subcategories);
        this.updateCategorySubcategoriesMap();
      },
      error => console.error('Error fetching subcategories:', error)
    );
  }

  updateCategorySubcategoriesMap(): void {
    this.categorySubcategoriesMap = {};
    this.categories.forEach(category => {
      this.categorySubcategoriesMap[category.id] = this.subcategories.filter(subcategory => subcategory.categorie.id === category.id);
    });
    console.log(this.categorySubcategoriesMap);
  }

  selectCategory(categoryId: any): void {
    this.selectedCategoryId = categoryId;
  }

  selectSubcategory(subcategoryId: any): void {
    this.selectedSubcategoryId = subcategoryId;
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredCategories = this.categories;
      this.filteredSubCategories = this.subcategories; // Réinitialiser les sous-catégories filtrées
 
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      this.filteredSubCategories = this.subcategories.filter(subcategory =>
        subcategory.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  confirmCategory(id: any): void {
    if (confirm('Are you sure you want to disable the Category?')) {
      this.sharedService.disableCategorie(id)
        .subscribe(
          res => {
            console.log('Category deleted successfully');
            this.loadCategories();
            this.loadSubcategories();
          },
          err => {
            console.log('Error deleting category:', err);
          }
        );
    }
  }

  reactivateCategory(id: any) {
    if (confirm('Are you sure you want to reactivate the Category?')) {
      this.sharedService.reactivateCategorie(id)
        .subscribe(
          res => {
            console.log(res);
            this.ngOnInit();
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  confirmSubcategory(id: any): void {
    if (confirm('Are you sure you want to disable the Subcategory?')) {
      this.sharedService.disableSubCategorie(id)
        .subscribe(
          res => {
            console.log('Subcategory deleted successfully');
            this.loadCategories();
            this.loadSubcategories();
          },
          err => {
            console.log('Error deleting Subcategory:', err);
          }
        );
    }
  }

  reactivateSubcategory(id: any) {
    if (confirm('Are you sure you want to reactivate the Subcategory?')) {
      this.sharedService.reactivateSubCategorie(id)
        .subscribe(
          res => {
            console.log(res);
            this.ngOnInit();
          },
          err => {
            console.log(err);
          }
        );
    }
  }

}
