import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUsComponent } from './dashboard-us.component';

describe('DashboardUsComponent', () => {
  let component: DashboardUsComponent;
  let fixture: ComponentFixture<DashboardUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardUsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
