export class GildedTros {
    #DEFAULT_DEGRADE_RATE = 1;
    
    constructor(items) {
        this.items = items;
    }
    
    updateQuality() {
        const decreaseSellIn = (item) => {
            item.sellIn--;
        };
        
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
                    decreaseSellIn(item);
                    
                    // Set default quality rate.
                    let qualityRate = 1;
                    // 'Backstage passes' increases in quality until sell date, so we adjust the quality rate.
                    if (item.sellIn <= 10) qualityRate = 2;
                    if (item.sellIn <= 5) qualityRate = 3;
                    // Calculate the new quality.
                    let itemQuality = item.quality + qualityRate;
                    // Quality drops to 0 when sellIn date is passed.
                    if (item.sellIn <= 0) itemQuality = 0;
                    // Quality can not be over 50. TODO: Abstract this for every item except legendary?
                    item.quality = Math.min(itemQuality, 50);
                    break;
                case "Good Wine":
                    decreaseSellIn(item);
                    // 'Good wine' increases in quality.
                    if (item.quality < 50) item.quality++;
                    break;
                case "Duplicate Code":
                case "Long Methods":
                case "Ugly Variable Names":
                    decreaseSellIn(item);
                    // These items degrade in quality twice as fast as normal items.
                    degradeRate *= 2;
                    if (item.quality > 0) item.quality -= degradeRate;
                    break;
                default:
                    decreaseSellIn(item);
                    // Normal items decrease in quality.
                    if (item.quality > 0) item.quality -= degradeRate;
            }
        });
        
        /*
        for (let i = 0; i < this.items.length; i++) {
            if (
                this.items[i].name != "Good Wine" &&
                this.items[i].name != "Backstage passes for Re:Factor" &&
                this.items[i].name != "Backstage passes for HAXX"
            ) {
                if (this.items[i].quality > 0) {
                    if (this.items[i].name != "B-DAWG Keychain") {
                        this.items[i].quality = this.items[i].quality - 1;
                    }
                }
            } else {
                if (this.items[i].quality < 50) {
                    this.items[i].quality = this.items[i].quality + 1;
                    
                    if (this.items[i].name == "Backstage passes for Re:Factor") {
                        if (this.items[i].sellIn < 11) {
                            if (this.items[i].quality < 50) {
                                this.items[i].quality = this.items[i].quality + 1;
                            }
                        }
                        
                        if (this.items[i].sellIn < 6) {
                            if (this.items[i].quality < 50) {
                                this.items[i].quality = this.items[i].quality + 1;
                            }
                        }
                    }
                }
            }
            
            if (this.items[i].name != "B-DAWG Keychain") {
                this.items[i].sellIn = this.items[i].sellIn - 1;
            }
            
            if (this.items[i].sellIn < 0) {
                if (this.items[i].name != "Good Wine") {
                    if (
                        this.items[i].name != "Backstage passes for Re:Factor" ||
                        this.items[i].name != "Backstage passes for HAXX"
                    ) {
                        if (this.items[i].quality > 0) {
                            if (this.items[i].name != "B-DAWG Keychain") {
                                this.items[i].quality = this.items[i].quality - 1;
                            }
                        }
                    } else {
                        this.items[i].quality =
                            this.items[i].quality - this.items[i].quality;
                    }
                } else {
                    if (this.items[i].quality < 50) {
                        this.items[i].quality = this.items[i].quality + 1;
                    }
                }
            }
        }
        */
    }
}
