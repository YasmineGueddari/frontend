import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  userRoles: string[] = ['User', 'Admin', 'SuperAdmin'];
  branches: any[] = [];

  form: FormGroup;
  submitted = false;

  image: any;
  selectedImage: string | undefined;
  
  successMessage: string | null = null;
  errorMessage: string | null = null;

  isLoadingBranches = false;
  currentUserRole: string = '';
 

  constructor(private formBuilder: FormBuilder, private sharedService: SharedService, private router: Router,  private authService: AuthService) {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      confirmPassword: ['', Validators.required],
      image: [''],
      role: ['', Validators.required],
      idSuccursales: [[], Validators.required],
 
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.loadBranches();
    this.form.get('role')?.valueChanges.subscribe((value) => {
      this.handleRoleChange(value);
    });

    
    this.authService.getUserRole().subscribe(role => {
      this.currentUserRole = role;
    });
  }

  loadBranches(): void {
    this.isLoadingBranches = true;
    this.sharedService.getAllBranches().subscribe(
      (data) => {
        this.branches = data;
        this.isLoadingBranches = false;
      },
      (error) => {
        console.error('Error fetching branches:', error);
        this.isLoadingBranches = false;
      }
    );
  }

  handleRoleChange(role: string): void {
    if (role === 'SuperAdmin') {
      this.loadAllBranchesForAdmin();
    } else if (role === 'User') {
      const idSuccursales = localStorage.getItem('idSuccursale');
      if (idSuccursales) {
        this.form.patchValue({ idSuccursales: idSuccursales });
      }
    } else if (role === 'Admin') {
      this.form.patchValue({ idSuccursales: '' });
    }
  }

  loadAllBranchesForAdmin(): void {
    this.isLoadingBranches = true;
    this.sharedService.getAllBranches().subscribe(
      (data) => {
        this.branches = data;
        const allBranchIds = this.branches.map(branch => branch.id);
        this.form.patchValue({ idSuccursales: allBranchIds });
        this.isLoadingBranches = false;
      },
      (error) => {
        console.error('Error fetching branches:', error);
        this.isLoadingBranches = false;
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

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.form.value.firstName);
    formData.append('lastName', this.form.value.lastName);
    formData.append('email', this.form.value.email);
    formData.append('phone', this.form.value.phone);
    formData.append('password', this.form.value.password);
    formData.append('confirmPassword', this.form.value.confirmPassword);
    formData.append('image', this.image);
    formData.append('role', this.form.value.role);
    formData.append('idSuccursales', this.form.value.idSuccursales);

    this.sharedService.addUser(formData).subscribe(
      response => {
        console.log('User added successfully');
        this.successMessage = 'User added successfully';
        this.submitted = false;
        this.form.reset();
        this.router.navigate(['/users']);
      },
      error => {
        console.log('Error adding user');
        this.errorMessage = 'Error adding user: ' + (error.error.message || error.message);
      }
    );
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');
    if (passwordControl && confirmPasswordControl) {
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;
      if (confirmPassword === '') {
        confirmPasswordControl.setErrors({ required: true });
      } else if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({ matching: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
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

    setDefaultImage(event: any) {
    event.target.src = '../assets/images/user/1.jpg';
  }

  onBack() {
    window.history.back(); 
}

}
