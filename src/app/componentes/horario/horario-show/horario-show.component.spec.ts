import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioShowComponent } from './horario-show.component';

describe('HorarioShowComponent', () => {
  let component: HorarioShowComponent;
  let fixture: ComponentFixture<HorarioShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorarioShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
