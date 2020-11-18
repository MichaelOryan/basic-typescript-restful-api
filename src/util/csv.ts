class Csv {
  private _headers: string[] = [];
  private _rows: Row[] = [];

  // Simple text to csv for csv file with headers
  constructor(text: string) {
    const rows = text.split('\n');
    this._headers = Csv.rowToCells(rows[0]).filter((s) => s !== '');
    this._rows = rows.slice(1).map(Csv.toRow(this.headers()));
  }

  private static toRow(headers: string[]) {
    return function (text: string): Row {
      const cells = Csv.rowToCells(text);
      const row: Row = {};
      for (let column = 0; column < cells.length; column++) {
        row[headers[column]] = cells[column];
      }
      return row;
    };
  }

  private static rowToCells(text: string) {
    return text.split(',');
  }

  //   public static textToCsv(text: string) {

  //   }

  public headers(): string[] {
    return this._headers;
  }

  public rows(): Row[] {
    return this._rows;
  }

  public static csvFromPost(request: Request) {
    return (id: string) => Csv.csvFromRequest(request, id);
  }

  private static csvFromRequest(request: Request, id: string): CsvRows {
    return { headers: [], rows: [] };
  }
}

interface CsvRows {
  headers: string[];
  rows: Row[];
}

interface Row {
  [heading: string]: string;
}

export default Csv;
