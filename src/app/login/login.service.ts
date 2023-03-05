import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Utilisateur} from "../interfaces/utilisateur";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    })/*,
    withCredentials: true,*/
  };

  private urlBack = 'http://localhost:8080/'
  private utilisateurUrl = "utilisateur";
  constructor(private http: HttpClient) { }

  public postUsername(reponse: string,username: string): Observable<Utilisateur>{
    return this.http.post<any>(this.urlBack+this.utilisateurUrl+"/userExist?username="+username, reponse/*, this.httpOptions*/)
}
}
