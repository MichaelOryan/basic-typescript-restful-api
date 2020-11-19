import Summary from './summary.interface';
import SummaryTable from './summary-table.interface';
import { v4 as uuidv4 } from 'uuid';
import Csv from './../../../util/csv';
import Result from '../../../interfaces/summary-result.interface';
import HttpStatusCode from '../../../util/html-codes.enum';
import { Worker } from 'worker_threads';
import ReportStatusCode from './status-codes.enum';
import Row from './../../../util/csv.row.interface';

class SummaryModel {
  private table: SummaryTable = {};

  public async addCsv(text: string): Promise<Result> {
    const id = this.newId();
    this.setSummaryStatus(id, ReportStatusCode.BUILDING);
    this.sendCsvToCalculateSummaryQueue(text, id);
    const result = await this.summaryAccessResponse(id);
    return result;
  }

  private setSummaryStatus(id: string, status:ReportStatusCode): void {
    this.table[id] = this.table[id] || {};
    this.table[id].status = status;
  }

  // Better to use worker pool but meh
  private sendCsvToCalculateSummaryQueue(text: string, id: string):void {
    const worker = new Worker('./dist/src/components/reports/summary/summary.worker.js', {
      workerData: {
        value: text,
        path: './summary.worker.js'
      }
    });
    worker.on('message', (result) => {
      this.addSummary(id, result);
    }).on('error', (err) => {
      this.setSummaryStatus(id, ReportStatusCode.GENERATION_FAILED);
    });
  }

  private addSummary(id: string, summary: Summary): string {
    this.table[id].summary = summary;
    this.table[id].status = ReportStatusCode.AVAILABLE;
    return id;
  }

  private newId(): string {
    return uuidv4();
  }

  private async summaryAccessResponse(id: string): Promise<Result> {
    return {
      status: await this.reportStatus(id),
      location: this.summaryRelativePath(id),
      data: this.summaryPostResponse(id),
    };
  }

  private summaryStatus(id: string): HttpStatusCode {
    if (this.summaryLoaded(id)) return HttpStatusCode.CREATED;
    else return HttpStatusCode.ACCEPTED;
    // if (this.summaryLoaded(id)) return HttpStatusCode.CREATED;
    // else return HttpStatusCode.ACCEPTED;
  }

  private summaryLoaded(id: string): boolean {
    return id in this.table;
  }

  private summaryRelativePath(id: string): string {
    return `/${id}`;
  }

  private summaryPostResponse(id: string): any {
    return {
      id: id,
    };
  }

  public static convertToCsv(text: string):Csv {
    return new Csv(text);
  }

  public static calculateSummary(csv: Csv): Summary {
    const summary: Summary = {
      averagePageViewsPerDay: SummaryModel.calculateAveragePageViewsPerDay(csv),
      userSessionRatio: 0,
      weeklyMaximumSessions: 0,
    };
    return summary;
  }

  public static calculateAveragePageViewsPerDay(csv: Csv): {[type:string]: number} {
    const uniqueValues = ((csv:Csv) => (field:string):string[] => Array.from(new Set(csv.rows().map(row => row[field]))))(csv);
    const totalViewsByTrafficType: {[type:string]: number} = {};
    const trafficTypeHeader = 'Traffic Type';
    const pageViewsHeader = 'Pageviews';
    // This needs cleaning up
    csv.rows().forEach((row:Row) => {
      if(!(row[trafficTypeHeader] in totalViewsByTrafficType))
        totalViewsByTrafficType[row[trafficTypeHeader]] = 0;
      totalViewsByTrafficType[row[trafficTypeHeader]] += Number(row[pageViewsHeader]);
      // totalViewsByTrafficType[row[trafficTypeHeader]] = (totalViewsByTrafficType[row[trafficTypeHeader]] || 0) + Number(row[pageViewsHeader]);
    });
    const days:number = daysBetweenEarliestAndLatest(uniqueValues('Date'));
    const averageDailyViewsByTrafficType: {[type:string]: number} = {};
    Object.entries(totalViewsByTrafficType)
      .map(([key, value]) => ([key, Number(value) / days]))
      .forEach(([key, value]) => averageDailyViewsByTrafficType[key] = Number(value));
    // Smells of an error somewhere to have undefined in here
    delete averageDailyViewsByTrafficType['undefined'];
    return averageDailyViewsByTrafficType;

    function daysBetweenEarliestAndLatest(rawDates: string[]):number {
      const dates = rawDates.filter(date => typeof date === 'string' && date.length === 8).map(date => [date.slice(0,4), date.slice(4, 6), date.slice(6, 8)].join('-')).map(date => Date.parse(date));
      const firstDate = Math.min(...dates);
      const lastDate = Math.max(...dates);

      const difference =  (lastDate - firstDate) / (1000 * 3600 * 24);
      return difference;

    }

  }

  public async summary(id: string): Promise<Summary> {
    if (id in this.table && this.table[id].status === ReportStatusCode.AVAILABLE) {
      return this.table[id].summary;
    } else {
      throw new Error(`${id} not available.`);
    }
  }

  public async reportStatus(id:string):Promise<ReportStatusCode> {
    if(id in this.table) {
      return this.table[id].status || ReportStatusCode.GENERATION_FAILED;
    } else {
      return ReportStatusCode.NOT_FOUND;
    }
  }

  public async averageDailyPageViews(id:string):Promise<Result> {
    const status = await this.reportStatus(id);
    if(status === ReportStatusCode.AVAILABLE)
      return SummaryModel.resultBuilder(status, this.table[id].summary.averagePageViewsPerDay);
    return SummaryModel.resultBuilder(status);
  }

  public static resultBuilder(result: ReportStatusCode, data: any = {}, location = ''): Result {
    return {
      status: result,
      data:data,
      location: location
    };
  }
}

export default SummaryModel;
