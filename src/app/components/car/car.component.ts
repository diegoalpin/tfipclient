import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { CarDataSource, CarItem } from './car-datasource';
import { Maintenance } from 'src/app/models/maintenance.model';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit,OnDestroy {
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatTable) table!: MatTable<CarItem>;
  // dataSource: CarDataSource;

  // /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  // displayedColumns = ['id', 'name', 'status','date', 'price','action'];

  // constructor() {
  //   this.dataSource = new CarDataSource();
  // }
  
  // ngAfterViewInit(): void {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  //   this.table.dataSource = this.dataSource;
  // }
  carId!:number
  car!: Car
  maintenances: Maintenance[] = [];
  sortedMaintenance: Maintenance[] = [];
  sortColumn!: string;
  ascending = false;
  currentPage = 1;
  pageSize = 2;
  totalCost!: number
  carSubs!:Subscription
  maintSubs!: Subscription

  constructor(private carSvc:CarService, private maintSvc:MaintenanceService,
    private loadingSvc: LoadingService,
    private activatedRoute: ActivatedRoute, private router: Router){}
  
    ngOnDestroy(): void {

    }
    async ngOnInit() {
    const carId = this.activatedRoute.snapshot.params['id'];
    this.carId = carId;
    const car$ = this.carSvc.getCarById(carId);
    const loadingcar$ = this.loadingSvc.showLoaderUntilCompleted(car$)
    await firstValueFrom(loadingcar$).then(response=>{
      this.car = response;
      console.log(response);
    });

    const maintenances$ = this.maintSvc.getMaintenancesByCarId(carId);
    const loadingMaints$ = this.loadingSvc.showLoaderUntilCompleted(maintenances$); 
    await firstValueFrom(loadingMaints$).then(response =>{
      this.maintenances.push(...response);
      console.log(response)
    });
   
    this.totalCost = this.getTotalCost();
    console.log(this.totalCost);
    this.sortedMaintenance = this.maintenances;
  }
  getTotalCost(): number {
    var totalCost = 0
    for(let maintenance of this.maintenances){
      if(maintenance.cost!=undefined)
        totalCost+= maintenance.cost
    }
    return totalCost;
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

  addMaintenance(){
    this.router.navigate(['/maintenance','add'],{ queryParams: { carId: this.carId }});
  }

  view(id:number){
    this.router.navigate(['/maintenance',id])
  }
  edit(id:number){
    this.router.navigate(['/maintenance','edit',id],{ queryParams: { carId: this.carId }});
  }
  async delete(maintId:number){
    await firstValueFrom(this.maintSvc.deleteMaintenance(maintId)).then(result=>{
      alert(result);
    })
    this.router.navigate(['/car',this.carId]);
  }
}
