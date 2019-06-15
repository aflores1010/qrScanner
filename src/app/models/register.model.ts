import { IfStmt } from '@angular/compiler';

export class RegisterModel {
    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public created: Date;

    constructor(format: string, text: string) {
        this.format = format;
        this.text = text;
        this.created = new Date();
        this.defineType();
    }

    private defineType() {

        const textSarts = this.text.substring(0,4);
        console.log('TYPE: ', textSarts);

        switch(textSarts) {
            case 'http': 
                this.type = 'web'
                this.icon = 'globe'
            break;

            case 'geo:': 
                this.type = 'geo'
                this.icon = 'pin'
            break;

            default: 
                this.type = 'Not Defined'
                this.icon = 'create'
        }
    }

}