import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SucessViewComponent } from './sucess-view.component';

describe('SucessViewComponent', () => {
  let component: SucessViewComponent;
  let fixture: ComponentFixture<SucessViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucessViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
