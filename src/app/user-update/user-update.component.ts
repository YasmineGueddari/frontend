import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {

  userRoles: string[] = ['User', 'Admin', 'SuperAdmin'];
  branches: any[] = [];
  userId: any;
  form: FormGroup;
  submitted = false;
  image: any;
  selectedImage: string | undefined;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoadingBranches = false;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      password: ['', [Validators.minLength(6), Validators.maxLength(40)]],
      confirmPassword: [''],
      image: [''],
      role: ['', Validators.required],
      idSuccursales: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.getUserById(this.userId);
      }
    });
    this.form.get('role')?.valueChanges.subscribe((value) => {
      this.handleRoleChange(value);
    });

    this.loadBranches();
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
    } else {
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

  getUserById(userId: string): void {
    this.sharedService.getUserById(userId).subscribe(
      (data) => {
        this.patchFormValues(data);
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  patchFormValues(user: any): void {
    this.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      idSuccursales: user.succursales ? user.succursales.map((s: any) => s.id) : '',
    });
    this.selectedImage = 'http://localhost:3000/uploads/' + user.image;
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
    formData.append('role', this.form.value.role);
    formData.append('idSuccursales', this.form.value.idSuccursales);

    if (this.image) {
      formData.append('image', this.image);
    }

    if (this.form.value.password) {
      formData.append('password', this.form.value.password);
    }

    this.sharedService.updateUser(this.userId, formData).subscribe(
      response => {
        console.log('User updated successfully:', response);
        this.successMessage = 'User updated successfully';
        this.router.navigate(['/users']);
      },
      error => {
        console.error('Error updating user:', error);
        this.errorMessage = 'Error updating user: ' + (error.error.message || error.message);
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

      if (password && confirmPassword && password !== confirmPassword) {
        confirmPasswordControl.setErrors({ matching: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  selectImage(event: any) {
    const image = event.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        this.selectedImage = reader.result as string;
        this.image = image;
      };
    }
  }

  setDefaultImage(event: any) {
    event.target.src = '../assets/images/user/1.jpg';
  }
}