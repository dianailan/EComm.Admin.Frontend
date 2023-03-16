import { Injectable } from "@angular/core";
import { MessageService } from "@progress/kendo-angular-l10n";

const messages = {
  'kendo.grid.noRecords': 'ჩანაწერი არ მოიძებნა',
  'kendo.grid.pagerItemsPerPage': 'ჩანაწერი გვერდზე',
  'kendo.grid.pagerOf': 'ჩანაწერი',
  'kendo.grid.pagerItems': 'ჩანაწერიდან',
};

@Injectable()

export class CustomMessagesService extends MessageService {
  public get(key: string): string {
    return messages[key]
  }
}
