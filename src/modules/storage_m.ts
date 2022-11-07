import { LocalStorage } from "quasar";
import { ref } from "vue";
import { Vector2 } from "../models/Vector2";
import { ConfigM } from "./config_m";


const _currentProjectId = ref<string>(LocalStorage.getItem('currentProjectId') ?? 'Temp')
const _get = (k: string): any => {
    const r = LocalStorage.getItem<any>(_currentProjectId.value)
    if (r) return r[k]; else return
}
const _set = (k: string, v: any) => {
    const proj: any = LocalStorage.getItem(ConfigM.projectId) ?? {}
    proj[k] = v
    LocalStorage.set(ConfigM.projectId, proj)
}
const _gGet = LocalStorage.getItem
const _gSet = LocalStorage.set

export const StorageM = {
    init: () => { if (ConfigM.inDebugMode) console.log('init storage module') },
    clear: () => LocalStorage.clear(),

    getAllProjects: (): any => {
        const all = LocalStorage.getAll()
        Object.keys(all).forEach(key => {
            if (!key.startsWith('id_')) delete all[key]
        })
        return Object.entries(all)
    },

    getEditorScroll: (): Vector2 => _get('editorScroll') ?? new Vector2,
    setEditorScroll: (v: Vector2) => _set('editorScroll', v),

    getFilePath: (): string => _get('filePath') ?? '',
    setFilePath: (v: string) => { _set('filePath', v) },

    getKfs: (k: string): Keyframe[] => _get(k) ?? [],
    setKfs: (k: string, v: any) => _set(k, v),

    getCurrentProjectId: (): any => _gGet('currentProjectId'),
    setCurrentProjectId: (v: any) => { _gSet('currentProjectId', v); _currentProjectId.value = v },

    // getProjectId: (): any => _get('ProjectId'),
    // setProjectId: (v: any) => _set('ProjectId', v),

    getShowAttrs: (): any => _get('showAttrs') ?? {},
    setShowAttrs: (v: any) => _set('showAttrs', v),
    getUncollapsed: (): any => _get('uncollapsed') ?? {},
    setUncollapsed: (v: any) => _set('uncollapsed', v),

    // getDynamically: (k: string): any => get(k),
    // setDynamically: (k: string, v: any) => set(k, v),
}