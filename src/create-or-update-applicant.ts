import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ApplicantDto, Client } from './client';
import { ContactUpdated, ContactViewed } from './messages';
import { areEqual } from './utility';

@inject(Client, EventAggregator)
export class CreateOrUpdateApplicant {
  api: any;
  ea: any;
  routeConfig: any;
  applicant : ApplicantDto = new ApplicantDto();
  originalContact: any;
  constructor(api, ea) {
    this.api = api;
    this.ea = ea;
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

  get canSave() {
    return this.applicant.name && this.applicant.familyName && !this.api.isRequesting;
  }

  save() {
    this.api.insert(this.applicant).then(r => {
      this.applicant = r;
      // this.routeConfig.navModel.setTitle(r.name);
      // this.originalContact = JSON.parse(JSON.stringify(r));
      // this.ea.publish(new ContactUpdated(this.applicant));
    });
  }

  canDeactivate() {
    if (!areEqual(this.originalContact, this.applicant)) {
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

      if (!result) {
        this.ea.publish(new ContactViewed(this.applicant));
      }

      return result;
    }

    return true;
  }
}
