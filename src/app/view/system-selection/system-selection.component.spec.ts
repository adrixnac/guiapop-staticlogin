import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSelectionComponent } from './system-selection.component';

describe('SystemSelectionComponent', () => {
  let component: SystemSelectionComponent;
  let fixture: ComponentFixture<SystemSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
