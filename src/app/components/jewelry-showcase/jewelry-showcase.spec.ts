import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelryShowcase } from './jewelry-showcase';

describe('JewelryShowcase', () => {
  let component: JewelryShowcase;
  let fixture: ComponentFixture<JewelryShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JewelryShowcase],
    }).compileComponents();

    fixture = TestBed.createComponent(JewelryShowcase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
