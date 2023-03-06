import {Component, Input, OnInit} from '@angular/core';
import {Utilisateur} from "../../interfaces/utilisateur";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() user: Utilisateur;
  constructor(private router: Router,
              private route: ActivatedRoute) {
    // @ts-ignore
    this.user= {departements: [], email: "", idUtilisateur: "", nom: "", prenom: "", temps: undefined, username: ""};
  }

  ngOnInit(): void {
  }

}
