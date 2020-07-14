import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBorrarVoluntarioComponent } from './modal-borrar-voluntario.component';

describe('ModalBorrarVoluntarioComponent', () => {
  let component: ModalBorrarVoluntarioComponent;
  let fixture: ComponentFixture<ModalBorrarVoluntarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBorrarVoluntarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBorrarVoluntarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
