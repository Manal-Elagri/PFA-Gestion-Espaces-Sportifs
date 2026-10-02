import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutBienvenuComponent } from './layout-bienvenu.component';

describe('LayoutBienvenuComponent', () => {
  let component: LayoutBienvenuComponent;
  let fixture: ComponentFixture<LayoutBienvenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutBienvenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutBienvenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
