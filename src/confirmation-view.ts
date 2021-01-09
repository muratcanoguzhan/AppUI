export class ConfirmationView {
  routeConfig: any;
  message = "";
  constructor() {
  }

  activate(params, routeConfig, a) {
    this.routeConfig = routeConfig;
    if (params.id) {
      this.message = "Applicant has been created!"
    }
  }
  canDeactivate() {

  }
}
