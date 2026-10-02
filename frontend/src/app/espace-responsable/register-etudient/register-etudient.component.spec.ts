import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEtudientComponent } from './register-etudient.component';

describe('RegisterEtudientComponent', () => {
  let component: RegisterEtudientComponent;
  let fixture: ComponentFixture<RegisterEtudientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterEtudientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterEtudientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
