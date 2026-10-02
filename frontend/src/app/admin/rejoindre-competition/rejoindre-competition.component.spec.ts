import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejoindreCompetitionComponent } from './rejoindre-competition.component';

describe('RejoindreCompetitionComponent', () => {
  let component: RejoindreCompetitionComponent;
  let fixture: ComponentFixture<RejoindreCompetitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejoindreCompetitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejoindreCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
