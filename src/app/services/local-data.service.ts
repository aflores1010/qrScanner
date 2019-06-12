import { Injectable } from '@angular/core';
import { RegisterModel } from '../models/register.model';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  registersSaved: RegisterModel[] = [];
  message: string;

  constructor(private storage: Storage, private toastController: ToastController) { 
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
  
}
