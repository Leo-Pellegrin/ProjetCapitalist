import { Component, Input, Output, EventEmitter, AfterViewInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { Product, Palier } from '../world';
import { isPlatformBrowser, CommonModule } from "@angular/common"; // update this
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MyProgressBarComponent, Orientation } from '../progressbar/progressbar.component';
import { GET_SERV } from '../../request';
import { WebserviceService } from '../webservice.service';
import { MsToTimePipe } from '../ms-to-time.pipe';
import { BigvaluePipe } from '../bigvalue.pipe';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatProgressBarModule, CommonModule, MsToTimePipe, MyProgressBarComponent, BigvaluePipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent implements AfterViewInit {
  product: Product = new Product();
  lastupdate: number = Date.now();
  _qtmulti: string = "x1";
  _worldmoney: number = 0;
  maxCanBuy: number = 0;
  progressbarvalue: number = 0
  server = GET_SERV;
  isBrowser = signal(false);
  productCost: number = 0;
  disabledButtonBuy: boolean = true;
  qmultiButton: string = "x1";
  run: boolean = this.product.timeleft != 0;
  auto: boolean = this.product.managerUnlocked;
  initialValue: number = 0;
  _activeAngels: number = 0;
  _bonusAngels: number = 0;
  productprice: number = 0;

  protected readonly Orientation = Orientation;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private service: WebserviceService
  ) {
    this.isBrowser.set(isPlatformBrowser(platformId));
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      setInterval(() => { this.calcScore() }, 100)
    }
  }

  // Calcul de la progression de la production
  calcScore() {
    if (this.product.quantite > 0) {
      if (this.product.timeleft != 0) {
        let timeElapsed = Date.now() - this.lastupdate;
        this.product.timeleft -= timeElapsed;
        this.lastupdate = Date.now();

        if (this.product.timeleft <= 0) {
          if (this.product.managerUnlocked) {
            this.product.timeleft = this.product.vitesse + (this.product.timeleft % this.product.vitesse);
            this.auto = true;
            this.run = true;
          }
          else {
            this.product.timeleft = 0;
            this.run = false;
          }
          this.notifyProduction.emit(this.product);
        }
      }
      else {
        if (this.product.managerUnlocked) {
          this.product.timeleft = this.product.vitesse;
          this.run = true;
        }
      }
    }
  }

  // Passage du produit depuis le composant parent
  @Input()
  set prod(value: Product) {
    if (value != undefined) {
      this.product = value;
      this.productCost = Math.round((this.product.revenu * (1 + this._activeAngels * this._bonusAngels / 100)) * 100) / 100

      if (this.product.managerUnlocked && this.product.timeleft == 0) this.run = true;
      this.auto = this.product.managerUnlocked;

      if (this.product && this.product.timeleft > 0) {
        console.log("timeleft: " + this.product.timeleft)
        this.initialValue = this.product.vitesse - this.product.timeleft;
        this.run = true;
      }
      else {
        this.initialValue = 0;
        this.run = false;
      }

      this.buyDisabled();
    }
  }

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    this.buyDisabled();
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  @Input()
  set worldmoney(value: number) {
    this._worldmoney = value;
    this.buyDisabled();
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  @Input()
  set activeAngels(value: number) {
    this._activeAngels = value;
    this.productCost = Math.round((this.product.revenu * (1 + this._activeAngels * this._bonusAngels / 100)) * 100) / 100
  }

  @Input()
  set bonusAngels(value: number) {
    this._bonusAngels = value;
    this.productCost = Math.round((this.product.revenu * (1 + this._activeAngels * this._bonusAngels / 100)) * 100) / 100
  }

  // Quantité maximale que l'on peut acheter avec l'argent actuel
  calcMaxCanBuy() {
    let numberOfItems = Math.floor(Math.log(1 + (this._worldmoney * (this.product.croissance - 1) / this.product.cout)) / Math.log(this.product.croissance));
    this.maxCanBuy = Math.round(numberOfItems);
  }

  calcUpgrade(Upgrade: Palier) {
    if (Upgrade.unlocked && Upgrade.typeratio == "vitesse") {
      this.product.vitesse = Math.round(this.product.vitesse / Upgrade.ratio);
    }
    else if (Upgrade.unlocked && Upgrade.typeratio == "gain") {
      this.product.revenu = this.product.revenu * Upgrade.ratio;
    }
  }

  getBaseLog(x: number, y: number) {
    return Math.log(y) / Math.log(x);
  }

  // Lancement d'un produit
  onClick() {
    if (this.product.quantite > 0 && !this.run) {
      this.initialValue = 0;
      this.run = true;
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
      this.service.lancerProduction(this.product.id).catch(reason =>
        console.log("erreur: " + reason)
      );
    }
  }

  // Achat d'un produit
  buyProduct() {
    if (this._worldmoney >= this.product.cout) {
      this.notifyBuy.emit([this.productCost, this.product, this.maxCanBuy]);
      if (this._qtmulti == "Max") {
        this.service.BuyqtProduct(this.product.id, this.maxCanBuy).catch(reason =>
          console.log("erreur: " + reason)
        );
      }
      else {
        this.service.BuyqtProduct(this.product.id, parseInt(this._qtmulti.slice(1))).catch(reason =>
          console.log("erreur: " + reason)
        );
      }
    }
  }

  // Test de la disponibilité de l'achat
  buyDisabled() {
    if (this.product.cout > 0) {
      switch (this._qtmulti) {
        case "x1":
          this.qmultiButton = " x1";
          this.productCost = this.product.cout * (1 - Math.pow(this.product.croissance, 1)) / (1 - this.product.croissance);
          this.productCost = Math.round(this.productCost * 100) / 100;
          if (this._worldmoney >= this.productCost) {
            this.disabledButtonBuy = false;
          }
          else {
            this.disabledButtonBuy = true;
          }
          break;
        case "x10":
          this.qmultiButton = " x10";
          this.productCost = this.product.cout * (1 - Math.pow(this.product.croissance, 10)) / (1 - this.product.croissance);
          this.productCost = Math.round(this.productCost * 100) / 100;
          if (this._worldmoney >= this.productCost) {
            this.disabledButtonBuy = false;
          }
          else {
            this.disabledButtonBuy = true;
          }
          break;
        case "x100":
          this.qmultiButton = " x100";
          this.productCost = this.product.cout * (1 - Math.pow(this.product.croissance, 100)) / (1 - this.product.croissance);
          this.productCost = Math.round(this.productCost * 100) / 100;
          if (this._worldmoney >= this.productCost) {
            this.disabledButtonBuy = false;
          }
          else {
            this.disabledButtonBuy = true;
          }
          break;
        case "Max":
          if (this.maxCanBuy > 0) {
            this.qmultiButton = " x" + this.maxCanBuy.toString();

            let priceMaxcanBuy = this.product.cout * (1 - Math.pow(this.product.croissance, this.maxCanBuy)) / (1 - this.product.croissance);
            this.productCost = Math.round(priceMaxcanBuy * 100) / 100;

            if (this._worldmoney > (priceMaxcanBuy)) {
              this.disabledButtonBuy = false;
            }
            else {
              this.disabledButtonBuy = true;
            }
          } else {
            this.qmultiButton = "x1";
            this.productCost = Math.round(this.product.cout * 100) / 100;
            this.disabledButtonBuy = (this._worldmoney < this.product.cout);
          }
          break;
        default:
          this.disabledButtonBuy = true;
          break;
      }
    }
  }


  // Evénement de fin de production
  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  // Evénement d'achat
  @Output() notifyBuy:
    EventEmitter<[productCost: number, product: Product, maxCanBuy: number]> =
    new EventEmitter<[productCost: number, product: Product, maxCanBuy: number]>();
}

