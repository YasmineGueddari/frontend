import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service'; // Assurez-vous que le chemin est correct
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private sharedService: SharedService, private route: ActivatedRoute, private router: Router) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      return;
    }

    this.sharedService.sendPasswordResetLink(this.form.value.email).subscribe(
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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('resetToken', token);
        this.router.navigate(['/set-new-password']);
      }
    });
  }
}
