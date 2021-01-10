import { I18N } from 'aurelia-i18n';
import { DialogController } from 'aurelia-dialog';

export class ApplicantDialog {
    static inject = [DialogController, I18N];
    errors = [];
    constructor(private controller: DialogController, private i18n: I18N) {
    }
    activate(obj) {
        Object.keys(obj).map(x => {
            debugger;
            if (x == 'CountryOfOrigin') {
                let eMsg = this.i18n.tr("errorMessages.CountryOfOriginError");
                this.errors.push(eMsg);
            } else {
                this.errors.push(x + ": " + obj[x]);
            }
        });
    }
}