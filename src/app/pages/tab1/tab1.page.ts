import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LocalDataService } from '../../services/local-data.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public slideOptions = {
    allowSlidePrev: false,
    allowSlideNext: false
  }

  constructor( private barcodeScanner: BarcodeScanner,
              private localDataService: LocalDataService) {}

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if (!barcodeData.cancelled){
        this.localDataService.saveRegister(barcodeData.format, barcodeData.text);
      }
     }).catch(err => {
         console.log('Error', err);
         // this.localDataService.saveRegister('QRCode', 'http://www.youtube.com');
         this.localDataService.saveRegister('QRCode', 'geo:9.039713970183458,-79.4327153249634');
     });
  }

}
