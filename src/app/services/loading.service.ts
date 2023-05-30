import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, tap, concatMap, finalize } from "rxjs";

@Injectable()
export class LoadingService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean> = this.loadingSubject.asObservable()

  showLoaderUntilCompleted<T>(obs$:Observable<T>):Observable<T>{
    return of(null)
        .pipe(
          tap(()=>this.loadingOn()),
          concatMap(()=>obs$),
          finalize(()=>this.loadingOff())
        )
    // return undefined;
  }
  loadingOn() {
    this.loadingSubject.next(true)
  }

  loadingOff() {
    this.loadingSubject.next(false)
  }
}