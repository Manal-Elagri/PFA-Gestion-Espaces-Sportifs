import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonEspacePopupComponent } from './mon-espace-popup.component';

describe('MonEspacePopupComponent', () => {
  let component: MonEspacePopupComponent;
  let fixture: ComponentFixture<MonEspacePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonEspacePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonEspacePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
