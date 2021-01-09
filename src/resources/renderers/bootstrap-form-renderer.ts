import {
  RenderInstruction,
  ValidateResult
} from 'aurelia-validation';

export class BootstrapFormRenderer {
  render(instruction: RenderInstruction) {
    for (let { result, elements } of instruction.unrender) {
      for (let element of elements) {
        this.remove(element, result);
      }
    }

    for (let { result, elements } of instruction.render) {
      for (let element of elements) {
        this.add(element, result);
      }
    }
  }

  add(element: Element, result: ValidateResult) {
    const col = element.closest('.col-md-9');
    if (!col) {
      return;
    }

    if (result.valid) {
      if (!element.classList.contains('is-invalid')) {
        element.classList.add('is-valid');
      }
    } else {
      // add the is-invalid class to the enclosing form-group div
      element.classList.remove('is-valid');
      element.classList.add('is-invalid');

      // add help-block
      const message = document.createElement('div');
      message.className = 'invalid-feedback';
      message.textContent = result.message;
      message.id = `validation-message-${result.id}`;
      col.appendChild(message);
    }
  }

  remove(element: Element, result: ValidateResult) {
    const col = element.closest('.col-md-9');
    if (!col) {
      return;
    }

    if (result.valid) {
      if (element.classList.contains('is-valid')) {
        element.classList.remove('is-valid');
      }
    } else {
      // remove help-block
      const message = col.querySelector(`#validation-message-${result.id}`);
      if (message) {
        col.removeChild(message);

        // remove the is-invalid class from the enclosing form-group div
        if (col.querySelectorAll('.invalid-feedback').length === 0) {
          element.classList.remove('is-invalid');
        }
      }
    }
  }
}


