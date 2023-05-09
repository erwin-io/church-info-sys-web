import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriestAddComponent } from './priest-add.component';

describe('PriestAddComponent', () => {
  let component: PriestAddComponent;
  let fixture: ComponentFixture<PriestAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriestAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
