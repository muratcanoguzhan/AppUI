import { EventAggregator } from 'aurelia-event-aggregator';
import { inject, NewInstance, ObserverLocator } from 'aurelia-framework';
import { ValidationController, ValidationRules, validateTrigger, Validator, Rule } from 'aurelia-validation';
import { BootstrapFormRenderer } from 'resources/renderers/bootstrap-form-renderer';
import { ApplicantDto, Client } from './client';

@inject(Client, EventAggregator, NewInstance.of(ValidationController), BootstrapFormRenderer, Validator, ObserverLocator)
export class CreateOrUpdateApplicant {
  api: any;
  ea: any;
  routeConfig: any;
  applicant: ApplicantDto = new ApplicantDto();
  originalContact: any;
  disabled = true;
  applicantRules: Rule<ApplicantDto, any>[][];
  constructor(api, ea,
    public applicantController: ValidationController,
    public bootstrapRenderer: BootstrapFormRenderer,
    private validator: Validator,
    private ol: ObserverLocator) {

    this.api = api;
    this.ea = ea;

    this.applicantRules = ValidationRules
      .ensure((res: ApplicantDto) => res.name).required().minLength(5)
      .ensure((res: ApplicantDto) => res.familyName).required().minLength(5)
      .ensure((res: ApplicantDto) => res.address).required().minLength(10)
      .ensure((res: ApplicantDto) => res.emailAdress).required().email()
      .ensure((res: ApplicantDto) => res.age).required().range(20, 60)
      .ensure((res: ApplicantDto) => res.countryOfOrigin).required()
      .rules;

    this.applicantController.addObject(this.applicant, this.applicantRules);
    this.applicantController.addRenderer(bootstrapRenderer);
    this.applicantController.validateTrigger = validateTrigger.blur;
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
    this.applicantController.validate().then(x => {
      if (x.valid) {
        this.api.insert(this.applicant).then(r => {
          // this.routeConfig.navModel.setTitle(r.name);
          // this.originalContact = JSON.parse(JSON.stringify(r));
          // this.ea.publish(new ContactUpdated(this.applicant));
        }).finally(f => this.applicantController.reset());
      }
    });
  }

  reset() {
    let result = confirm('Are you sure you wish to reset form?');
    if (!result) {
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
  }

  canDeactivate() {
    this.applicantController.removeRenderer(this.bootstrapRenderer);
  }

  isValid(e) {
    this.validator.validateObject(this.applicant, this.applicantRules).then(x => {
      this.disabled = x.some(x => !x.valid);
    });
  }

  get disabledForReset() {
    return !Object.keys(this.applicant).some((key) => this.applicant[key]);
  }

  test() {
    this.api.getCountryInfo("Turkey").then(x => {
      console.log(x);
    });
  }

}
