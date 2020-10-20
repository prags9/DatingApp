import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = 'https://localhost:5001/api/';
  //Storing our user in a special kind of observable. ReplaySubject is liek a buffer oject
  //and anytime the subscriber subscribe it, it gonna emit the last value inside it or out 
  //of many value that we want to emit.The parameter here specifies thw size of our buffer.
  private currentUserSource = new ReplaySubject<User>(1)

  //As currentUser is an observable we give $ sign at the end
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.baseUrl+'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if(user){
          //store in browsers local storage
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  register(model: any){
    return this.http.post(this.baseUrl+'account/register',model).pipe(
      map((user: User) => {
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })   
    )
  }
  //Helper method
  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');    
    this.currentUserSource.next(null);
  }
}
