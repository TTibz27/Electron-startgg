import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectToGoogleSheetsComponent } from './connect-to-google-sheets.component';

describe('ConnectToGoogleSheetsComponent', () => {
  let component: ConnectToGoogleSheetsComponent;
  let fixture: ComponentFixture<ConnectToGoogleSheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectToGoogleSheetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectToGoogleSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
