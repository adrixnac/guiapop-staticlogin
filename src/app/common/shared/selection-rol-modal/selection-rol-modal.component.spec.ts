import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionRolModalComponent } from './selection-rol-modal.component';

describe('SelectionRolModalComponent', () => {
  let component: SelectionRolModalComponent;
  let fixture: ComponentFixture<SelectionRolModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionRolModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionRolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
