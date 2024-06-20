import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-departements',
  templateUrl: './departements.component.html',
  styleUrl: './departements.component.css'
})

export class DepartementsComponent implements OnInit {
  selectedDepartmentId: any;
  departments: any[] = []; // Tableau pour stocker toutes les données des départements

  searchTerm: string = '';
  filteredDepartments: any[] = [];

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    // Chargez tous les départements lors de l'initialisation du composant
    this.loadAllDepartments();
  }

  loadAllDepartments(): void {
    // Utilisez le service pour récupérer tous les départements
    this.sharedService.getAllDepartments().subscribe(
      (data) => {
        this.departments = data; // Attribuez les données récupérées à la liste de tous les départements
        this.filteredDepartments = this.departments; 
        console.log('departments', this.departments);
      },
      (error) => {
        console.error('Error fetching all departments:', error);
      }
    );
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredDepartments = this.departments; // Réinitialiser les départements filtrés si la recherche est vide
    } else {
      this.filteredDepartments = this.departments.filter(department =>
        (department.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    
    }
  }

  selectDepartment(departmentId: any) {
    this.selectedDepartmentId = departmentId;
    console.log('selectedDepartmentId', this.selectedDepartmentId);
  }

  confirmDelete(id: string): void {
    if (confirm('Are you sure you want to disable the department?')) {
      // Appel de la fonction de suppression une fois que l'utilisateur confirme
      this.sharedService.disableDepartment(id)
      .subscribe(
        res => {
          console.log(res);
          this.ngOnInit();
        },
        err => {
          console.log(err);
        }
      )
    }
  }


  // Méthode pour réactiver le département
  reactivateDepartment(id: any) {
    if (confirm('Are you sure you want to reactivate the department?')) {
      // Appelez le service pour réactiver le département
      this.sharedService.reactivateDepartment(id)
        .subscribe(
          res => {
            console.log(res);
            this.ngOnInit();
          },
          err =>{
            console.log(err);
          }
        )
    }
  }
}