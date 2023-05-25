import Peer, {DataConnection} from "peerjs";
import {v4 as uuid} from 'uuid';

type OnConnectionListener = (conn: DataConnection, isIncoming: boolean) => any;
type OnDataListener = (data: any, conn: DataConnection) => any;
type OnCloseListener = (conn: DataConnection) => any;

class PeerService {
  client: Peer;
  id: string;
  connections: DataConnection[] = [];
  onConnection: {
    listeners: OnConnectionListener[],
    addListener: (fn: OnConnectionListener) => any
  } = {
    listeners: [],
    addListener: (fn) => {
      this.onConnection.listeners.push(fn);
    }
  }

  onData: {
    listeners: OnDataListener[],
    addListener: (fn: OnDataListener) => any
  } = {
    listeners: [],
    addListener: (fn) => {
      this.onData.listeners.push(fn);
    }
  }

  onClose: {
    listeners: OnCloseListener[],
    addListener: (fn: OnCloseListener) => any
  } = {
    listeners: [],
    addListener: (fn) => {
      this.onClose.listeners.push(fn);
    }
  }

  initialize(id?: string) {
    if (!id) id = uuid();
    this.id = id;
    this.client = new Peer(id);

    this.client.on("connection", (conn) => {
      // other client connected
      conn.on('open', () => {
        this.onConnection.listeners.forEach(fn => fn(conn, true));
        this.addConnection(conn);
      });
      conn.on("data", (data) => {
        this.onData.listeners.forEach(fn => fn(data, conn));
      });
      conn.on("close", () => {
        this.onClose.listeners.forEach(fn => fn(conn));
        this.removeConnection(conn);
      });
      conn.on("error", () => {
        this.onClose.listeners.forEach(fn => fn(conn));
        this.removeConnection(conn);
      })
    });

    this.client.on("error", error => {
      console.log(error);
    });
  }

  addConnection(connection: DataConnection) {
    if (!this.connections.find(x => x.connectionId === connection.connectionId)) {
      this.connections.push(connection);
    }
  }

  removeConnection(connection: DataConnection) {
    this.connections = this.connections.filter(conn => conn.connectionId !== connection.connectionId);
  }

  connect(peerId: string) {
    const conn = this.client.connect(peerId);
    conn.on("open", () => {
      this.addConnection(conn);
      this.onConnection.listeners.forEach(fn => fn(conn, false));
    });
    conn.on("data", (data) => {
      this.onData.listeners.forEach(fn => fn(data, conn));
    });
    conn.on("error", () => {
      this.onClose.listeners.forEach(fn => fn(conn));
      this.removeConnection(conn);
    });
    conn.on("close", () => {
      this.onClose.listeners.forEach(fn => fn(conn));
      this.removeConnection(conn);
    });
    return conn;
  }

  getConnections() {
    return new Promise(resolve => {
      this.client.listAllPeers(resolve);
    });
  }

  sendAll(message: any) {
    for (let conn of this.connections) {
      conn.send(message);
    }
  }

  disconnect() {
    if (!this.client) return;
    this.onConnection.listeners = [];
    this.onData.listeners = [];
    this.client.disconnect();
    this.client.destroy();
  }
}

export default new PeerService();
