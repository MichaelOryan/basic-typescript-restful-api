import 'dotenv/config';
import App from './app';
import Controllers from './components/controllers';
// import validateEnv from './utils/validateEnv';

// validateEnv();

class Server {
  private _app: App;

  constructor() {
    this._app = new App(Controllers.all(), Server.envPort());
  }

  public expressApp():Express.Application {
    return this._app.app();
  }

  public start():Server {
    this._app.listen();
    return this;
  }

  public static envPort():number {
    return Number(process.env.PORT || 3000);
  }

}

export default Server;