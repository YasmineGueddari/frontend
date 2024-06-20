import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  selectedBranchId: any;
  branches: any[] = []; // Tableau pour stocker toutes les données des branches

  searchTerm: string = '';
  filteredBranches: any[] = [];

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    // Chargez toutes les branches lors de l'initialisation du composant
    this.loadAllBranches();
  }

  loadAllBranches(): void {
    // Utilisez le service pour récupérer toutes les branches
    this.sharedService.getAllBranches().subscribe(
      (data) => {
        this.branches = data; // Attribuez les données récupérées à la liste de toutes les branches
        this.filteredBranches = this.branches; 
        console.log('branches', this.branches);
      },
      (error) => {
        console.error('Error fetching all branches:', error);
      }
    );
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredBranches = this.branches; // Réinitialiser les utilisateurs filtrés si la recherche est vide
    } else {
      this.filteredBranches = this.branches.filter(branch =>
        (branch.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    
    }
  }

  selectBranch(branchId: any) {
    this.selectedBranchId = branchId;
    console.log('selectedBranchId', this.selectedBranchId);
  }

  confirmDelete(id: string): void {
    if (confirm('Are you sure you want to disable the branch ? ')) {
      // Appel de la fonction de suppression une fois que l'utilisateur confirme
      this.sharedService.disableBranch(id)
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



  // Méthode pour réactiver la branche
  reactivateBranch(id: any) {
    if (confirm('Are you sure you want to reactivate the branch ?')) {
      // Appelez le service pour réactiver la branche
      this.sharedService.reactivateBranch(id)
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

