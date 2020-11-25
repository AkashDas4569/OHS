import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { CustomPopupService } from '../../../core/services';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'ohs-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.scss']
})
export class CustomPopupComponent implements OnInit, OnDestroy {
  public isBodyOverflowing: any;
  public scrollbarWidth: any;
  private configuration: {
    id: string,
    type: string,
    class: string,
    innerClasses: string,
    direction: string,
    backdrop: boolean
  };
  private ClassName = {
    SCROLLABLE         : 'modal-dialog-scrollable',
    SCROLLBAR_MEASURER : 'modal-scrollbar-measure',
    BACKDROP           : 'modal-backdrop',
    OPEN               : 'modal-open',
    FADE               : 'fade',
    SHOW               : 'show'
  };
  
  @Input() config!: {
    id: string;
    type: string;
    class: string;
    innerClasses: string;
    direction: string;
    backdrop: boolean;
  };
  private element: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customPopupService: CustomPopupService,
    private el: ElementRef
  ) {
    router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        this.customPopupService.closeAll();
      }
    });
    this.element = el.nativeElement;
    this.configuration = {
      id: '',
      type: 'modal',
      class: '',
      innerClasses: '',
      direction: 'top-to-bottom',
      backdrop: true
    };
  }

  ngOnInit(): void {
    const modal = this;
    this.configuration = Object.assign(this.configuration, this.config);
    // console.log(this.config);
    // ensure id attribute exists
    if (!this.configuration.id && !this.configuration.type) {
      console.error('custom popup must have an id and type');
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // Add Custom Class to Modal Component
    this.element.classList.add(this.configuration.class);
    // close modal on background click
    this.element.addEventListener('click', (e: any) => {
      if (e.target.classList.contains('custom-popup-content-container')) {
      // if (e.target.className === 'custom-popup-content-container') {
        modal.close();
      }
    });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.customPopupService.add(this);
  }
  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
    this.customPopupService.remove(this.configuration.id);
    this.element.remove();
  }

  _checkScrollbar() {
    const rect = document.body.getBoundingClientRect();
    this.isBodyOverflowing = rect.left + rect.right < window.innerWidth;
    this.scrollbarWidth = this._getScrollbarWidth();
  }

  _setScrollbar() {
    if (this.isBodyOverflowing) {
      // Adjust body padding
      // const actualPadding = document.body.style.paddingRight;
      const calculatedPadding = document.body.style.paddingRight ? document.body.style.paddingRight : '0';
      // document.body.data('padding-right', actualPadding).css('padding-right', `${parseFloat(calculatedPadding) + this.scrollbarWidth}px`)
      document.body.style.paddingRight = `${parseFloat(calculatedPadding) + this.scrollbarWidth}px`;
    }
  }

  _resetScrollbar() {
    document.body.style.paddingRight = '0';
  }

  _getScrollbarWidth() { // thx d.walsh
    const scrollDiv = document.createElement('div');
    scrollDiv.className = this.ClassName.SCROLLBAR_MEASURER;
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }

  // open modal
  open(): void {
    // this.getScrollbarWidth();
    this._checkScrollbar();
    this._setScrollbar();
    // this.element.style.display = 'block';
    this.element.classList.add('custom-modal-opened');
    document.body.classList.add('custom-modal-open');
  }

  // close modal
  close(): void {
    this._resetScrollbar();
    // this.element.style.display = 'none';
    this.element.classList.remove('custom-modal-opened');
    document.body.classList.remove('custom-modal-open');
  }

}
