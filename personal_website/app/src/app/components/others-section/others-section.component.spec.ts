import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersSectionComponent } from './others-section.component';

describe('OthersSectionComponent', () => {
  let component: OthersSectionComponent;
  let fixture: ComponentFixture<OthersSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OthersSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OthersSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
