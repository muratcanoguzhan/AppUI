import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject, NewInstance } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Rule, validateTrigger, ValidationController, ValidationRules, Validator } from 'aurelia-validation';
import { ApplicantDialog } from 'resources/dialogs/applicant-dialog';
import { ConfirmationDialog } from 'resources/dialogs/confirmation-dialog';
import { BootstrapFormRenderer } from 'resources/renderers/bootstrap-form-renderer';
import { ApplicantDto, Client } from './client';

@inject(Client, EventAggregator, NewInstance.of(ValidationController), BootstrapFormRenderer, Validator, Router, DialogService)
export class CreateOrUpdateApplicant {
  api: any;
  ea: any;
  routeConfig: any;
  applicant: ApplicantDto = new ApplicantDto();
  originalContact: any;
  disabled = true;
  applicantRules: Rule<ApplicantDto, any>[][];
  constructor(_api, _ea,
    public _applicantController: ValidationController,
    public _bootstrapRenderer: BootstrapFormRenderer,
    private _validator: Validator,
    public _router: Router,
    private _dialogService: DialogService) {

    this.api = _api;
    this.ea = _ea;

    this.applicantRules = ValidationRules
      .ensure((res: ApplicantDto) => res.name).required().minLength(5)
      .ensure((res: ApplicantDto) => res.familyName).required().minLength(5)
      .ensure((res: ApplicantDto) => res.address).required().minLength(10)
      .ensure((res: ApplicantDto) => res.emailAdress).required().email()
      .ensure((res: ApplicantDto) => res.age).required().range(20, 60)
      .ensure((res: ApplicantDto) => res.countryOfOrigin).required()
      .rules;

    this._applicantController.addObject(this.applicant, this.applicantRules);
    this._applicantController.addRenderer(_bootstrapRenderer);
    this._applicantController.validateTrigger = validateTrigger.changeOrBlur;
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    // return this.api.getContactDetails(params.id).then(applicant => {
    //   this.applicant = applicant;
    //   this.routeConfig.navModel.setTitle(applicant.firstName);
    //   this.originalContact = JSON.parse(JSON.stringify(applicant));
    //   this.ea.publish(new ContactViewed(this.applicant));
    // });
  }

  save() {
    this._applicantController.validate().then(x => {
      if (x.valid) {
        this.api.insert(this.applicant).then(r => {
          this._router.navigateToRoute("confirmation-view", r);
        })
          .finally(f => this._applicantController.reset())
          .catch(error => {
            this.dialog(JSON.parse(error.response).errors);
          });;
      }
    });
  }

  reset() {
    let wasCancelled = true;
    this._dialogService.open({ viewModel: ConfirmationDialog, model: "Are you sure you want to reset the form.", lock: false }).whenClosed(response => {
      wasCancelled = response.wasCancelled;
      if (wasCancelled) {
        return false;
      }
      this.applicant.id = 0;
      this.applicant.name = "";
      this.applicant.familyName = "";
      this.applicant.address = "";
      this.applicant.countryOfOrigin = "";
      this.applicant.emailAdress = "";
      this.applicant.age = null;
      this.applicant.hired = false;
      return true;
    });
  }

  dialog(obj) {
    this._dialogService.open({ viewModel: ApplicantDialog, model: obj, lock: false }).whenClosed(response => {
      // if (!response.wasCancelled) {
      //   console.log('good - ', response.output);
      // } else {
      //   console.log('bad');
      // }
      // console.log(response.output);
    });
  }

  canDeactivate() {
    this._applicantController.removeRenderer(this._bootstrapRenderer);
  }

  isValid(e) {
    this._validator.validateObject(this.applicant, this.applicantRules).then(x => {
      this.disabled = x.some(x => !x.valid);
    });
  }

  get disabledForReset() {
    return !Object.keys(this.applicant).some((key) => this.applicant[key]);
  }

  test() {
    this.api.getCountryInfo("Germany").then(x => {
      console.log(x);
    });
  }

}
