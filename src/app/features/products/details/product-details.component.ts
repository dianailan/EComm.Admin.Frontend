import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "../../../services/app.service";
import { Title } from "@angular/platform-browser";
import { FaceTerminalDetails, PayByLinkProductsClient, ProductDetails } from "../../../services/admin.api.client";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent {
  productId: number;

  productDetails: ProductDetails;

  constructor(private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private titleService: Title,
    private payByLinkProducts: PayByLinkProductsClient) {
    this.titleService.setTitle('პროდუქტი | დეტალები');
    this.appService.setTitle('პროდუქტი | დეტალები');
    this.activatedRoute.params.subscribe(p => {
      this.productId = p.id;
      this.appService.setUrl(`/products/${this.productId}/logs`)
      this.getProductDetails();
    })
  }

  getProductDetails(): void {
    this.payByLinkProducts.getProduct(this.productId)
      .subscribe((r: ProductDetails) => {
        this.productDetails = r;
        this.addImagePathToDetails();
      })
  }

  getImgUrl(imgUrl): string {
    return '/api/PayByLinkProducts/Image?fileName=' + imgUrl
  }

  private async addImagePathToDetails() {
    let image = await this.getImagePath(this.productDetails.fileName).catch(e => { console.log(e) })
    if (image) {
      let reader = new FileReader();
      reader.readAsDataURL(image.data);
      reader.onload = (event) => {
        this.productDetails.image = reader.result as string
      }
    }
  }

  private async getImagePath(fileName: string) {
    return await this.payByLinkProducts.getProductImage(fileName).toPromise()
  }
}
