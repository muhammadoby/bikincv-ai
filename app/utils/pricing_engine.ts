import Promo from "#models/promo";

export default class pricingEngine {
  /**
   * Calculate the final price after applying the promo discount
   */
  calculatePromo(price: number, promo: Promo) {
    switch (promo.discountType) {
      case "percentage":
        return price - (price * promo.discountValue / 100);
      case "fixed":
        return price - promo.discountValue;
      default:
        return price;
    }
  }

  /**
   * Calculate ai discount
   */
  calculateAiDiscount(finalPrice: number, discount: number, discountType: "percentage" | "fixed") {
    switch (discountType) {
      case 'percentage':
        finalPrice = finalPrice - (finalPrice * discount / 100);
        break;
      case 'fixed':
        finalPrice = finalPrice - discount;

        break;

      default:
        finalPrice = finalPrice;
        break;
    }

    return finalPrice
  }
}
