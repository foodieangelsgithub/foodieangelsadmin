import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBorrarAdministradorComponent } from './modal-borrar-administrador.component';

describe('ModalBorrarAdministradorComponent', () => {
  let component: ModalBorrarAdministradorComponent;
  let fixture: ComponentFixture<ModalBorrarAdministradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBorrarAdministradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBorrarAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
