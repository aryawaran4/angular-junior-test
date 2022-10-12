import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http"
import { environment } from "src/environments/environment";
import { MentorType } from './mentor.type';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  constructor(
    private http: HttpClient
  ) { }

  getData(){
    return this.http.get<MentorType[]>(environment.host + '/data')
  }

  add(data: any) {
    return this.http.post(environment.host + '/data', data)
  }

  update(id: any, data: any) {
    return this.http.put(environment.host + '/data/' + id, data)
  } 

}
