import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-auth-sign-in',
  templateUrl: './auth-sign-in.component.html',
  styleUrls: ['./auth-sign-in.component.css']
})
export class AuthSignInComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  errorMessage: string = ''; // Déclaration de la variable pour stocker le message d'erreur

  constructor(private formBuilder: FormBuilder, private sharedService: SharedService, private router: Router) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.form.invalid) {
      return;
    }

    // Appel du service pour se connecter
    this.sharedService.signIn(this.form.value).subscribe(
      response => {
        
        console.log('User login successfully:', response);
        this.submitted = false;
        this.router.navigate(['/list-branch']);
      },
      error => {
        if (error.status === 401) {
          this.errorMessage = 'Incorrect email or password.'; // Message d'erreur si le mot de passe est incorrect ou l'e-mail n'est pas trouvé
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
          console.error('Error login user:', error);
        }
      }
    );
  }

  ngOnInit(): void {}
}
