import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FootfallComponent } from './footfall.component';

describe('FootfallComponent', () => {
  let component: FootfallComponent;
  let fixture: ComponentFixture<FootfallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FootfallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FootfallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
