import express from 'express';
import Controller from './interfaces/controller.interface';

class App {
  private _app: express.Application;
  private _port: number;

  constructor(controllers: Controller[], port: number) {
    this._app = express();
    this._port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this._app.use(express.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller: Controller) => {
      this._app.use('/', controller.router);
    });
  }

  public listen(): App {
    this._app.listen(this._port, () => {
      console.log(`App listening on the port ${this._port}`);
    });
    return this;
  }

  public port(): number {
    return this._port;
  }

  public app(): express.Application {
    return this._app;
  }
}

export default App;
