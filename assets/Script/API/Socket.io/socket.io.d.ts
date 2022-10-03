declare var io: {
  connect (url: string, any: any): Socket;
};
interface Socket {
  on (event: string, callback: (data: any) => void);
  emit (Event: string, data: any)
}
// Declare the shape of "socket.io-client/dist/socket.io.js"
declare module "socket.io-client/dist/socket.io.js" {
  export * from "socket.io-client";
}