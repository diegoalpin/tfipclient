import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Maintenance } from 'src/app/models/maintenance.model';
import { User } from 'src/app/models/user.model';
import { LoadingService } from 'src/app/services/loading.service';
import { MaintenanceService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-maintenance-all',
  templateUrl: './maintenance-all.component.html',
  styleUrls: ['./maintenance-all.component.css'],
})
export class MaintenanceAllComponent implements OnInit {
  maintenances: Maintenance[] = [];
  sortedMaintenance: Maintenance[] = [];
  sortColumn!: string;
  ascending = false;
  currentPage = 1;
  pageSize = 2;
  carPlate: string = "S128140";
  user = new User();
  
  constructor(private loadingSvc:LoadingService, private maintSvc:MaintenanceService){}
  
  async ngOnInit(){
    if(sessionStorage.getItem('userdetails')){
      this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
    }
    const maintenances$ = this.maintSvc.getMaintenancesByEmail(this.user.email);
    const loadingMaint$ = this.loadingSvc.showLoaderUntilCompleted(maintenances$)
    await firstValueFrom(loadingMaint$).then(response=>{
      this.maintenances = response
      console.log(response);
    });

    this.maintenances = this.getCarId(this.maintenances);
    
    this.sortedMaintenance = this.maintenances;
  }
  getCarId(maintenances: Maintenance[]):Maintenance[] {
    for(let maint of maintenances){
      firstValueFrom(this.maintSvc.getCarIdByMaintId(maint.id)).then(response=>{
        maint.carId = response;
      })
    }
    return maintenances;
  }

  public sort(column: string) {
    if (this.sortColumn === column) {
      this.ascending = !this.ascending;
    } else {
      this.sortColumn = column;
      this.ascending = false;
    }
    this.sortedMaintenance = this.sortByColumn(
      this.maintenances,
      this.sortColumn,
      this.ascending
    );
  }

  private sortByColumn(
    array: any[],
    column: string,
    ascending: boolean
  ): Maintenance[] {
    return array.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return ascending ? bValue - aValue : aValue - bValue;
      } 
      else if (aValue instanceof Date && bValue instanceof Date) {
        return ascending ? 
        bValue.getTime() - aValue.getTime() :
        aValue.getTime() - bValue.getTime();
      } 
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return ascending?
          bValue.localeCompare(aValue):
          aValue.localeCompare(bValue);
      } else {
        return 0;
      }

      // const comparison = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
      // return ascending ? -comparison : comparison;
    });
  }

  get totalPages() {
    return Math.ceil(this.maintenances.length / this.pageSize);
  }
  
  view(id:number){
    alert("view clicked");
  }
  edit(id:number){
    alert("edit clicked "+id);
  }
  delete(id:number){
    alert("delete clicked"+id);
  }
}
