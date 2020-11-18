import Summary from './summary.interface';
import SummaryTable from './summaryTable.interface';
import { v4 as uuidv4 } from 'uuid';
import Csv from './../../../util/csv';
import Result from './../../../interfaces/post.result.interface';
import HttpStatusCode from './../../../util/htmlcodes';
import { Worker } from 'worker_threads';

class SummaryModel {
  private table: SummaryTable = {};

  public async addCsv(text: string): Promise<Result> {
    const id = this.newId();
    this.sendCsvToCalculateSummaryQueue(text, id);
    return this.summaryAccessResponse(id);
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
      this.addSummary(id)(result);
    });
  }

  private addSummary(id: string): (summary: Summary) => string {
    return (summary: Summary): string => {
      this.table[id] = summary;
      return id;
    };
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

  public static convertToCsv(text: string) {
    return (): Csv => new Csv(text);
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
    if (id in this.table) {
      return this.table[id];
    } else {
      throw new Error(`${id} not found.`);
    }
  }
}

export default SummaryModel;
