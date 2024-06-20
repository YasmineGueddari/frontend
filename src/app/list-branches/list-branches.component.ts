import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-branches',
  templateUrl: './list-branches.component.html',
  styleUrls: ['./list-branches.component.css']
})
export class ListBranchesComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  branches: any[] = [];
  errorMessage: string = '';
  currentUserRole: string = '';

  constructor(private formBuilder: FormBuilder, private sharedService: SharedService, private router: Router) {
    this.form = this.formBuilder.group({
      idSuccursales: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBranches();
    this.currentUserRole = localStorage.getItem('role') || '';
    const idSuccursales = localStorage.getItem('idSuccursales');
    if (idSuccursales) {
      localStorage.setItem('idSuccursales', idSuccursales);
    }
  }

  loadBranches(): void {
    this.sharedService.getAllBranches().subscribe(
      (data) => {
        this.branches = data;
      },
      (error) => {
        console.error('Error fetching branches:', error);
      }
    );
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.form.invalid) {
      return;
    }

    const selectedBranchId = this.form.value.idSuccursales;
    const userBranchIds = localStorage.getItem('idSuccursales');

    console.log('Selected branch ID:', selectedBranchId);
    console.log('User branch IDs from local storage:', userBranchIds);

    if (this.currentUserRole !== 'SuperAdmin' && (!userBranchIds || !userBranchIds.split(',').map(id => parseInt(id)).includes(parseInt(selectedBranchId)))) {
      this.errorMessage = 'The selected branch is not valid for the current user.';
      console.log('Error message set:', this.errorMessage);
      return;
    }

    console.log('Selected branch ID:', selectedBranchId);
    localStorage.setItem('selectedBranchId', selectedBranchId);
    this.router.navigate(['/index']);
  }
}
