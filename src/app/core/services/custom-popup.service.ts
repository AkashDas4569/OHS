import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomPopupService {

  constructor() { }

  private modals: any[] = [];

  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(id: string) {
    // remove modal from array of active modals
    this.modals = this.modals.filter(m => m.configuration.id !== id);
  }

  open(id: string) {
    // open modal specified by id
    const modal: any = this.modals.filter(m => m.configuration.id === id)[0];
    modal.open();
  }

  close(id: string) {
    // close modal specified by id
    const modal: any = this.modals.filter(m => m.configuration.id === id)[0];
    if (modal) {
      modal.close();
    }
  }

  closeAll() {
    // close all modal at once
    this.modals.map(m => {
      if (m) {
        m.close();
      }
    });
  }
}
