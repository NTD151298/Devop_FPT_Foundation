import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnersRoutingModule } from './partners-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POSServices } from 'src/services/pos/pos.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPrintModule } from 'ngx-print';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { PartnerDetailComponent } from './partner-detail/partner-detail.component';
import { PartnerCreateComponent } from './partner-create/partner-create.component';

@NgModule({
  declarations: [
    PartnerListComponent,
    PartnerDetailComponent,
    PartnerCreateComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PartnersRoutingModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    PaginatorModule,
    CalendarModule,
    InputTextareaModule,
    TooltipModule,
    CheckboxModule,
    RadioButtonModule,
    NgxPrintModule,
    PaginatorModule,
    AutoCompleteModule,
    PaginationModule.forRoot(),
    SharedModule,
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [POSServices, Location],
})
export class PartnersModule {}
