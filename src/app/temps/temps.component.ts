import { Component, OnInit } from '@angular/core';
import {Utilisateur} from "../interfaces/utilisateur";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-temps',
  templateUrl: './temps.component.html',
  styleUrls: ['./temps.component.css']
})
export class TempsComponent implements OnInit {
  value= {} as Utilisateur;

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // @ts-ignore
    this.value = JSON.parse(this.route.snapshot.paramMap.get('user'|| '{}'));
  }

}
