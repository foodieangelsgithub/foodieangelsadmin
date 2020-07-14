import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioEditComponent } from './horario-edit.component';

describe('HorarioEditComponent', () => {
  let component: HorarioEditComponent;
  let fixture: ComponentFixture<HorarioEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorarioEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
