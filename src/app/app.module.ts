import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './shared/auth.interceptor';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';

@NgModule({
  declarations: [
    AppComponent,
    AiAssistantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AuthModule,
    AdminModule
  ],
  providers: [
    // Interceptor burada kayıtlı olmalı!
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
