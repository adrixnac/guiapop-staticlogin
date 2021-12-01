import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from './app.reducer';
import { NgxSpinnerService } from 'ngx-spinner';
import * as GLOBALS from '../app/common/config/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  loadingSuscription: Subscription = new Subscription();

  constructor( private store: Store<AppState>, private spinner: NgxSpinnerService ){
    this.loadingSuscription = store.select('ui').subscribe( ui=>{
      if(ui.isLoading){
        this.spinner.show();
      }else{
        this.spinner.hide();
      }
    }); 
    let url = document.location.href;
    let ambiente = "";
    if( url.includes("localhost") || url.includes("-qa.") ){
      console.log("QA")
      GLOBALS.GLOBAL.ambiente = GLOBALS.AMBIENTES.QA; 
      // ambiente = "QA";
      // Si trabajas en local y quioeres cambiar el ambiente
      // UAT
      // GLOBALS.GLOBAL.ambiente = GLOBALS.AMBIENTES.UAT;
      // PROD
      // GLOBALS.GLOBAL.ambiente = GLOBALS.AMBIENTES.PROD;
    }else if( url.includes("-uat.") ){
      console.log("UAT")
      // para traer las rutas url
      // ambiente = "UAT";
      GLOBALS.GLOBAL.ambiente = GLOBALS.AMBIENTES.UAT;
    }else{
      console.log("PROD")
      // para traer las rutas url
      // ambiente = "PROD";
      GLOBALS.GLOBAL.ambiente = GLOBALS.AMBIENTES.PROD;
    }
  }
  
  ngOnDestroy(){
    this.loadingSuscription.unsubscribe();
  }

}
