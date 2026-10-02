import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixRoleComponent } from './choix-role.component';

describe('ChoixRoleComponent', () => {
  let component: ChoixRoleComponent;
  let fixture: ComponentFixture<ChoixRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoixRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoixRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
