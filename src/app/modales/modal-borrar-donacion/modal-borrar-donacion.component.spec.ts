import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBorrarDonacionComponent } from './modal-borrar-donacion.component';

describe('ModalBorrarDonacionComponent', () => {
  let component: ModalBorrarDonacionComponent;
  let fixture: ComponentFixture<ModalBorrarDonacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBorrarDonacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBorrarDonacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
