import electron from "electron";
import path from "path"
import { InkaConfig } from "../models/InkaConfig";
import { promises as p, readFileSync } from "fs"
import { logInkaError } from "../utils/utils";

export abstract class ConfigH {

    static workArea = { x: 0, y: 0, width: 0, height: 0 }
    static bounds = { x: 0, y: 0, width: 0, height: 0 }
    static barPos = "none"
    static barSize = 0
    static scaleFactor = 0
    static rotation = 0
    static configRootPath = path.join(electron.app.getPath('userData'), 'inkaConfig.json')
    static configInkDir = path.join(electron.app.getPath('userData'), 'inkscape')
    static configInkDirUI = path.join(electron.app.getPath('userData'), 'inkscape', 'ui')
    static configInkPREFS = path.join(electron.app.getPath('userData'), 'inkscape', 'preferences.xml')
    static configInkSRCPREFS = path.join('public','inka-inkscape-preferences-1.3.1.xml')
    private static config: InkaConfig = this.get()

    static readonly inkscapePath = () => this.config?.inkscapePath
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
      try {
        p.copyFile(ConfigH.configInkSRCPREFS, ConfigH.configInkPREFS)
      }
      catch (e) {
        logInkaError(e, 'Error on try set default css')
      }
      this.config.inkscapePath = undefined
      await this.save()
    }

    static async setWorkspace() {
      ConfigH.workArea = electron.screen.getPrimaryDisplay().workArea
      ConfigH.bounds = electron.screen.getPrimaryDisplay().bounds
      ConfigH.scaleFactor = electron.screen.getPrimaryDisplay().scaleFactor
      ConfigH.rotation = electron.screen.getPrimaryDisplay().rotation
      if (ConfigH.workArea.x) {
        ConfigH.barPos = "left"
        ConfigH.barSize = ConfigH.workArea.x
      } else if (ConfigH.workArea.y) {
        ConfigH.barPos = "top"
        ConfigH.barSize = ConfigH.workArea.y
      } else if (ConfigH.workArea.width < ConfigH.bounds.width) {
        ConfigH.barPos = "right"
        ConfigH.barSize = ConfigH.bounds.width - ConfigH.workArea.width
      } else if (ConfigH.workArea.height < ConfigH.bounds.height) {
        ConfigH.barPos = "bottom"
        ConfigH.barSize = ConfigH.bounds.height - ConfigH.workArea.height
      } else {
        ConfigH.barPos = "none"
        ConfigH.barSize = 0
      }
    }
}

