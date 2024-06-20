import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-department-update',
  templateUrl: './department-update.component.html',
  styleUrl: './department-update.component.css'
})
export class DepartmentUpdateComponent implements OnInit {
  @Input() departmentId: any; // Recevoir l'ID en tant que @Input()

  form: FormGroup;
  submitted = false;
  department: any;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],

    });
  }

  ngOnInit(): void {
 console.log('departmentId' ,this.departmentId);
    if (this.departmentId) {
     
      this.getDepartmentById(this.departmentId);
      
    }
  }

  getDepartmentById(departmentId: any): void {
    this.sharedService.getDepartmentById(departmentId).subscribe(
      (data) => {
        this.department = data;
        this.patchFormValues(this.department);
      },
      (error) => {
        console.error('Error fetching department:', error);
      }
    );
  }

  patchFormValues(department: any): void {
    this.form.patchValue({
      name: department.name,
 
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const departmentData = {
      name: this.form.value.name,
      matriculeFiscal: this.form.value.matriculeFiscal,
      address: this.form.value.address,
      email: this.form.value.email,
      phone: this.form.value.phone
    };

    if (this.departmentId) {
      this.sharedService.updateDepartment(this.departmentId, departmentData).subscribe(
        () => {
          console.log('Department updated successfully');
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
          console.error('Error updating department:', error);
        }
      );
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
