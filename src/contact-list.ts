import {EventAggregator} from 'aurelia-event-aggregator';
  import {Client} from './client';
  import {ContactUpdated, ContactViewed} from './messages';
  import {inject} from 'aurelia-framework';
  
  @inject(Client, EventAggregator)
  export class ContactList {
    api: any;
    contacts: any[];
    selectedId: any;
    constructor(api, ea) {
      this.api = api;
      this.contacts = [];
  
      ea.subscribe(ContactViewed, msg => this.select(msg.contact));
      ea.subscribe(ContactUpdated, msg => {
        let id = msg.contact.id;
        let found = this.contacts.find(x => x.id == id);
        Object.assign(found, msg.contact);
      });
    }
  
    created() {
      this.api.getAll().then(contacts => this.contacts = contacts);
    }
  
    select(contact) {
      this.selectedId = contact.id;
      return true;
    }
  }
  

  