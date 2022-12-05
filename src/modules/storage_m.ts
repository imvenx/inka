import { LocalStorage } from "quasar";
import { Vector2 } from "../models/Vector2";

export abstract class StorageM {

    static getDuration = (): number => this.get('duration') ?? 1
    static setDuration = (v: number) => this.set('duration', v)

    static getEditorScroll = (): Vector2 => this.get('editorScroll') ?? new Vector2
    static setEditorScroll = (v: Vector2) => this.set('editorScroll', v)

    static getCurrentFilePath = (): string => this.gGet('currentFilePath') ?? ''
    static setCurrentFilePath = (v: string) => {
        this.gSet('currentFilePath', v)
        this.addToRecentFilePaths(v)
    }

    static getRecentFilePaths = (): string[] => this.gGet('recentFilePaths') ?? []
    static addToRecentFilePaths = (v: string) => {
        if (v === "") return
        v = v.replace('.json', '')
        let recentFilePaths = this.getRecentFilePaths()
        recentFilePaths = recentFilePaths.filter(x => x !== v)
        recentFilePaths.unshift(v)
        this.gSet('recentFilePaths', recentFilePaths)
    }

    static getKfs = (k: string): Keyframe[] => this.get('kfs_' + k) ?? []
    static setKfs = (k: string, v: any) => this.set('kfs_' + k, v)

    static getProject = (): any => this.gGet('p')
    static setProject = (v: any): any => this.gSet('p', v)

    static getProjectName = (): any => this.get('projectName')
    static setProjectName = (v: any) => this.set('projectName', v)
    static getShowAttrs = (): any => this.get('showAttrs') ?? {}
    static setShowAttrs = (v: any) => this.set('showAttrs', v)
    static getUncollapsed = (): any => this.get('uncollapsed') ?? {}
    static setUncollapsed = (v: any) => this.set('uncollapsed', v)

    static getZoomPxTimePicker = (): any => this.get('zoomPxTimePicker')
    static setZoomPxTimePicker = (v: any) => this.set('zoomPxTimePicker', v)


    private static get = (k: string): any => {
        const r = LocalStorage.getItem<any>('p')
        if (r) return r[k]; else return
    }
    private static set = (k: string, v: any) => {
        const p: any = LocalStorage.getItem('p') ?? {}
        p[k] = v
        LocalStorage.set('p', p)
    }
    private static gGet = LocalStorage.getItem
    private static gSet = LocalStorage.set

}
