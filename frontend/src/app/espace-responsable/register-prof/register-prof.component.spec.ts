import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProfComponent } from './register-prof.component';

describe('RegisterProfComponent', () => {
  let component: RegisterProfComponent;
  let fixture: ComponentFixture<RegisterProfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterProfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
