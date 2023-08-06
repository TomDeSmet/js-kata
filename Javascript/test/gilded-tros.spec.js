import { Item } from '../src/item';
import { GildedTros } from '../src/gilded-tros';

describe('GildedTros', () => {
  test('SellIn time reduces by 1.', () => {
    const items = [new Item('Random item', 10, 20)];
    const item = getTestItem(items);
    expect(item.sellIn).toBe(9);
  });
  
  test('Quality degrades.', () => {
    const items = [new Item('Random item', 10, 20)];
    const item = getTestItem(items);
    expect(item.quality).toBe(19);
  });
  
  test('Quality degrades twice as fast after sellIn passed.', () => {
    const items = [new Item('Ring of Cleansening Code', 0, 20)];
    const item = getTestItem(items);
    expect(item.quality).toBe(18);
  });
  
  test('Quality never degrades for good wine.', () => {
    const items = [new Item('Good Wine', 2, 5)];
    const item = getTestItem(items);
    expect(item.quality).toBe(6);
  });
  
  test('Quality is never negative.', () => {
    const items = [new Item('Ring of Cleansening Code', 10, -10)];
    const item = getTestItem(items);
    expect(item.quality).toBeGreaterThanOrEqual(0);
  });
  
  test('Quality is never greater than 50.', () => {
    const items = [new Item('Ring of Cleansening Code', 10, 60)];
    const item = getTestItem(items);
    expect(item.quality).toBeLessThanOrEqual(50);
  });
  
  test('Legendary quality is always 80.', () => {
    const items = [new Item('B-DAWG Keychain', 10, 80)];
    const item = getTestItem(items);
    expect(item.quality).toBe(80);
  });
  
  test('Legendary never has to be sold.', () => {
    const items = [new Item('B-DAWG Keychain', -5, 80)];
    const item = getTestItem(items);
    expect(item.sellIn).toBe(Infinity);
  });
  
  test('Backstage passes increases in quality.', () => {
    const items = [new Item('Backstage passes for Re:Factor', 20, 10)];
    const item = getTestItem(items);
    expect(item.quality).toBe(11);
  });
  
  test('Backstage passes increases in quality - 10 days.', () => {
    const items = [new Item('Backstage passes for Re:Factor', 10, 10)];
    const item = getTestItem(items);
    expect(item.quality).toBe(12);
  });
  
  test('Backstage passes increases in quality - 5 days.', () => {
    const items = [new Item('Backstage passes for Re:Factor', 5, 10)];
    const item = getTestItem(items);
    expect(item.quality).toBe(13);
  });
  
  test('Backstage passes looses quality - 0 days.', () => {
    const items = [new Item('Backstage passes for Re:Factor', 0, 10)];
    const item = getTestItem(items);
    expect(item.quality).toBe(0);
  });
  
  test('Backstage passes looses quality - 1 day.', () => {
    const items = [new Item('Backstage passes for Re:Factor', 1, 10)];
    const item = getTestItem(items);
    expect(item.quality).toBeGreaterThanOrEqual(0);
  });
  
  test('Smelly items degrade twice as fast.', () => {
    const items = [new Item('Duplicate Code', 10, 10)];
    const item = getTestItem(items);
    expect(item.quality).toBe(8);
  });
});

const getTestItem = (items) => {
  const app = new GildedTros(items);
  app.updateQuality();
  return app.items[0];
};
