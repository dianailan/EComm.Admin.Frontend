import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "../../../services/app.service";
import { Title } from "@angular/platform-browser";
import {
  BasketDetails,
  PayByLinkBasketsClient,
  PayByLinkProductsClient,
  ProductDetails, ProductListItemPagingResponse
} from "../../../services/admin.api.client";

@Component({
  selector: 'app-basket-details',
  templateUrl: './basket-details.component.html',
  styleUrls: ['./basket-details.component.scss']
})

export class BasketDetailsComponent {
  basketId: number;
  basketDetails: BasketDetails

  constructor(private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private titleService: Title,
    private payByLinkBaskets: PayByLinkBasketsClient,
    private payByLinkProducts: PayByLinkProductsClient) {
    this.titleService.setTitle('კალათა | დეტალები');
    this.appService.setTitle('კალათა | დეტალები');
    this.activatedRoute.params.subscribe(p => {
      this.basketId = p.id;
      this.appService.setUrl(`/baskets/${this.basketId}/logs`)
      this.getBasketDetails();
    })
  }

  getBasketDetails(): void {
    this.payByLinkBaskets.getBasket(this.basketId)
      .subscribe((r: BasketDetails) => {
        this.mapDataList(r);
      })
  }

  private async mapDataList(data: BasketDetails) {
    try {
      await Promise.all(data.basketItems.map(async (item) => {
        let image = await this.getImagePath(item.fileName).catch(e => { console.log(e) })
        if (image) {
          let reader = new FileReader();
          reader.readAsDataURL(image.data);
          reader.onload = (event) => {
            item['image'] = reader.result
          }
        } else {
          item['image'] = ''
        }
        return item;
      }))
      this.basketDetails = data;
    } catch (e) {
    }
  }

  private async getImagePath(fileName: string) {
    return await this.payByLinkProducts.getProductImage(fileName).toPromise()
  }
}
