import Summary from './summary.interface';
import SummaryTable from './summaryTable.interface';
import { v4 as uuidv4 } from 'uuid';
import Csv from './../../../util/csv';
import Result from './../../../interfaces/post.result.interface';
import HttpStatusCode from './../../../util/htmlcodes';
import { Worker } from 'worker_threads';
import ReportStatusCode from './summary-report-status-codes';

class SummaryModel {
  private table: SummaryTable = {};

  public async addCsv(text: string): Promise<Result> {
    const id = this.newId();
    this.setSummaryStatus(id, ReportStatusCode.BUILDING);
    this.sendCsvToCalculateSummaryQueue(text, id);
    return this.summaryAccessResponse(id);
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
    this.table[id].summery = summary;
    this.table[id].status = ReportStatusCode.AVAILABLE;
    return id;
  }

  private newId(): string {
    return uuidv4();
  }

  private summaryAccessResponse(id: string): Result {
    return {
      status: this.summaryStatus(id),
      location: this.summaryRelativePath(id),
      data: this.summaryPostResponse(id),
    };
  }

  private summaryStatus(id: string): HttpStatusCode {
    if (this.summaryLoaded(id)) return HttpStatusCode.CREATED;
    else return HttpStatusCode.ACCEPTED;
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
      averagePageViewsPerDay: 0,
      userSessionRatio: 0,
      weeklyMaximumSessions: 0,
    };
    return summary;
  }

  public async summary(id: string): Promise<Summary> {
    if (id in this.table && this.table[id].status === ReportStatusCode.AVAILABLE) {
      return this.table[id].summery;
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
}

export default SummaryModel;
