import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()

export class IsLoadingService {
  public $isLoaded: Subject<boolean> = new Subject<boolean>();

  public isLoaded(): Observable<any> {
    return this.$isLoaded.asObservable();
  }

  public loadingProcess(loading) {
    this.$isLoaded.next(loading)
  }
}
