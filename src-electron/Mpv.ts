import child_process from "child_process";
import os from "os";
import events from "events";
import net from "net";
const isDevelopment = process.env.NODE_ENV !== "production";
const isWin32 = os.platform() === "win32";
class Mpv extends events.EventEmitter {
    mpvPath = `${!isDevelopment ? __dirname + "/../extraResources" : "./extraResources"}/mpv-0.33.0-x86_64/mpv`; // Path of mpv (defaults to mpv or mpv.exe)
    // mpvPath = "mpv-x86_64-20210815-git-0c9e1e3/mpv";
    socketPath = (isWin32 ? `\\\\.\\pipe\\mpv-socket-` : "/tmp/mpv-socket-") + Math.random().toString(36).slice(2);
    args = [
        "--no-config",
        "--msg-level=all=warn",
        "--idle=yes",
        "--no-input-default-bindings",
        "--keep-open=yes",
        "--force-window",
        `--input-conf=${this.mpvPath}/input.conf`,
        // "--load-scripts=yes",
        `--script=${this.mpvPath}/scripts/on_ab_loop_count_change.js`,
        `--input-ipc-server=${this.socketPath}`,
        "--hr-seek=yes",
        "--hr-seek-demuxer-offset=0.5",
        "--hr-seek-framedrop=yes"
    ]; // Arguments to child_process.spawn,
    options = {}; // Options to child_process.spawn,
    process = child_process.spawn(this.mpvPath, this.args, this.options);
    requests = new Map();
    socket = new net.Socket();
    observeId = 0;
    requestId = 0;
    queue = [] as string[];
    abLoopCount = 5;
    fileLoopCount = 3;
    modeLoopCount = 2;
    open = false;
    constructor() {
        super();
        this.socket.setEncoding("utf8");
        this.socket.connect(this.socketPath);
        // 连接错误
        this.socket.on("error", (e) => {
            // @ts-ignore
            if (e.code === 'ENOENT')
                this.socket.connect(this.socketPath);
            this.open = false;
        });
        // 连接成功
        this.socket.on("connect", () => {
            this.socket.write(this.queue.join());
            this.queue = [];
            this.open = true;
        });
        // 数据接收
        this.socket.on("data", data => {
            // 将字符转化为对象
            const array = data.toString()
                .split(/\r?\n/g)
                .filter(x => x)
                .map(x => JSON.parse(x.trim()));
            array.forEach((item) => {
                // 响应不同事件
                if (item.event) {
                    const eventName = item.event;
                    delete item.event;
                    return this.emit(eventName, item);
                }
                if (this.requests.has(item.request_id)) {
                    const requestId = item.request_id;
                    delete item.request_id;
                    this.requests.get(requestId)(item.error, item.data);
                    this.requests.delete(this.requestId);
                }
            });
        });
        this.socket.on("drain", () => {
            this.socket.write(this.queue.join());
            this.queue = [];
        });
        // 当播放器退出时
        // this.process.on("exit", () => {
        //     remote.app.quit();
        // });
        // // 当主程序退出时
        // remote.app.on("quit", () => {
        //     this.process.kill();
        //     this.socket.send("quit");
        // });
    }
    commands(...inputs: { command: any[], callback?: (error: string, data: any) => void }[]) {
        const message = inputs.map(input => {
            const { command, callback } = input;
            const requestId = this.requestId++;
            callback && this.requests.set(requestId, callback);
            return JSON.stringify({ command, request_id: requestId });
        }).join("\n") + "\n";
        this.socket.write(message) || this.queue.push(message);
    }

    on(eventName: "start-file", listener: (...args: any[]) => void): this
    on(eventName: "end-file", listener: (...args: any[]) => void): this
    on(eventName: "file-loaded", listener: (...args: any[]) => void): this
    on(eventName: "seek", listener: (...args: any[]) => void): this
    on(eventName: "playback-restart", listener: (...args: any[]) => void): this
    on(eventName: "shutdown", listener: (...args: any[]) => void): this
    on(eventName: "log-message", listener: (...args: any[]) => void): this
    on(eventName: "get-property-reply", listener: (...args: any[]) => void): this
    on(eventName: "set-property-reply", listener: (...args: any[]) => void): this
    on(eventName: "command-reply", listener: (...args: any[]) => void): this
    on(eventName: "client-message", listener: (...args: any[]) => void): this
    on(eventName: "video-reconfig", listener: (...args: any[]) => void): this
    on(eventName: "audio-reconfig", listener: (...args: any[]) => void): this
    on(eventName: "property-change", listener: (...args: any[]) => void): this
    on(eventName: string, listener: (...args: any[]) => void) {
        super.on(eventName, listener);
        return this;
    }

    once(eventName: "start-file", listener: (...args: any[]) => void): this
    once(eventName: "end-file", listener: (...args: any[]) => void): this
    once(eventName: "file-loaded", listener: (...args: any[]) => void): this
    once(eventName: "seek", listener: (...args: any[]) => void): this
    once(eventName: "playback-restart", listener: (...args: any[]) => void): this
    once(eventName: "shutdown", listener: (...args: any[]) => void): this
    once(eventName: "log-message", listener: (...args: any[]) => void): this
    once(eventName: "get-property-reply", listener: (...args: any[]) => void): this
    once(eventName: "set-property-reply", listener: (...args: any[]) => void): this
    once(eventName: "command-reply", listener: (...args: any[]) => void): this
    once(eventName: "client-message", listener: (...args: any[]) => void): this
    once(eventName: "video-reconfig", listener: (...args: any[]) => void): this
    once(eventName: "audio-reconfig", listener: (...args: any[]) => void): this
    once(eventName: "property-change", listener: (...args: any[]) => void): this
    once(eventName: string, listener: (...args: any[]) => void) {
        super.once(eventName, listener);
        return this;
    }
}
export default new Mpv();