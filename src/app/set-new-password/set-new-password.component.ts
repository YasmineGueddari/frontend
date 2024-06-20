import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  successMessage: string = '';
  errorMessage: string = '';
  token: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log('Token from URL:', this.token);
      if (!this.token) {
        this.router.navigate(['/auth-sign-in']);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      return;
    }

    if (this.f['password'].value !== this.f['confirmPassword'].value) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.token) {
      this.sharedService.setNewPassword(this.token, this.f['password'].value).subscribe(
        response => {
          this.successMessage = 'Your password has been successfully reset.';
          setTimeout(() => {
            this.router.navigate(['/auth-sign-in']);
          }, 3000);
        },
        error => {
          this.errorMessage = 'An error occurred. Please try again later.';
          console.error('Error setting new password:', error);
        }
      );
    } else {
      this.errorMessage = 'Token not found. Please request a new password reset.';
    }
  }
}
