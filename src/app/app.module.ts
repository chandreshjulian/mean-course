import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClientModule,
  ɵHttpInterceptingHandler,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderConmponent } from './header/header.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';

@NgModule({
  declarations: [AppComponent, ErrorComponent, HeaderConmponent],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule, // added after @angular/material
    BrowserModule,
    HttpClientModule,
    PostsModule, // custom modules
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent], // if any component is going to be created dynamically
})
export class AppModule {}

// import { PostsService } from './posts/posts.service' // and add it to the `providers`
