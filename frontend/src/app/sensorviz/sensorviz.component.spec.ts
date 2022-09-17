import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorvizComponent } from './sensorviz.component';

describe('SensorvizComponent', () => {
  let component: SensorvizComponent;
  let fixture: ComponentFixture<SensorvizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorvizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorvizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
