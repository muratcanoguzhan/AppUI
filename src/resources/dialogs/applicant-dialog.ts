import { DialogController } from 'aurelia-dialog';

export class ApplicantDialog {
    static inject = [DialogController];
    errors = [];
    constructor(private controller: DialogController) {
    }
    activate(obj) {
        Object.keys(obj).map(x => this.errors.push(x +": "+ obj[x]));
    }
}