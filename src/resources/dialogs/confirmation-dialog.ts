import { DialogController } from 'aurelia-dialog';

export class ConfirmationDialog {
    static inject = [DialogController];
    message = "";
    constructor(private controller: DialogController) {
    }
    activate(message) {
        this.message = message;
    }
}