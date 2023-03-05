import { Component, OnInit } from '@angular/core';
import {LoginService} from "./login.service";
import {Utilisateur} from "../interfaces/utilisateur";
import {Router} from "@angular/router";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title = 'timplannerfront';
  value= {} as Utilisateur;
  username: any;
  reponse: any;


  constructor(public loginService: LoginService,
              private router: Router) {}

  async postValues(username: string){
    await lastValueFrom(this.loginService.postUsername(this.reponse, username)).then(
      (utilisateur) =>{
        this.value = utilisateur
      }
    )
    this.router.navigate(['temps', {user: JSON.stringify(this.value)}]);
  }
  ngOnInit(): void {
  }

}
