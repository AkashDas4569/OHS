import { Directive, OnInit, OnChanges, Input, ElementRef, HostListener  } from '@angular/core';

@Directive({
  selector: '[ohsToggleViewPassword]'
})
export class ToggleViewPasswordDirective implements OnInit {
  @Input() ohsToggleViewPassword!: HTMLInputElement;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('click', ['$event']) toggleViewPassword($event: any): void {
    // console.log($event);
    if (this.ohsToggleViewPassword.value && this.ohsToggleViewPassword.type === 'password') {
      this.ohsToggleViewPassword.type = 'text';
      $event.target.classList.add('active');
    } else {
      this.ohsToggleViewPassword.type = 'password';
      $event.target.classList.remove('active');
    }
  }
}
