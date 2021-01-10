import { inject, PLATFORM } from 'aurelia-framework';
import { Client } from './client';

@inject(Client)
export class App {
  api: any;
  router: any;
  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router) {
    config.title = 'Hahn';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '', moduleId: PLATFORM.moduleName('create-or-update-applicant'), name: 'Applicants' },
      { route: 'confirmation-view', moduleId: PLATFORM.moduleName('confirmation-view'), name: 'confirmation-view'},
      { route: 'language-switch', moduleId: PLATFORM.moduleName('language-switch'), name: 'language-switch'},
    ]);

    this.router = router;
  }
}

