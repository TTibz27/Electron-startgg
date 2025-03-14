import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectToOBSComponent } from './connect-to-obs.component';

describe('ConnectToOBSComponent', () => {
  let component: ConnectToOBSComponent;
  let fixture: ComponentFixture<ConnectToOBSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectToOBSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectToOBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
