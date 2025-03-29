import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectToSammiModComponent } from './connect-to-sammi-mod.component';

describe('ConnectToSammiModComponent', () => {
  let component: ConnectToSammiModComponent;
  let fixture: ComponentFixture<ConnectToSammiModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectToSammiModComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectToSammiModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
