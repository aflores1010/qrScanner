import { Injectable, ɵConsole } from '@angular/core';
import { RegisterModel } from '../models/register.model';
import { ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx'
import { EmailComposer } from '@ionic-native/email-composer/ngx'


@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  registersSaved: RegisterModel[] = [];
  message: string;

  constructor(private storage: Storage, 
              private toastController: ToastController,
              private navController: NavController,
              private file: File,
              private emailComposer: EmailComposer,
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

  sendEmail() {

    const tempArray = [];
    const headers = 'Type, Format, CreatedAt, Text\n';

    tempArray.push(headers);

    this.registersSaved.forEach( register => {

      const row = register.type +', ' +register.format + ', ' + register.created + ', '+ register.text.replace(',', '') + '\n';
      tempArray.push(row);

    });
    console.log(tempArray.join(''));
    this.createFile(tempArray.join(''));
  }

  createFile(text: string ) {
    
    this.file.checkFile(this.file.dataDirectory, 'registers.csv').then( (exist) =>{
      console.log('Existe archivo? ', exist);
      return this.writeFile(text);
    }).catch(()=> {
      return this.file.createFile(this.file.dataDirectory, 'registers.csv', false)
             .then( created =>{ this.writeFile(text)
             }).catch(err => console.log('No se pudo crear el archivo', err))
    });
  }

 async writeFile(text: string){
   await this.file.writeExistingFile( this.file.dataDirectory, 'registers.csv', text );
   console.log(' archivo creado ', this.file.dataDirectory);

   const file = this.file.dataDirectory + '/registers.csv';

   const email = {
    to: 'p4ul1991@gmail.com',
    cc: '',
    bcc: [''],
    attachments: [
      file
    ],
    subject: 'APP TEST',
    body: 'Prueba de los scan desde la aplicacion del curso ionic 4',
    isHtml: true
  }
  
  // Send a text message using default options
  this.emailComposer.open(email);

  }
  
}
