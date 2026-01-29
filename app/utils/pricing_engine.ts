import Promo from "#models/promo";

export default class pricingEngine {
  /**
   * Calculate the final price after applying the promo discount
   */
  calculatePromo(price: number, promo: Promo){
    switch (promo.discountType) {
      case "percentage":
        return price - (price * promo.discountValue / 100);
      case "fixed":
        return price - promo.discountValue;
      default:
        return price;
    }
  }
}
