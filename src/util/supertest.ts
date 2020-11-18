class SupertestExtended {
  public static statusOf(status: number[]) {
    return function (res: { status: number; }):void {
      if (!(status.includes(res.status)))
        throw new Error(`Incorrect status returned of ${res.status}. Expected one of ${status.join(', ')}`);
    };
  }
}
  
export default SupertestExtended;


