import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownElementComponent } from './drop-down-element.component';

describe('DropDownElementComponent', () => {
  let component: DropDownElementComponent;
  let fixture: ComponentFixture<DropDownElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropDownElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
