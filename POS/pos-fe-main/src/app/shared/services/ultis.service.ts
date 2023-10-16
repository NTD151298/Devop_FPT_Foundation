import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UltisService {

  constructor() { }

  genWarehouses(data) {
    let comboboxData = [];
    if (!data) {
      return comboboxData;
    }
    data.forEach((e) => {
      let child = data.filter((x) => x.parent_id == e.id);
      e.items = child ? child : [];
    });
    data.forEach((element) => {
      comboboxData.push({ label: element.name + (element.type == 0 ? ' (Kho hủy)' : ''), value: element.id });
      element.items.forEach((el) => {
        comboboxData.push({ label: '-- ' + el.name + (el.type == 0 ? ' (Kho hủy)' : ''), value: el.id });
      });
    });
    return comboboxData;
  }
}
