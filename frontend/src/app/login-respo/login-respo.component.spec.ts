import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRespoComponent } from './login-respo.component';

describe('LoginRespoComponent', () => {
  let component: LoginRespoComponent;
  let fixture: ComponentFixture<LoginRespoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginRespoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRespoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
