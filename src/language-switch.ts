
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';

@inject(I18N)
export class LanguageSwitch {
    languages = [
        {
            name: "de",
            displayName: "Deutsch",
            icon: "famfamfam-flags de"
        },
        {
            name: "en",
            displayName: "English",
            icon: "famfamfam-flags us"
        }
    ];
    constructor(public i18n: I18N) {
    }

    changeLanguage(language) {
        this.i18n.setLocale(language.name);
    }
}