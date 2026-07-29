/**
 * String helpers
 */
export default class StringHelpers {
    static formatCurrency(value: number){
       return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
    }
}
