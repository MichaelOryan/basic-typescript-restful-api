import path from 'path';
import SummaryModel from './summary.model';
import Summary from './summary.interface';
import Csv from '../../../util/csv';
import { parentPort, workerData } from 'worker_threads';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('ts-node').register();
require(path.resolve(__dirname, workerData.path));


function calculateSummary(text: string): Summary {
  const csv:Csv = SummaryModel.convertToCsv(text);
  const summary:Summary = SummaryModel.calculateSummary(csv);
  return summary;
}
 
if(parentPort !== null){
  parentPort.postMessage(
    calculateSummary(workerData.value)
  );
}
