import { Injectable, ɵConsole } from '@angular/core';
import { RegisterModel } from '../models/register.model';
import { ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  registersSaved: RegisterModel[] = [];
  message: string;

  constructor(private storage: Storage, 
              private toastController: ToastController,
              private navController: NavController,
              private inAppBrowser: InAppBrowser) { 
    this.getFromStorage();
  }

  async saveRegister(format: string, text: string) {
    await this.getFromStorage();
    console.log('registersSaved: ', this.registersSaved);

    let exist = false;
    for(const register of this.registersSaved){
      if(register.text === text) {
        exist = true;
        break;
      }
    }

    if(exist){
      console.log('Toast de registro ya almacenado');
    } else {
      const newRegister = new RegisterModel(format, text);
      this.registersSaved.unshift(newRegister);
      this.storage.set('register', this.registersSaved);
      this.message = 'Se han almacenado los datos del codigo QR'
      this.openRegister(newRegister);
    }

  }

  async presentToast(){
   const toast = await this.toastController.create({
      message: this.message,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  async getFromStorage() {
   const tempStorage = await this.storage.get('register');
   this.registersSaved = tempStorage || [];
  }

  openRegister(register: RegisterModel) {
    this.navController.navigateForward('/tabs/tab2');
    switch (register.type) {
      
      case 'web':
      this.inAppBrowser.create(register.text, '_system');
      break

      case 'geo':
      this.navController.navigateForward('/tabs/tab2/map/' + register.text);
      break
    }

  }
  
}
