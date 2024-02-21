import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperiencesSectionComponent } from './experiences-section.component';

describe('ExperiencesSectionComponent', () => {
  let component: ExperiencesSectionComponent;
  let fixture: ComponentFixture<ExperiencesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperiencesSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExperiencesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
