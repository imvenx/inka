import electron from "electron";
import path from "path"
import { InkaConfig } from "../models/InkaConfig";
import { promises as p, readFileSync, mkdir , existsSync} from "fs"
import { logInkaError } from "../utils/utils";

export abstract class ConfigH {

    static configRootPath = path.join(electron.app.getPath('userData'), 'inkaConfig.json')
    static configInkDir = path.join(electron.app.getPath('userData'), 'inkscape')
    static configInkDirUI = path.join(electron.app.getPath('userData'), 'inkscape', 'ui')
    static configInkDirUICSS = path.join(electron.app.getPath('userData'), 'inkscape', 'ui', 'user.css')

    private static config: InkaConfig = this.get()

    static readonly inkscapePath = () => this.config?.inkscapePath
    static readonly windowSize = () => this.config?.windowSize
    static readonly windowPosition = () => this.config?.windowPosition

    private static get(): InkaConfig {
        try {
            if (!existsSync(ConfigH.configInkDir)) mkdir(ConfigH.configInkDir, (err) => console.log(err));
            if (!existsSync(ConfigH.configInkDirUI)) mkdir(ConfigH.configInkDirUI, (err) => console.log(err));
            const configFileString = readFileSync(ConfigH.configRootPath, 'utf-8')
            return JSON.parse(configFileString)
        } catch (e) {
            console.log(e, 'Error on try get config')
            this.save()
            return {} as InkaConfig
        }
    }

    private static async save(): Promise<boolean> {
        try {
            if (!this.config) this.config = {} as InkaConfig
            await p.writeFile(ConfigH.configRootPath, JSON.stringify(this.config), { encoding: 'utf-8' })
            return true
        }
        catch (e) {
            logInkaError(e, 'Error on try set config')
            return false
        }
    }

    static async saveInkaWindowSize(width: number, height: number) {
        this.config.windowSize = { width: width, height: height }
        await this.save()
    }

    static async saveInkaWindowPosition(x: number, y: number) {
        this.config.windowPosition = { x: x, y: y }
        await this.save()
    }

    static async saveInkscapePath(path: string) {
      this.config.inkscapePath = path
      await this.save()

    }

    static async resetInkscapePath() {
      this.config.inkscapePath = undefined
      await this.save()
    }
}

