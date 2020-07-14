import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBorrarBeneficiarioComponent } from './modal-borrar-beneficiario.component';

describe('ModalBorrarBeneficiarioComponent', () => {
  let component: ModalBorrarBeneficiarioComponent;
  let fixture: ComponentFixture<ModalBorrarBeneficiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBorrarBeneficiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBorrarBeneficiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
