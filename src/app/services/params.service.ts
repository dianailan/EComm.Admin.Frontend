import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HttpParams } from '@angular/common/http';
import { FilterDescriptor } from '@progress/kendo-data-query';

@Injectable({
  providedIn: 'root'
})

export class ParamsService {
  getValuesFromQuery(path, body) {
    const filters: FilterDescriptor[] = [];
    path = decodeURIComponent(path.replace(/\+/g, '%20'));
    if (path !== '') {
      path = path.substring(1);
      const pathArr = path.split('&');
      for (const el of pathArr) {
        const elArr = el.split('=');
        if (elArr[0] === 'CreateDateFrom' || elArr[0] === 'CreateDateTo' || elArr[0] === 'createdAtFrom' || elArr[0] === 'createdAtTo') {
          body[elArr[0]] = new Date(elArr[1]);
        } else {
          body[elArr[0]] = elArr[1];
          filters.push({ 'field': elArr[0], 'operator': "contains", 'value': elArr[1] });
        }
      }
    } else {
      for (const el in body) {
        body[el] = undefined;
      }
    }
    return {
      'body': body,
      'filter': filters
    };
  }

  addParams(body) {
    let params = {};
    for (const prop in body) {
      if (body[prop] !== undefined) {
        if (prop === 'CreateDateFrom' || prop === "CreateDateTo" || prop === "createdAtFrom" || prop === "createdAtTo") {
          params[prop] = moment(body[prop].toString()).toDate().toLocaleDateString();
        } else {
          params[prop] = body[prop];
        }
      }
    }
    return new HttpParams({ fromObject: params });
  }
}
