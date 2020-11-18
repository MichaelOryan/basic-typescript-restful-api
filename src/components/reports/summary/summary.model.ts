import Summary from './summary.interface';
import SummaryTable from './summaryTable.interface';
import { v4 as uuidv4 } from 'uuid';
import Csv from './../../../util/csv';

class SummaryModel {
  private table: SummaryTable = {};

  //   constructor() {}

  public addCsv(text: string): Promise<string> {
    return Promise.resolve('promise resolve')
      .then(SummaryModel.convertToCsv(text))
      .then(SummaryModel.calculateSummary)
      .then((summary) => this.addSummary(summary));
  }

  private addSummary(summary: Summary): string {
    const id = this.newId();
    this.table[id] = summary;
    return id;
  }

  private newId(): string {
    return uuidv4();
  }

  private static convertToCsv(text: string) {
    return (): Csv => new Csv(text);
  }

  private static calculateSummary(csv: Csv): Summary {
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
