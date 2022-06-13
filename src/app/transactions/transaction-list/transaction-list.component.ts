import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";

import { Transaction } from "../transaction.model";
import { TransactionService } from "../transactions.service";

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy{
  private tranSub: Subscription;
  transactions: Transaction[] = [];
  displayedColumns: string[] = ['date', 'name', 'amount'];
  isLoading = false;

  balance = 0;
  totalCount = 0;

  pageSizeOptions = [5, 10, 20];
  transPerPage = 10;
  currentPage = 0;

  constructor(public transactionServce: TransactionService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.transactionServce.getTransactions(this.transPerPage, this.currentPage);
    this.tranSub = this.transactionServce.getTransactionUpdateListner()
      .subscribe((data: {transactions: Transaction[], totalCount: number, balance: number}) => {
        this.transactions = data.transactions;
        this.balance = data.balance;
        this.totalCount = data.totalCount;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.tranSub.unsubscribe();
  }

  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex;
    this.transPerPage = pageData.pageSize;
    this.transactionServce.getTransactions(this.transPerPage, this.currentPage);
  }

}
