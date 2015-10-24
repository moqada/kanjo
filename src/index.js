import AWS from 'aws-sdk';
import csv from 'fast-csv';

const PADDING_BASE_NUM = 10;


/**
 * Record
 */
class Record {

  /**
   * constructor
   *
   * @param {Object} row row of CSV
   */
  constructor(row) {
    this.isPayer = !row.LinkedAccountId;
    this.productCode = row.ProductCode;
    this.totalCost = Number.parseFloat(row.TotalCost);
    this.isTotal = Array.includes(['AccountTotal', 'StatementTotal'], row.RecordType);
    this.isService = Array.includes(['PayerLineItem', 'LinkedLineItem'], row.RecordType);
    this.accountId = row.LinkedAccountId || row.PayerAccountId;
    this.accountName = row.LinkedAccountName || row.PayerAccountName;
  }
}


/**
 * Bill
 */
class Bill {

  /**
   * constructor
   *
   * @param {Record} record initial data
   */
  constructor(record) {
    this.accountId = record.accountId;
    this.accountName = record.accountName;
    this.isPayer = record.isPayer;
    this.totalCost = 0;
    this.products = {};
  }

  get sortedProducts() {
    return Object.keys(this.products).map(code => {
      return {
        code,
        shortCode: code.replace(/aws|amazon/i, ''),
        cost: this.products[code]
      };
    }).sort((a, b) => b.cost - a.cost);
  }

  /**
   * update
   *
   * @param {Record} record update self
   */
  update(record) {
    if (record.isTotal) {
      this.totalCost = record.totalCost;
    } else if (record.isService) {
      const code = record.productCode;
      if (this.products[code] === undefined) {
        this.products[code] = 0;
      }
      this.products[code] += record.totalCost;
    }
  }
}


/**
 * Report
 */
class Report {

  /**
   * constructor
   */
  constructor() {
    this.bills = {};
  }

  /**
   * Billing of total
   *
   * @return {Bill}
   */
  get total() {
    return this.bills.total;
  }

  /**
   * accounts
   *
   * @return {Bill[]}
   */
  get accounts() {
    return Object.keys(this.bills).filter(k => k !== 'total').map(k => {
      return this.bills[k];
    }).sort((a, b) => b.totalCost - a.totalCost);
  }

  /**
   * update
   *
   * @param {Record} record update self
   */
  update(record) {
    const id = record.isPayer ? 'total' : record.accountId;
    if (!this.bills[id]) {
      this.bills[id] = new Bill(record);
    }
    this.bills[id].update(record);
  }
}


/**
 * zero padding
 *
 * @param {number} number target number
 * @return {string}
 */
function pad(number) {
  if (number < PADDING_BASE_NUM) {
    return `0${number}`;
  }
  return number.toString();
}


/**
 * Kanjo
 */
export default class Kanjo {

  /**
   * constructor
   *
   * @param {string} account account id
   * @param {string} bucket bucket name
   * @param {string|undefined} region region
   */
  constructor({account, bucket, region}) {
    this.account = account;
    this.bucket = bucket;
    this.region = region;
  }

  /**
   * fetch billing data
   *
   * @param {number} year target year
   * @param {number} month target month
   * @return {Promise}
   */
  fetch(year, month) {
    const s3 = new AWS.S3({region: this.region});
    const key = `${this.account}-aws-billing-csv-${year}-${pad(month)}.csv`;
    return new Promise((resolve, reject) => {
      s3.getObject({
        Bucket: this.bucket,
        Key: key
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const report = new Report();
          csv.fromString(data.Body.toString('utf8'), {headers: true})
            .on('data', row => {
              report.update(new Record(row));
            })
            .on('end', () => resolve(report))
            .on('error', _err => reject(_err));
        }
      });
    });
  }
}
