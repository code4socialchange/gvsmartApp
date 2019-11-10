import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../services/shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  formType: string = 'login';

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private shared: SharedService, private router: Router) { }

  ngOnInit() {
    this.createLoginForm();
    this.createRegisterForm();
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })
  }

  createRegisterForm() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })
  }

  submitLoginForm() {
    if (this.loginForm.invalid) return;

    this.shared.authenticate(this.loginForm.value).subscribe(async response => {
      await this.shared.saveUserToStorage(response.user);
      await this.shared.saveTokenToStorage(response.token);
      this.router.navigate(['home']);
    })

  }


  submitRegisterForm() {
    if (this.registerForm.invalid) return;

    this.shared.authenticate(this.registerForm.value).subscribe(response => {
      this.router.navigate(['home'])
    })

  }

}
