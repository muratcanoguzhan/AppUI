
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';

@inject(I18N)
export class LanguageSwitch {
    constructor(public i18n: I18N) {
    }

    changeLanguage(lngName) {
        this.i18n.setLocale(lngName).then(x => {

        });
    }
}