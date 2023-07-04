import { Transaction } from 'sequelize';

export interface EnvConfig {
  // REDIS_PASS: string;
  [name: string]: string;
}

export interface TransactionOpts {
  transaction: Transaction;
}

