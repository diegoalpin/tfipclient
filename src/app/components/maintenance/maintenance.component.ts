import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {
  MaintenanceDataSource,
  MaintenanceItem,
} from './maintenance-datasource';
import { Maintenance } from 'src/app/models/maintenance.model';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/item.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { ItemList } from 'src/app/models/itemlist.model';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css'],
})
export class MaintenanceComponent implements OnInit, OnDestroy {
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatTable) table!: MatTable<MaintenanceItem>;
  // dataSource: MaintenanceDataSource;

  // /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  // displayedColumns = ['id', 'name'];

  // constructor() {
  //   this.dataSource = new MaintenanceDataSource();
  // }

  // ngAfterViewInit(): void {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  //   this.table.dataSource = this.dataSource;
  // }
  maintenance!: Maintenance;
  items: Item[] = [];
  sortedItems: Item[] = [];
  itemListArray:ItemList[] = [];
  sortedItemListArray:ItemList[]=[]
  // maintenances: Maintenance[] = [];
  // sortedMaintenance: Maintenance[] = [];
  sortColumn!: string | 'id';
  ascending = false;
  currentPage = 1;
  pageSize = 2;
  maintSubs!: Subscription;
  itemsSubs!: Subscription;
  maintId!: number
  carId!:number
  constructor(
    private maintSvc: MaintenanceService,
    private activatedRoute: ActivatedRoute,
    private itemSvc: ItemService,
    private loadingSvc: LoadingService,
    private router:Router
  ) {}

  async ngOnInit() {
    this.maintId = this.activatedRoute.snapshot.params['id'];
    await firstValueFrom(this.maintSvc.getCarIdByMaintId(this.maintId)).then(result=>
      {
        this.carId = result
      })
    const maintenance$ = this.maintSvc.getMaintenanceById(this.maintId);
    const loadMaintenance$ =
      this.loadingSvc.showLoaderUntilCompleted(maintenance$);

    const items$ = this.itemSvc.getItemsByMaintId(this.maintId);
    const loadItems$ = this.loadingSvc.showLoaderUntilCompleted(items$);

    await firstValueFrom(loadMaintenance$).then((response) => {
      this.maintenance = response;
      console.log(response);
    });
    await firstValueFrom(loadItems$).then((response) => {
      this.itemListArray = response;
      console.log(response);
    });
    this.maintenance.cost = await this.getItemsCost();
    // this.sortedItems = this.items;
    this.sortedItemListArray = this.itemListArray;
  }
  ngOnDestroy(): void {
    // this.maintSubs.unsubscribe();
    // this.itemsSubs.unsubscribe();
  }

  public getItemsCost(): number {
    var cost = 0;
    for (let itemList of this.itemListArray) {
      if(itemList.quantity!=undefined)
        cost += itemList.item.price*itemList.quantity;
    }
    return cost;
  }
  public sort(column: string) {
    if (this.sortColumn === column) {
      this.ascending = !this.ascending;
    } else {
      this.sortColumn = column;
      this.ascending = false;
    }
    this.sortedItemListArray = this.sortByColumn(
      this.itemListArray,
      this.sortColumn,
      this.ascending
    );
  }

  private sortByColumn(
    array: any[],
    column: string,
    ascending: boolean
  ): ItemList[] {
    return array.sort((a, b) => {
      const aValue = a.item[column];
      const bValue = b.item[column];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return ascending ? bValue - aValue : aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        return ascending
          ? bValue.getTime() - aValue.getTime()
          : aValue.getTime() - bValue.getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return ascending
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      } else {
        return 0;
      }
    });
  }
  
  goToEdit(){
    this.router.navigate(['/maintenance','edit',this.maintId],{queryParams:{carId:this.carId}})
  }

  get totalPages() {
    return Math.ceil(this.itemListArray.length / this.pageSize);
  }
}
