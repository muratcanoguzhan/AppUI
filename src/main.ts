import { Aurelia } from 'aurelia-framework';
import { I18N, TCustomAttribute } from 'aurelia-i18n';
import { PLATFORM } from 'aurelia-pal';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'famfamfam-flags/dist/sprite/famfamfam-flags.min.css';
import Backend from 'i18next-xhr-backend';
import * as environment from '../config/environment.json';
import { ValidationMessageProvider } from 'aurelia-validation';

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('aurelia-dialog'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
      let aliases = ['t', 'i18n'];
      // add aliases for 't' attribute
      TCustomAttribute.configureAliases(aliases);

      // register backend plugin
      instance.i18next.use(Backend);

      // adapt options to your needs (see http://i18next.com/docs/options/)
      // make sure to return the promise of the setup method, in order to guarantee proper loading
      return instance.setup({
        backend: {                                  // <-- configure backend settings
          loadPath: './locales/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from
        },
        attributes: aliases,
        lng: 'de',
        fallbackLng: 'en',
        debug: false
      });
    });

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));

  ValidationMessageProvider.prototype.getMessage = function (key) {
    const i18n = aurelia.container.get(I18N);
    const translation = i18n.tr(`errorMessages.${key}`);
    return this.parser.parse(translation);
  };

  ValidationMessageProvider.prototype.getDisplayName = function (propertyName, displayName) {
    if (displayName !== null && displayName !== undefined) {
      let name1: string = displayName as string;
      name1 = name1.charAt(0).toUpperCase() + name1.slice(1);
      return name1;
    }
    const i18n = aurelia.container.get(I18N);
    let name1: string = propertyName as string;
    name1 = name1.charAt(0).toUpperCase() + name1.slice(1);
    return i18n.tr(name1);
  };

}
