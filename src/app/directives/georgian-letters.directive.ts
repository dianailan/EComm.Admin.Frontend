import {Directive, HostListener} from "@angular/core";

@Directive({
  selector: '[convertToGeorgian]'
})
export class GeorgianLettersDirective {
  isShift = false;
  isCapsLock = false;
  private alphabet = "abgdevzTiklmnopJrstufqRySCcZwWxjh";
  private appliedLettersForCaps = "tsrzcwj";
  private appliedLettersForShift = "TSRZCWJ";

  @HostListener('keydown', ['$event'])
  public isCapsLockOn(event) {
    this.isCapsLock = event.getModifierState && event.getModifierState('CapsLock');
    this.isShift = event.shiftKey;
  }

  @HostListener('input', ['$event.target'])
  public convertToGeorgian(event){
    let value = event.value;
    let lastLetter;
    for (let i = 0; i < value.length; i++) {
      if (this.isCapsLock && !this.isShift) {
        value = value.toLowerCase();
      } else if (this.isCapsLock && this.isShift) {
        if (this.appliedLettersForCaps.indexOf(value[value.length - 1]) !== -1) {
          lastLetter = value[value.length - 1].toUpperCase();
          value = value.slice(0, -1);
          value += lastLetter;
          this.isCapsLock = false;
        }
      } else if (!this.isCapsLock && this.isShift) {
        if (this.appliedLettersForShift.indexOf(value[value.length - 1]) === -1) {
          lastLetter = value[value.length - 1].toLowerCase();
          value = value.slice(0, -1);
          value += lastLetter;
          this.isShift = false;
        }
      }
      if (this.alphabet.indexOf(value[i]) !== -1) {
        value = value.replace(value[i], String.fromCharCode(this.alphabet.indexOf(value[i]) + 4304));
        event.value = value;
      } else {
        value = value.replace(value[i], value[i].toLowerCase());
        if (this.alphabet.indexOf(value[i]) !== -1) {
          value = value.replace(value[i], String.fromCharCode(this.alphabet.indexOf(value[i]) + 4304));
          event.value = value;
        }
      }
    }
  }
}
