export class GildedTros {
    #DEFAULT_DEGRADE_RATE = 1;
    
    constructor(items) {
        this.items = items;
    }
    
    /**
     * Returns the quality of an item with a fixed lower (0) and upper (50) limit.
     * @param {number} quality
     * @return {number}
     */
    #getQualityLimit = (quality) => {
        if (quality <= 0) return 0;
        if (quality >= 50) return 50;
        return quality;
    };
    
    /**
     * Updates the properties of an item at the end of the day.
     */
    updateQuality() {
        this.items.forEach(item => {
            /* Day 0 is the day the item was added (we don't know exactly when during the day it was added
             * so day 0 does not count towards the degrading of the item).
             * As this function runs at the end of the day, we decrease the sellIn first, so we can work with
             * the actual remaining days.
             */
            item.sellIn--;
            
            // If sellIn has passed, quality degrades twice as fast.
            let degradeRate = item.sellIn <= 0 ? this.#DEFAULT_DEGRADE_RATE * 2 : this.#DEFAULT_DEGRADE_RATE;
            
            // Set default quality rate.
            let qualityRate = 1;
            
            switch (item.name) {
                case "B-DAWG Keychain":
                    /* Legendary items do not decrease quality,
                     * nor need to be sold, so we keep their sellIn infinitely fresh.
                     * This will provide future safety if any other code that alters the sellIn date
                     * should be added in the future.
                     */
                    item.sellIn = Infinity;
                    break;
                case "Backstage passes for Re:Factor":
                case "Backstage passes for HAXX":
                    // 'Backstage passes' increases in quality until sell date, so we adjust the quality rate.
                    if (item.sellIn <= 10) qualityRate = 2;
                    if (item.sellIn <= 5) qualityRate = 3;
                    // Calculate the new quality.
                    let itemQuality = item.quality + qualityRate;
                    // Quality drops to 0 when sellIn date is passed.
                    if (item.sellIn <= 0) itemQuality = 0;
                    item.quality = this.#getQualityLimit(itemQuality);
                    break;
                case "Good Wine":
                    /* Requirements do not state specifically that quality of wine increases twice as fast
                     * after it's sellIn date has expired. But the original code implements this as well.
                     */
                    if (item.sellIn < 0) qualityRate *= 2;
                    // 'Good wine' increases in quality.
                    item.quality += qualityRate;
                    item.quality = this.#getQualityLimit(item.quality);
                    break;
                case "Duplicate Code":
                case "Long Methods":
                case "Ugly Variable Names":
                    // These items degrade in quality twice as fast as normal items.
                    degradeRate *= 2;
                    item.quality -= degradeRate;
                    item.quality = this.#getQualityLimit(item.quality);
                    break;
                default:
                    // Normal items decrease in quality.
                    item.quality -= degradeRate;
                    item.quality = this.#getQualityLimit(item.quality);
            }
        });
    }
}
