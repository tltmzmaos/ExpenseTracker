import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Transaction } from './transaction.model';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const API_URL = environment.apiUrl + '/transactions';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private transactions: Transaction[] = [];
  private transUpdated = new Subject<{ transactions: Transaction[], totalCount: number, balance: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getTransactionUpdateListner() {
    return this.transUpdated.asObservable();
  }

  getTransactions(transPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${transPerPage}&page=${currentPage}`;
    this.http
      .get<{
        status: string;
        message: string;
        balance: number;
        totalCount: number;
        transactions: any;
      }>(API_URL + queryParams)
      .pipe(
        map((data) => {
          return {
            transactions: data.transactions.map(tran => {
              return {
                id: tran._id,
                amount: tran.amount * -1,
                date: tran.date,
                category: tran.category,
                name: tran.name,
                location: tran.location,
              };
            }),
            balance: data.balance,
            totalCount: data.totalCount,
          };
        })
      )
      .subscribe((transformedData) => {
        this.transactions = transformedData.transactions;
        this.transUpdated.next({ transactions: [...this.transactions], totalCount: transformedData.totalCount, balance: transformedData.balance });
      });
  }
}
