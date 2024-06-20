import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-admin-profile-edit',
  templateUrl: './admin-profile-edit.component.html',
  styleUrls: ['./admin-profile-edit.component.css']
})
export class AdminProfileEditComponent implements OnInit {
  user: any = {};
  userId: string | null = null;

  image: any;
  selectedImage: string | undefined;

  profileForm: FormGroup;
  passwordForm: FormGroup;
  submittedProfile = false;
  submittedPassword = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private sharedService: SharedService, private fb: FormBuilder, private router: Router) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      image: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      verifyPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    if (typeof localStorage !== 'undefined') {
      this.userId = localStorage.getItem('id');
      if (this.userId) {
        this.getUserById(this.userId);
      }
    } else {
      console.error('localStorage is not available.');
    }
  }

  getUserById(userId: string): void {
    this.sharedService.getUserById(userId).subscribe(
      (data) => {
        this.user = data;
        this.profileForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          phone: this.user.phone,
        });
        this.selectedImage = 'http://localhost:3000/uploads/' + this.user.image;
      },
      (error) => {
        if (error.status === 401) {
          console.error('User is not authorized to access this resource.');
        } else {
          console.error('Error fetching user profile:', error);
        }
      }
    );
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

  updateUserProfile(): void {
    this.submittedProfile = true;
    if (this.profileForm.invalid) {
      return;
    }
    if (this.userId) {
      const formData = new FormData();
      formData.append('firstName', this.profileForm.value.firstName);
      formData.append('lastName', this.profileForm.value.lastName);
      formData.append('email', this.profileForm.value.email);
      formData.append('phone', this.profileForm.value.phone);
      if (this.image) {
        formData.append('image', this.image);
      }

      this.sharedService.updateUserProfile(this.userId, formData).subscribe(
        (data) => {
          console.log('User profile updated successfully:', data);
          this.successMessage = 'User profile updated successfully';
  
        },
        (error) => {
          console.error('Error updating user profile:', error);
          this.errorMessage = 'Error updating user profile';
       
        }
      );
    }
  }

  resetForm(): void {
    this.submittedProfile = false;
    this.profileForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
    if (this.userId) {
      this.getUserById(this.userId);
    }
  }

  changePassword(): void {
    this.submittedPassword = true;
    if (this.passwordForm.invalid) {
        return;
    }

    // Vérification des mots de passe non correspondants
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.verifyPassword) {
        this.errorMessage = 'New passwords do not match';
        this.successMessage = '';
        return;
    }

    const userId = localStorage.getItem('id');
    if (!userId) {
        this.errorMessage = 'User ID not found';
        this.successMessage = '';
        return;
    }

    this.sharedService.changePassword(+userId, this.passwordForm.value.currentPassword, this.passwordForm.value.newPassword).subscribe(
        (data) => {
            console.log('Password changed successfully:', data);
            this.successMessage = 'Password changed successfully';
            this.errorMessage = '';
            this.resetPasswordForm();
        },
        (error) => {
            console.error('Error changing password:', error);
            this.errorMessage = 'Error changing password';
            this.successMessage = '';
        }
    );
}


  resetPasswordForm(): void {
    this.submittedPassword = false;
    this.passwordForm.reset();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const verifyPassword = control.get('verifyPassword');
    return newPassword && verifyPassword && newPassword.value !== verifyPassword.value ? { mismatch: true } : null;
  }

  get fProfile() { return this.profileForm.controls; }
  get fPassword() { return this.passwordForm.controls; }


  forgotPassword(){

  console.log('Email user ',this.user.email);
    this.sharedService.sendPasswordResetLink(this.user.email).subscribe(
      response => {
        this.successMessage = 'A password reset link has been sent to your email.';
        this.router.navigate(['/auth-confirm-mail']);
      },
      error => {
        this.errorMessage = 'An error occurred. Please try again later.';
        console.error('Error sending password reset email:', error);
      }
    );

  }
}
