import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarHorarioComponent } from './modal-editar-horario.component';

describe('ModalEditarHorarioComponent', () => {
  let component: ModalEditarHorarioComponent;
  let fixture: ComponentFixture<ModalEditarHorarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditarHorarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditarHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
