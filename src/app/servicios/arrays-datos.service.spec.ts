import { TestBed } from '@angular/core/testing';

import { ArraysDatosService } from './arrays-datos.service';

describe('ArraysDatosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArraysDatosService = TestBed.get(ArraysDatosService);
    expect(service).toBeTruthy();
  });
});
