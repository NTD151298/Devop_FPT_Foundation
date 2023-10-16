import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShareStateService {

  stateLogoutOption$: Observable<boolean>;
  stateLogoutOptionSubject: BehaviorSubject<boolean>;

  stateSideBarOption$: Observable<boolean>;
  stateSideBarOptionSubject: BehaviorSubject<boolean>;

  private statePageSubject: BehaviorSubject<any>;
  private statePage:any = null;
  private _page: string = '';
  set statePageName(name:string){
    this._page = name;
  }
  private stateInventorySubject: BehaviorSubject<any>;
  stateInventory$: Observable<boolean>;
  private statePrintTemSubject: BehaviorSubject<any>;
  statePrintTem$: Observable<boolean>;

  constructor() {
    this.stateLogoutOptionSubject = new BehaviorSubject<boolean>(false);
    this.stateLogoutOption$ = this.stateLogoutOptionSubject.asObservable();

    this.stateSideBarOptionSubject = new BehaviorSubject<boolean>(true);
    this.stateSideBarOption$ = this.stateSideBarOptionSubject.asObservable();

    this.statePageSubject = new BehaviorSubject<any>(false);
    this.statePageSubject.asObservable().subscribe((val)=> this.statePage = val);

    this.stateInventorySubject = new BehaviorSubject<any>(false);
    this.stateInventory$ = this.stateInventorySubject.asObservable();
    this.statePrintTemSubject = new BehaviorSubject<any>(false);
    this.statePrintTem$ = this.statePrintTemSubject.asObservable();
  }

  updateStateLogoutOption(option) {
    return this.stateLogoutOptionSubject.next(option);
  }

  updateStateSideBarOption(option) {
    return this.stateSideBarOptionSubject.next(option);
  }

  setStatePage(option) {
    let data = {
      id:this._page,
      data:option
    };
    return this.statePageSubject.next(data);
  }
  getStatePage(){
    let val = this.statePage? {...this.statePage}:false;
    this.statePageSubject.next(false);
    if (val && val.id == this._page) {
      return val.data;
    }
    return false;
  }

  updateStateInventory(option) {
    return this.stateInventorySubject.next(option);
  }

  updateStatePrintTem(option) {
    return this.statePrintTemSubject.next(option);
  }
}
