import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapSummaryComponent } from './heatmap-summary.component';

describe('HeatmapSummaryComponent', () => {
  let component: HeatmapSummaryComponent;
  let fixture: ComponentFixture<HeatmapSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatmapSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatmapSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
