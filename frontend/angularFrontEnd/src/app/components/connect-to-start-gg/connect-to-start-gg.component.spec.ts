import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectToStartGGComponent } from './connect-to-start-gg.component';

describe('ConnectToStartGGComponent', () => {
  let component: ConnectToStartGGComponent;
  let fixture: ComponentFixture<ConnectToStartGGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectToStartGGComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectToStartGGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
