import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrainCalendarComponent } from './terrain-calendar.component';

describe('TerrainCalendarComponent', () => {
  let component: TerrainCalendarComponent;
  let fixture: ComponentFixture<TerrainCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerrainCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerrainCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
