import events from 'events'
import mpv from './Mpv'
// 单行字幕
type Subtitle = {
    id: number,
    text: string,
    note: string,
    role: string,
    dialogs: string[],
    start: number,
    end: number
}
// 播放器状态
enum Status {
    Playing,
    Stop,
    Pause,
    Detecting, // 检测用户说话
    // Speaking, // 用户正在说话
};
// 播放模式
enum Modes {
    Normal,
    Shadowing, // 影子跟读
    RolePlaying, // 角色扮演
    Mixed, // 复述+跟读
}

// 播放器
class MediaPlayer extends events.EventEmitter {
    // 文件路径
    private _filePath: string | undefined;
    get filePath() {
        return this._filePath;
    }
    set filePath(value) {
        mpv.commands({
            command: ['loadfile', value],
        });
        this._filePath = value;
    }
    // 播放速度
    private _speed = 1;
    get speed() {
        return this._speed;
    }
    set speed(value) {
        mpv.commands({
            command: ['set_property', 'speed', value],
        });
        this._speed = value;
    }
    // 当前播放位置
    private _currentIndex = -1;
    get currentIndex() {
        return this._currentIndex;
    }
    set currentIndex(value) {
        if (value <= this.subtitles.length && value >= 0) {
            this._currentIndex = value;
        }
    }
    get currentSubtitle() {
        return this.subtitles[this.currentIndex];
    }
    status = Status.Stop;
    currentListTimes = 1;
    listTimes = 5;
    currentLineTimes = 1;
    lineTimes = 5;
    currentModeTimes = 1;
    modeTimes = 0;
    subtitles: Subtitle[] = [];
    roles = ['default'];
    selectedRoles = [0];
    dialogs = ['default'];
    selectedDialog = 0;
    modes: { [x: string]: any } = {};
    currentMode = 0;
    loopMode = false;
    constructor() {
        super();
        // 添加模式指令
        this.modes[Modes.Normal] = [
            () => mpv.commands(),
        ];
        this.modes[Modes.Shadowing] = [
            () => mpv.commands(),
            () => mpv.commands(),
        ];
        this.modes[Modes.RolePlaying] = [
            () => mpv.commands(),
        ];
        this.modes[Modes.Mixed] = [
            () => mpv.commands(),
            () => mpv.commands(),
            () => mpv.commands(),
        ];
        // 文件加载完成
        mpv.on('file-loaded', () => {

        });
        // 监听必要参数
        mpv.commands(
            { command: ['observe_property', 0, 'time-pos'] },
            { command: ['observe_property', 1, 'sub-start'] },
            { command: ['observe_property', 2, 'sub-end'] },
            { command: ['observe_property', 3, 'ab-loop-count'] },
            { command: ['observe_property', 4, 'ab-loop-b'] },
            { command: ['observe_property', 5, 'pause'] },
            { command: ['observe_property', 6, 'seeking'] }
        );
        // 参数变化回调
        mpv.on('property-change', ({ name, data }) => {
            switch (name) {
                case 'time-pos':
                    this.onTimePosUpdate(data);
                    this.emit('time-pos', data);
                    break;
                case 'sub-start':
                    this.onSubStart(data);
                    this.emit('sub-start', data);
                    break;
                case 'sub-end':
                    this.onSubEnd(data);
                    this.emit('sub-end', data);
                    break;
                case 'ab-loop-count':
                    this.onABLoopCount(data);
                    this.emit('ab-loop-count', data);
                    break;
                case 'ab-loop-b':
                    this.onABLoopB(data);
                    this.emit('ab-loop-b', data);
                    break;
                case 'pause':
                    this.onPause(data);
                    this.emit('pause', data);
                    break;
                case 'seeking':
                    this.onSeeking(data);
                    this.emit('seeking', data);
                    break;
            }
        });
    }
    private onTimePosUpdate(data: any) {

    }
    private onSubStart(data: any) {

    }
    private onSubEnd(data: any) {

    }
    private onABLoopCount(data: any) {

    }
    private onABLoopB(data: any) {

    }
    private onPause(data: any) {

    }
    private onSeeking(data: any) {

    }
    togglePlay() {

    }
}
export {
    Subtitle,
    Modes,
    Status,
    MediaPlayer
}
export default new MediaPlayer();