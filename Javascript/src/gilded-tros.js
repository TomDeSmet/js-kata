export class GildedTros {
    #DEFAULT_DEGRADE_RATE = 1;
    
    constructor(items) {
        this.items = items;
    }
    
    #decreaseSellIn = (item) => {
        item.sellIn--;
    };
    
    #setLimitsToQuality = (quality) => {
        if (quality <= 0) return 0;
        if (quality >= 50) return 50;
        return quality;
    };
    
    updateQuality() {
        this.items.forEach(item => {
            // If sellIn has passed, quality degrades twice as fast.
            let degradeRate = item.sellIn <= 0 ? this.#DEFAULT_DEGRADE_RATE * 2 : this.#DEFAULT_DEGRADE_RATE;
            
            switch (item.name) {
                case "B-DAWG Keychain":
                    // Legendary items do not decrease quality nor need to be sold.
                    break;
                case "Backstage passes for Re:Factor":
                case "Backstage passes for HAXX":
                    /* Day 0 is the day the item was added (we don't know exactly when during the day it was added
                     * so day 0 does not count towards the degrading of the item).
                     * As this function runs at the end of the day, we decrease the sellIn first, so we can work with
                     * the actual remaining days.
                     * For this product type, this means the quality of the product needs to be 0 at the end of the day
                     * as the conference is over by the end and tickets will be useless.
                     */
                    this.#decreaseSellIn(item);
                    
                    // Set default quality rate.
                    let qualityRate = 1;
                    // 'Backstage passes' increases in quality until sell date, so we adjust the quality rate.
                    if (item.sellIn <= 10) qualityRate = 2;
                    if (item.sellIn <= 5) qualityRate = 3;
                    // Calculate the new quality.
                    let itemQuality = item.quality + qualityRate;
                    // Quality drops to 0 when sellIn date is passed.
                    if (item.sellIn <= 0) itemQuality = 0;

                    item.quality = this.#setLimitsToQuality(itemQuality);
                    break;
                case "Good Wine":
                    this.#decreaseSellIn(item);
                    // 'Good wine' increases in quality.
                    if (item.quality < 50) item.quality++;
                    break;
                case "Duplicate Code":
                case "Long Methods":
                case "Ugly Variable Names":
                    this.#decreaseSellIn(item);
                    // These items degrade in quality twice as fast as normal items.
                    degradeRate *= 2;
                    item.quality -= degradeRate;
                    item.quality = this.#setLimitsToQuality(item.quality);
                    break;
                default:
                    this.#decreaseSellIn(item);
                    // Normal items decrease in quality.
                    item.quality -= degradeRate;
                    item.quality = this.#setLimitsToQuality(item.quality);
            }
        });
    }
}
