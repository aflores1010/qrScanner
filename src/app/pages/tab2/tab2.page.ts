import { Component } from '@angular/core';
import { LocalDataService } from 'src/app/services/local-data.service';
import { RegisterModel } from 'src/app/models/register.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public localDataService: LocalDataService) {}

  sendEmail() {
    console.log('Enviando correo');
  }

  openRegister(register: RegisterModel) {
    console.log('Registro', register);
    this.localDataService.openRegister(register);
  }

}
