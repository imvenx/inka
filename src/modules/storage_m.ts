import { LocalStorage } from "quasar";
import { Vector2 } from "../models/Vector2";
import { ConfigM } from "./config_m";

const _get = (k: string): any => {
    const r = LocalStorage.getItem<any>('p')
    if (r) return r[k]; else return
}
const _set = (k: string, v: any) => {
    const p: any = LocalStorage.getItem('p') ?? {}
    p[k] = v
    LocalStorage.set('p', p)
}
const _gGet = LocalStorage.getItem
const _gSet = LocalStorage.set

export const StorageM = {
    init: () => { if (ConfigM.inDebugMode) console.log('init storage module') },
    clearAll: () => LocalStorage.clear(),
    clearProject: () => {
        LocalStorage.remove('p')
        StorageM.setCurrentFilePath('')
    },

    getDuration: (): number => _get('duration') ?? 1,
    setDuration: (v: number) => _set('duration', v),

    getEditorScroll: (): Vector2 => _get('editorScroll') ?? new Vector2,
    setEditorScroll: (v: Vector2) => _set('editorScroll', v),

    getCurrentFilePath: (): string => _gGet('currentFilePath') ?? '',
    setCurrentFilePath: (v: string) => {
        _gSet('currentFilePath', v)
        StorageM.addToRecentFilePaths(v)
    },

    getRecentFilePaths: (): string[] => _gGet('recentFilePaths') ?? [],
    addToRecentFilePaths: (v: string) => {
        v = v.replace('.json', '')
        let recentFilePaths = StorageM.getRecentFilePaths()
        recentFilePaths = recentFilePaths.filter(x => x !== v)
        recentFilePaths.unshift(v)
        _gSet('recentFilePaths', recentFilePaths)
    },

    getKfs: (k: string): Keyframe[] => _get('kfs_' + k) ?? [],
    setKfs: (k: string, v: any) => _set('kfs_' + k, v),

    getProject: (): any => _gGet('p'),
    setProject: (v: any): any => _gSet('p', v),

    getProjectName: (): any => _get('projectName'),
    setProjectName: (v: any) => _set('projectName', v),
    getShowAttrs: (): any => _get('showAttrs') ?? {},
    setShowAttrs: (v: any) => _set('showAttrs', v),
    getUncollapsed: (): any => _get('uncollapsed') ?? {},
    setUncollapsed: (v: any) => _set('uncollapsed', v),

    getZoomPxTimePicker: (): any => _get('zoomPxTimePicker'),
    setZoomPxTimePicker: (v: any) => _set('zoomPxTimePicker', v),
}

