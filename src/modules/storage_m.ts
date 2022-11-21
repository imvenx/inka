import { LocalStorage } from "quasar";
import { ref } from "vue";
import { Vector2 } from "../models/Vector2";
import { ConfigM } from "./config_m";

// const _currentProjectId = ref<string>(LocalStorage.getItem('currentProjectId') ?? 'Temp')
// const _get = (k: string): any => {
//     const r = LocalStorage.getItem<any>(_currentProjectId.value)
//     if (r) return r[k]; return
// }
// // const  _set = (k: string, v: any) => {
// //     const proj: any = LocalStorage.getItem(ConfigM.projectId) ?? {}
// //     proj[k] = v
// //     LocalStorage.set(ConfigM.projectId, proj)
// // }

// const _set = async (fileName: string, data: any) =>
//     await eapi.writeProject(ConfigM.projectId, fileName, data)

// const _gGet = LocalStorage.getItem
// const _gSet = LocalStorage.set

// export const StorageM = {
//     init: () => { if (ConfigM.inDebugMode) console.log('init storage module') },
//     clear: () => LocalStorage.clear(),

//     getAllProjects: (): any => {
//         const all = LocalStorage.getAll()
//         Object.keys(all).forEach(key => {
//             if (!key.startsWith('id_')) delete all[key]
//         })
//         return Object.entries(all)
//     },

//     getDuration: (): number => _get('duration') ?? 1,
//     setDuration: async (v: number) => await _set('duration', v),

//     getEditorScroll: (): Vector2 => _get('editorScroll') ?? new Vector2,
//     setEditorScroll: async (v: Vector2) => await _set('editorScroll', v),

//     getFilePath: (): string => _get('filePath') ?? '',
//     setFilePath: async (v: string) => { await _set('filePath', v) },

//     getKfs: (k: string): Keyframe[] => _get(k) ?? [],
//     setKfs: async (k: string, v: any) => await _set(k, v),

//     getCurrentProjectId: (): any => _gGet('currentProjectId'),
//     setCurrentProjectId: (v: any) => { _gSet('currentProjectId', v); _currentProjectId.value = v },

//     getProjectName: (): any => _get('projectName'),
//     setProjectName: async (v: any) => { await _set('projectName', v) },

//     // getProjectId: (): any => _get('ProjectId'),
//     // setProjectId: (v: any) => await _set('ProjectId', v),

//     getShowAttrs: (): any => _get('showAttrs') ?? {},
//     setShowAttrs: async (v: any) => await _set('showAttrs', v),
//     getUncollapsed: (): any => _get('uncollapsed') ?? {},
//     setUncollapsed: async (v: any) => await _set('uncollapsed', v),

//     // getDynamically: (k: string): any => get(k),
//     // setDynamically: (k: string, v: any) => set(k, v),

//     getZoomPxTimePicker: (): any => _get('zoomPxTimePicker'),
//     setZoomPxTimePicker: async (v: any) => await _set('zoomPxTimePicker', v),
// }

const _currentProjectId = ref<string>(LocalStorage.getItem('currentProjectId') ?? 'Temp')
const _get = (k: string): any => {
    const r = LocalStorage.getItem<any>('p')
    if (r) return r[k]; else return
}
const _set = (k: string, v: any) => {
    const p: any = LocalStorage.getItem('p') ?? {}
    p[k] = v
    LocalStorage.set('p', p)
    // LocalStorage.set(ConfigM.projectId, proj)
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

    // getAllProjects: (): any => {
    //     const all = LocalStorage.getAll()
    //     Object.keys(all).forEach(key => {
    //         if (!key.startsWith('id_')) delete all[key]
    //     })
    //     return Object.entries(all)
    // },

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

    // getCurrentProject: (): any => _gGet(_currentProjectId.value),

    // getCurrentProjectId: (): any => _gGet('currentProjectId'),
    // setCurrentProjectId: (v: any) => { _gSet('currentProjectId', v); _currentProjectId.value = v },

    getProject: (): any => _gGet('p'),
    setProject: (v: any): any => _gSet('p', v),

    getProjectName: (): any => _get('projectName'),
    setProjectName: (v: any) => _set('projectName', v),

    // getProjectId: (): any => _get('ProjectId'),
    // setProjectId: (v: any) => _set('ProjectId', v),

    getShowAttrs: (): any => _get('showAttrs') ?? {},
    setShowAttrs: (v: any) => _set('showAttrs', v),
    getUncollapsed: (): any => _get('uncollapsed') ?? {},
    setUncollapsed: (v: any) => _set('uncollapsed', v),

    // getDynamically: (k: string): any => get(k),
    // setDynamically: (k: string, v: any) => set(k, v),

    getZoomPxTimePicker: (): any => _get('zoomPxTimePicker'),
    setZoomPxTimePicker: (v: any) => _set('zoomPxTimePicker', v),
}

