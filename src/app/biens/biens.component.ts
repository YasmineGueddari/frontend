import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-biens',
  templateUrl: './biens.component.html',
  styleUrls: ['./biens.component.css']
})
export class BiensComponent implements OnInit {

  @Input() bien: any;

  currentUserRole: string = '';

  biens: any[] = []; // Liste des biens
  selectedBienId: any = null; // ID du bien sélectionné
  page: number = 1; // Page actuelle

  searchTerm: string = '';
  departements: any[] = [];
  categories: any[] = [];
  souscategories: any[] = [];
  
  selectedDepartement: any;
  selectedCategory: any;
  selectedSouscategory: any;
  filteredBiens: any[] = [];
  filteredSouscategories: any[] = [];

  currentPage: number = 1;
  itemsPerPage = 6;
  constructor(public _shared: SharedService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserRole().subscribe(role => {
      this.currentUserRole = role;
    });

    // Chargez les biens depuis votre service partagé
    this._shared.getAllBiens().subscribe(
      res => {
        console.log(res);
        this.biens = res;
        this.filteredBiens = this.biens; // Initialisez les biens filtrés avec tous les biens au départ
  
      },
      err => {
        console.log(err);
      }

      
    );

   
    // Chargez les départements depuis votre service partagé
    this._shared.getAllDepartments().subscribe(
      res => {
        console.log(res);
        this.departements = res;
      },
      err => {
        console.log(err);
      }
    );

    // Chargez les catégories depuis votre service partagé
    this._shared.getAllCategories().subscribe(
      res => {
        console.log(res);
        this.categories = res;
      },
      err => {
        console.log(err);
      }
    );

    // Chargez les sous-catégories depuis votre service partagé
    this._shared.getAllSubcategories().subscribe(
      res => {
        console.log(res);
        this.souscategories = res;
        this.filteredSouscategories = this.souscategories; // Initialisez les sous-catégories filtrées avec toutes les sous-catégories au départ
      },
      err => {
        console.log(err);
      }
    );
  }

  isUser(): boolean {
    return this.authService.isUser();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substr(0, maxLength) + '...';
    }
    return text;
  }


  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredBiens = this.biens; // Réinitialiser les départements filtrés si la recherche est vide
    } else {
      this.filteredBiens = this.biens.filter((bien: any)=>
        (bien.name.toLowerCase().includes(this.searchTerm.toLowerCase())) || 
        (bien.sousCategorie.name.toLowerCase().includes(this.searchTerm.toLowerCase())) || 
        (bien.categorie.name.toLowerCase().includes(this.searchTerm.toLowerCase())) || 
        (bien.departement.name.toLowerCase().includes(this.searchTerm.toLowerCase())) 
    );
    
    }
  }

  selectBien(bienId: any) {
    this.selectedBienId = bienId;
    console.log('selectedBienId',this.selectedBienId);
  }






    // Méthode de filtrage par département
    filterByDepartement(departement: any) {
      this.selectedDepartement = departement;
      if (departement) {
        console.log("Selected Departement:", departement);
        console.log("Biens:", this.biens);
        this.filteredBiens = this.biens.filter((bien: any) => {
          console.log("Bien Departement ID:", bien.departement.id);
          console.log("Selected Departement ID:", departement.id);
          return bien.departement.id === departement.id;
        });
        console.log("Filtered Biens:", this.filteredBiens);
      } else {
        console.log("No Departement selected. Showing all Biens.");
        this.filteredBiens = this.biens; // Si aucun département n'est sélectionné, afficher tous les biens
      }
    }

  // Méthode de filtrage par catégorie
  filterByCategory(categorie: any) {
    this.selectedCategory = categorie;
    if (categorie) {
      console.log("Selected Category:", categorie);
      console.log("Biens:", this.biens);
      this.filteredBiens = this.biens.filter((bien: any) => {
        console.log("Bien Category ID:", bien.categorie.id);
        console.log("Selected Category ID:", categorie.id);
        return bien.categorie.id === categorie.id;
      });
      // Filtrer les sous-catégories en fonction de la catégorie sélectionnée
      this.filteredSouscategories = this.souscategories.filter((souscategory: any) => {
        return souscategory.categorie.id === categorie.id;
      });
      console.log("Filtered Biens:", this.filteredBiens);
      console.log("Filtered Souscategories:", this.filteredSouscategories);
    } else {
      console.log("No Category selected. Showing all Biens.");
      this.filteredBiens = this.biens; // Si aucune catégorie n'est sélectionnée, afficher tous les biens
      this.filteredSouscategories = this.souscategories; // Afficher toutes les sous-catégories
    }
  }

  // Méthode de filtrage par sous-catégorie
    filterBySouscategory(souscategory: any) {
      this.selectedSouscategory = souscategory;
      if (this.selectedSouscategory) {
        console.log("Selected Souscategory:", this.selectedSouscategory);
        this.filteredBiens = this.biens.filter((bien: any) => {
          // Vérifier si le bien a une sous-catégorie et si son ID correspond à l'ID de la sous-catégorie sélectionnée
          return bien.sousCategorie && bien.sousCategorie.id === this.selectedSouscategory.id;
        });
        console.log("Filtered Biens:", this.filteredBiens);
      } else {
        console.log("No Souscategory selected. Showing all Biens.");
        this.filteredBiens = this.biens;
      }
    }

  

      
    // Méthode pour disable Bien
    confirmDelete(id: any): void {
      if (confirm('Are you sure you want to disable the Benefit ? ')) {
        // Appel de la fonction de suppression une fois que l'utilisateur confirme
        this._shared.disableBien(id)
        .subscribe(
          res=>{
            console.log(res);
            this.ngOnInit();
    
          },
          err=>{
            console.log(err);
          }
        )
      }
    }
    
     
      
    // Méthode pour reactivate Bien
      reactivateBien(id: any): void {
        if (confirm(' Are you sure you want to reactivate the Benefit ?')) {
        // Appelez le service pour réactiver l'utilisateur
        this._shared.reactivateBien(id)
        .subscribe(
            res=>{
              console.log(res);
              this.ngOnInit();
      
            },
            err=>{
              console.log(err);
            }
          )
      }
    }
      
  
}
