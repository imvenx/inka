import electron from "electron";
import path from "path"
import { InkaConfig } from "../models/InkaConfig";
import { promises as p, readFileSync } from "fs"
import { logInkaError } from "../utils/utils";

export abstract class ConfigH {

    static configRootPath = path.join(electron.app.getPath('userData'), 'inkaConfig.json')
    private static config: InkaConfig = this.get()

    static readonly inkscapePath = () => this.config.inkscapePath
    static readonly windowSize = () => this.config?.windowSize
    static readonly windowPosition = () => this.config?.windowPosition

    private static get(): InkaConfig {
        try {
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
        this.save()
    }

    static async saveInkaWindowPosition(x: number, y: number) {
        this.config.windowPosition = { x: x, y: y }
        this.save()
    }
}

