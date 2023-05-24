import Peer, {DataConnection} from "peerjs";
import {v4 as uuid} from 'uuid';
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

type OnConnectionListener = (conn: DataConnection) => any;

class PeerService {
  client: Peer;
  id: string;
  onConnection: {
    listeners: OnConnectionListener[],
    addListener: (fn: OnConnectionListener) => any
  } = {
    listeners: [],
    addListener: (fn) => {
      this.onConnection.listeners.push(fn);
    }
  }

  initialize(id?: string) {
    if (!id) id = uuid();
    this.id = id;
    this.client = new Peer(id);

    this.client.on("connection", (conn) => {
      this.onConnection.listeners.forEach(fn => fn(conn));
    });

    this.client.on("error", error => {
      console.log(error);
    });
  }

  connect(peerId: string) {
    console.log('connecting', peerId);
    const conn = this.client.connect(peerId);
    conn.on("open", () => {
      console.log("connection opened");
    });
    conn.on("data", (data) => {
      console.log("Received data", data);
    });
    conn.on("error", () => {
      console.log("error");
    });
    conn.on("close", () => {
      console.log("close");
    });
  }

  getConnections() {
    return new Promise(resolve => {
      this.client.listAllPeers(resolve);
    });
  }
}

export default new PeerService();
