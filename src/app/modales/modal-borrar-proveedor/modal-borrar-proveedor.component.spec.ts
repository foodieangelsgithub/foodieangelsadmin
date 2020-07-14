import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBorrarProveedorComponent } from './modal-borrar-proveedor.component';

describe('ModalBorrarProveedorComponent', () => {
  let component: ModalBorrarProveedorComponent;
  let fixture: ComponentFixture<ModalBorrarProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBorrarProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBorrarProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
