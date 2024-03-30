import { Injectable } from '@angular/core';
import { createClient, fetchExchange } from '@urql/core';
import { BUY_CASH_UPGRADE, GET_WORLD, LANCER_PRODUCTION, HIRE_MANAGER, BUY_QT_PRODUIT, RESET_WORLD, BUY_ANGEL_UPGRADE } from './grapqhrequests';
import { Product } from './world';

@Injectable({
  providedIn: 'root',
})
export class WebserviceService {

  server = 'http://localhost:4000/';
  user = "";

  constructor() { }

  createClient() {
    return createClient({
      url: this.server + "graphql",
      exchanges: [fetchExchange],
      fetchOptions: () => {
        return {
          headers: { 'x-user': this.user },
        };
      },
    });
  }

  public setUser(user: string) {
    this.user = user;
  }

  getWorld() {
    return this.createClient().query(GET_WORLD, {}).toPromise();
  }

  lancerProduction(id: number) {
    return this.createClient().mutation(LANCER_PRODUCTION,
      { id: id }).toPromise();
  }

  buyManager(palier: any) {
    return this.createClient().mutation(HIRE_MANAGER,
      { name: palier.name }).toPromise();
  }

  buyUpgrade(palier: any) {
    return this.createClient().mutation(BUY_CASH_UPGRADE,
      { name: palier.name }).toPromise();
  }

  BuyqtProduct(idProduct: number, qtmulti: number) {
    return this.createClient().mutation(BUY_QT_PRODUIT,
      { id: idProduct, quantite: qtmulti }).toPromise();
  }

  buyAngelUpgrade(palier: any) {
    return this.createClient().mutation(BUY_ANGEL_UPGRADE,
      { name: palier.name }).toPromise();
  }

  resetWorld() {
    return this.createClient().mutation(RESET_WORLD, {}).toPromise();
  }
}
