import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private title = new BehaviorSubject<string>('');
  private url = new BehaviorSubject<string>('');
  private url$ = this.url.asObservable();
  private title$ = this.title.asObservable();
  showHide = new BehaviorSubject(false);
  showObs = this.showHide.asObservable();
  show: boolean;

  constructor() {
  }

  setTitle(title: string) {
    this.title.next(title);
  }

  setUrl(url: string) {
    this.url.next(url);
  }

  getUrl(): Observable<string> {
    return this.url$;
  }

  getTitle(): Observable<string> {
    return this.title$;
  }

  navBarToggle(show: boolean = this.show) {
    return this.showHide.next(show);
  }
}
