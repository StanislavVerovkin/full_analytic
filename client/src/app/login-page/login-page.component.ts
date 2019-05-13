import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/helpers/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Зайдите в систему используя данные');
      } else if (params['accessDenied']) {
        MaterialService.toast('Авторизуйтесь в системе');
      } else if (params['sessionExpired']) {
        MaterialService.toast('Время сессии истекло');
      }
    })
  }

  onSubmit() {
    this.form.disable();
    this.auth.login(this.form.value)
      .subscribe(
        () => this.router.navigate(['/overview']),
        error => {
          MaterialService.toast(error.error.message);
          this.form.enable();
        },
      );
  }
}
